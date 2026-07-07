import { useEffect, useRef, useState, useCallback } from 'react';
import Icon from '@/components/ui/icon';
import { videoApi, VideoEvent } from '@/api/video';

interface Props {
  taskId: string;
  onClose: () => void;
}

const eventMeta = (type: string) => {
  const t = (type || '').toLowerCase();
  if (t.includes('наруш') || t.includes('violat') || t.includes('alert'))
    return { color: 'text-red-500', bg: 'bg-red-50', icon: 'TriangleAlert' };
  return { color: 'text-brand', bg: 'bg-brand-light', icon: 'Activity' };
};

const fmtTime = (sec: number) => {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
};

export default function VideoAnalysis({ taskId, onClose }: Props) {
  const [status, setStatus] = useState<'pending' | 'processing' | 'done' | 'error'>('pending');
  const [progress, setProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [events, setEvents] = useState<VideoEvent[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [preparing, setPreparing] = useState(false);
  const [prepareAttempt, setPrepareAttempt] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const resolvedRef = useRef(false);
  const failCountRef = useRef(0);

  const poll = useCallback(async () => {
    if (resolvedRef.current) return;
    try {
      const s = await videoApi.status(taskId);
      console.log('[video] status response:', JSON.stringify(s));
      failCountRef.current = 0;
      setStatus(s.status);
      setProgress(s.progress ?? 0);

      if (s.status === 'done' || s.status === 'error') {
        resolvedRef.current = true;
      }

      if (s.status === 'error') {
        setErrorMsg(s.error || null);
      }

      if (s.status === 'done') {
        setPreparing(true);
        const r = await videoApi.result(taskId);
        console.log('[video] result response:', JSON.stringify(r));
        setEvents(r.events || []);
        try {
          const url = await videoApi.resolveVideoUrl(r.video_url, (attempt) => {
            if (attempt > 1) setPrepareAttempt(attempt);
          });
          console.log('[video] resolved CDN url:', url);
          setVideoUrl(url);
        } catch (e) {
          console.error('[video] resolveVideoUrl failed:', e);
          setStatus('error');
          setErrorMsg('Видео обработано, но не удалось его загрузить. Попробуйте загрузить его ещё раз.');
        } finally {
          setPreparing(false);
        }
      }
    } catch (e) {
      console.error('[video] poll error:', e);
      // Сервер анализа может временно отвечать ошибкой (например, 500),
      // пока идёт обработка. Не роняем весь процесс из-за разовых сбоев —
      // показываем ошибку только если сервер недоступен долго подряд.
      failCountRef.current += 1;
      if (failCountRef.current >= 10) {
        resolvedRef.current = true;
        setStatus('error');
        setErrorMsg('Сервер анализа долго не отвечает. Попробуйте позже.');
      }
    }
  }, [taskId]);

  useEffect(() => {
    poll();
    const id = setInterval(() => {
      setStatus(prev => {
        if (prev === 'done' || prev === 'error') { clearInterval(id); return prev; }
        return prev;
      });
      poll();
    }, 3000);
    return () => clearInterval(id);
  }, [poll]);

  const seekTo = (sec: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = sec;
      videoRef.current.play();
    }
  };

  return (
    <div className="bg-white rounded-2xl card-shadow p-6 animate-fade-up">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 blue-gradient rounded-xl flex items-center justify-center">
            <Icon name="Sparkles" size={16} className="text-white" />
          </div>
          <h2 className="text-base font-bold text-foreground">Результат AI-анализа</h2>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
          <Icon name="X" size={18} />
        </button>
      </div>

      {status !== 'error' && (!videoUrl) && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Icon name="LoaderCircle" size={32} className="text-brand animate-spin mb-3" />
          {preparing || (status === 'done' && !videoUrl) ? (
            <>
              <p className="text-sm font-medium text-foreground">Готовим видео к просмотру…</p>
              <p className="text-xs text-muted-foreground mt-1">
                {prepareAttempt > 1
                  ? 'Видео длинное, перенос занимает чуть больше времени…'
                  : 'Загружаем результат, это займёт несколько секунд'}
              </p>
            </>
          ) : (
            <>
              <p className="text-sm font-medium text-foreground">Видео обрабатывается…</p>
              <p className="text-xs text-muted-foreground mt-1">Прогресс: {progress}%</p>
              <div className="w-64 h-1.5 bg-secondary rounded-full mt-3 overflow-hidden">
                <div className="h-full bg-brand transition-all" style={{ width: `${progress}%` }} />
              </div>
            </>
          )}
        </div>
      )}



      {status === 'error' && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Icon name="CircleAlert" size={32} className="text-red-500 mb-3" />
          <p className="text-sm font-medium text-foreground">Не удалось обработать видео</p>
          {errorMsg && (
            <div className="mt-3 max-w-md bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <p className="text-xs text-red-600 break-words">{errorMsg}</p>
            </div>
          )}
        </div>
      )}

      {videoUrl && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="rounded-xl overflow-hidden bg-black">
            <video ref={videoRef} src={videoUrl} controls className="w-full aspect-video" />
          </div>

          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Обнаружено нарушений: {events.length}
            </p>
            {events.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6 text-center">Нарушений не обнаружено</p>
            ) : (
              <ul className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {events.map((ev, i) => {
                  const m = eventMeta(ev.event_type);
                  return (
                    <li
                      key={i}
                      onClick={() => seekTo(ev.timestamp_sec)}
                      className="flex items-center gap-3 bg-secondary rounded-xl px-3 py-2.5 cursor-pointer hover:bg-secondary/70 transition-colors"
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${m.bg}`}>
                        <Icon name={m.icon} size={14} className={m.color} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{ev.name || '—'}</p>
                        <p className="text-xs text-muted-foreground truncate">{ev.details || '—'}</p>
                      </div>
                      <span className="text-xs font-mono text-brand flex-shrink-0">{fmtTime(ev.timestamp_sec)}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}