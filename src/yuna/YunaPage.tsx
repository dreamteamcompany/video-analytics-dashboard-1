import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { yunaApi, Utterance, Analysis, YunaSession, YunaStats } from './api';
import { useAuth } from './useAuth';
import { useRecorder } from './useRecorder';
import YunaDashboard from './YunaDashboard';
import { YunaStyles, YunaFooter } from './YunaChrome';
import YunaHeader from './YunaHeader';
import YunaDoctorPanel from './YunaDoctorPanel';
import YunaPatientPanel from './YunaPatientPanel';

const YunaPage = () => {
  const navigate = useNavigate();
  const { doctor: currentDoctor, logout } = useAuth();
  const { state, seconds, level, silent, error: recError, start, pause, resume, stop, cancel } = useRecorder();
  const [processing, setProcessing] = useState(false);
  const [utterances, setUtterances] = useState<Utterance[]>([]);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sessions, setSessions] = useState<YunaSession[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [stats, setStats] = useState<YunaStats | null>(null);
  const [ratingKey, setRatingKey] = useState(0);
  const doctorId = currentDoctor?.id ?? null;

  const handleLogout = async () => {
    await logout();
    navigate('/yuna/login', { replace: true });
  };

  const loadSessions = useCallback(async () => {
    try {
      setSessions(await yunaApi.listSessions(doctorId));
    } catch {
      /* silent */
    } finally {
      setLoadingSessions(false);
    }
  }, [doctorId]);

  const loadStats = useCallback(async () => {
    try {
      setStats(await yunaApi.stats(doctorId));
    } catch {
      /* silent */
    }
  }, [doctorId]);

  useEffect(() => {
    if (doctorId == null) return;
    loadSessions();
    loadStats();
  }, [doctorId, loadSessions, loadStats]);

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
      const res = await yunaApi.transcribe(result.base64, result.format, result.durationSec, doctorId);
      setUtterances(res.utterances);
      setAnalysis(res.analysis);
      if (res.utterances.length === 0) {
        setError('В записи не распознана речь. Говорите ближе к микрофону.');
      } else {
        loadSessions();
        loadStats();
        setRatingKey((k) => k + 1);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Не удалось обработать запись');
    } finally {
      setProcessing(false);
    }
  };

  const recording = state !== 'idle';

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)' }}>
      <YunaStyles />

      <div className="container mx-auto px-4 py-6 max-w-[1600px]">
        {/* Хедер с индикацией статуса Юны */}
        <YunaHeader currentDoctor={currentDoctor} onLogout={handleLogout} />

        {/* Дашборд по реальным сессиям */}
        {!loadingSessions && (
          <div className="mb-6">
            <YunaDashboard sessions={sessions} />
          </div>
        )}

        {/* Основная сетка */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* ЛЕВЫЙ САЙДБАР - РАЗДЕЛ ВРАЧА */}
          <YunaDoctorPanel
            state={state}
            seconds={seconds}
            level={level}
            silent={silent}
            recording={recording}
            processing={processing}
            recError={recError}
            error={error}
            analysis={analysis}
            ratingKey={ratingKey}
            start={start}
            pause={pause}
            resume={resume}
            cancel={cancel}
            onStop={handleStop}
          />

          {/* ЦЕНТРАЛЬНАЯ И ПРАВАЯ КОЛОНКИ - РАЗДЕЛ ПАЦИЕНТА */}
          <YunaPatientPanel
            state={state}
            seconds={seconds}
            processing={processing}
            analysis={analysis}
            utterances={utterances}
            sessions={sessions}
            loadingSessions={loadingSessions}
            stats={stats}
          />
        </div>

        {/* Футер */}
        <YunaFooter />
      </div>
    </div>
  );
};

export default YunaPage;
