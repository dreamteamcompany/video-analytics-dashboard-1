import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { yunaApi, Utterance, Analysis, YunaSession } from './api';
import { useRecorder } from './useRecorder';
import { fmtTime } from './utils';
import TranscriptView from './TranscriptView';
import AnalysisReport from './AnalysisReport';
import SessionHistory from './SessionHistory';
import YunaDashboard from './YunaDashboard';

const YunaPage = () => {
  const { state, seconds, level, error: recError, start, pause, resume, stop, cancel } = useRecorder();
  const [processing, setProcessing] = useState(false);
  const [utterances, setUtterances] = useState<Utterance[]>([]);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sessions, setSessions] = useState<YunaSession[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);

  const loadSessions = useCallback(async () => {
    try {
      setSessions(await yunaApi.listSessions());
    } catch {
      /* silent */
    } finally {
      setLoadingSessions(false);
    }
  }, []);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  const handleStop = async () => {
    const result = await stop();
    if (!result || !result.base64) {
      setError('Запись пустая. Попробуйте ещё раз.');
      return;
    }
    setProcessing(true);
    setError(null);
    setUtterances([]);
    setAnalysis(null);
    try {
      const res = await yunaApi.transcribe(result.base64, result.format, result.durationSec);
      setUtterances(res.utterances);
      setAnalysis(res.analysis);
      if (res.utterances.length === 0) {
        setError('В записи не распознана речь. Говорите ближе к микрофону.');
      } else {
        loadSessions();
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Не удалось обработать запись');
    } finally {
      setProcessing(false);
    }
  };

  const recording = state !== 'idle';

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
              <Icon name="Sparkles" size={22} className="text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Юна</h1>
              <p className="text-sm text-muted-foreground">Анализ приёма врач-пациент</p>
            </div>
          </div>
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-1.5">
              <Icon name="ArrowLeft" size={16} />
              На главную
            </Button>
          </Link>
        </div>

        {/* dashboard */}
        {!loadingSessions && <YunaDashboard sessions={sessions} />}

        {/* recorder */}
        <Card className="p-6 mb-6">
          <div className="flex flex-col items-center text-center">
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 transition-colors ${
                state === 'recording'
                  ? 'bg-red-100'
                  : state === 'paused'
                  ? 'bg-amber-100'
                  : 'bg-primary/10'
              }`}
            >
              <Icon
                name={state === 'recording' ? 'Mic' : state === 'paused' ? 'Pause' : 'Mic'}
                size={34}
                className={
                  state === 'recording'
                    ? 'text-red-500 animate-pulse'
                    : state === 'paused'
                    ? 'text-amber-500'
                    : 'text-primary'
                }
              />
            </div>

            {recording ? (
              <>
                {state === 'recording' && (
                  <div className="flex items-center gap-1.5 mb-2 px-2.5 py-1 rounded-full bg-red-100">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-xs font-semibold text-red-600 tracking-wide">REC</span>
                  </div>
                )}
                <p className="text-3xl font-bold text-foreground tabular-nums mb-1">
                  {fmtTime(seconds)}
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  {state === 'recording' ? 'Идёт запись приёма…' : 'На паузе'}
                </p>

                {/* индикатор уровня звука */}
                <div className="flex items-end justify-center gap-1 h-10 mb-5 w-full max-w-xs">
                  {Array.from({ length: 24 }).map((_, i) => {
                    const threshold = (i + 1) / 24;
                    const active = state === 'recording' && level >= threshold * 0.9;
                    const h = 20 + threshold * 80;
                    return (
                      <span
                        key={i}
                        className={`flex-1 rounded-full transition-all duration-75 ${
                          active ? 'bg-primary' : 'bg-secondary'
                        }`}
                        style={{ height: active ? `${h}%` : '20%' }}
                      />
                    );
                  })}
                </div>

                <div className="flex items-center gap-3">
                  {state === 'recording' ? (
                    <Button variant="outline" onClick={pause} className="gap-1.5">
                      <Icon name="Pause" size={16} /> Пауза
                    </Button>
                  ) : (
                    <Button variant="outline" onClick={resume} className="gap-1.5">
                      <Icon name="Play" size={16} /> Продолжить
                    </Button>
                  )}
                  <Button onClick={handleStop} className="gap-1.5">
                    <Icon name="Square" size={16} /> Завершить
                  </Button>
                  <Button variant="ghost" onClick={cancel} className="text-muted-foreground">
                    Отмена
                  </Button>
                </div>
              </>
            ) : (
              <>
                <p className="text-base font-medium text-foreground mb-1">Готов к записи</p>
                <p className="text-sm text-muted-foreground mb-5 max-w-sm">
                  Нажмите «Начать приём» и говорите. После завершения запись расшифруется
                  и разделится на реплики врача и пациента.
                </p>
                <Button size="lg" onClick={start} disabled={processing} className="gap-2">
                  <Icon name="Mic" size={18} /> Начать приём
                </Button>
              </>
            )}
          </div>
        </Card>

        {(recError || error) && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <p className="text-sm text-red-600">{recError || error}</p>
          </div>
        )}

        {processing && (
          <Card className="p-6 mb-6">
            <div className="flex flex-col items-center text-center">
              <Icon name="LoaderCircle" size={28} className="text-primary animate-spin mb-3" />
              <p className="text-sm font-medium text-foreground">Обрабатываем приём…</p>
              <p className="text-xs text-muted-foreground mt-1">
                ИИ расшифровывает речь, разделяет реплики и оценивает приём
              </p>
            </div>
          </Card>
        )}

        {!processing && analysis && <AnalysisReport analysis={analysis} />}
        {!processing && utterances.length > 0 && (
          <div className="mb-6">
            <TranscriptView utterances={utterances} />
          </div>
        )}

        <SessionHistory sessions={sessions} loading={loadingSessions} />
      </div>
    </div>
  );
};

export default YunaPage;