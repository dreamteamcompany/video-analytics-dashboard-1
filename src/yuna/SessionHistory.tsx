import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { YunaSession } from './api';
import { fmtTime, fmtDate, scoreColor } from './utils';

const SessionHistory = ({
  sessions,
  loading,
}: {
  sessions: YunaSession[];
  loading: boolean;
}) => {
  const navigate = useNavigate();
  const [playing, setPlaying] = useState<number | null>(null);

  return (
    <Card className="p-5">
      <div className="flex items-center gap-2 mb-4">
        <Icon name="History" size={18} className="text-primary" />
        <h2 className="font-semibold text-foreground">История приёмов</h2>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <Icon name="LoaderCircle" size={24} className="text-primary animate-spin" />
        </div>
      ) : sessions.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">
          Пока нет приёмов. Запишите первый выше.
        </p>
      ) : (
        <div className="space-y-2">
          {sessions.map((s) => {
            const c = s.overall != null ? scoreColor(s.overall) : null;
            const isPlaying = playing === s.id;
            return (
              <div
                key={s.id}
                className="rounded-xl border border-border hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-center gap-3 px-3 py-2.5">
                  {s.audio_url ? (
                    <button
                      onClick={() => setPlaying(isPlaying ? null : s.id)}
                      className="w-9 h-9 rounded-lg bg-primary/10 hover:bg-primary/20 flex items-center justify-center flex-shrink-0 transition-colors"
                      title={isPlaying ? 'Скрыть плеер' : 'Прослушать запись'}
                    >
                      <Icon name={isPlaying ? 'X' : 'Play'} size={16} className="text-primary" />
                    </button>
                  ) : (
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon name="Stethoscope" size={16} className="text-primary" />
                    </div>
                  )}
                  <button
                    onClick={() => navigate(`/yuna/${s.id}`)}
                    className="flex-1 min-w-0 text-left"
                  >
                    <p className="text-sm font-medium text-foreground truncate">
                      {s.title || 'Приём'} · {fmtDate(s.created_at)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Длительность {fmtTime(s.duration_sec)}
                      {s.audio_url ? ' · есть запись' : ''}
                    </p>
                  </button>
                  {c && s.overall != null && (
                    <div className={`px-2.5 py-1 rounded-lg ${c.bg} flex-shrink-0`}>
                      <span className={`text-sm font-bold ${c.text}`}>{s.overall}</span>
                    </div>
                  )}
                  <button onClick={() => navigate(`/yuna/${s.id}`)} className="flex-shrink-0">
                    <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
                  </button>
                </div>
                {isPlaying && s.audio_url && (
                  <div className="px-3 pb-3">
                    <audio src={s.audio_url} controls autoPlay className="w-full h-9">
                      Ваш браузер не поддерживает воспроизведение аудио.
                    </audio>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};

export default SessionHistory;