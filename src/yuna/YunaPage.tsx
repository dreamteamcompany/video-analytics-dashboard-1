import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { yunaApi, Utterance, Analysis, YunaSession, YunaStats } from './api';
import { useAuth } from './useAuth';
import { useRecorder } from './useRecorder';
import { fmtTime } from './utils';
import TranscriptView from './TranscriptView';
import AnalysisReport from './AnalysisReport';
import SessionHistory from './SessionHistory';
import YunaDashboard from './YunaDashboard';
import DentalReport from './DentalReport';
import { TacticsReport, ComplicationsReport, TreatmentReport } from './PatientReports';
import {
  AnesthesiaBlock,
  AutoFillBlock,
  CurrentPatientBlock,
  LoyaltyBlock,
  UpsellBlock,
  DrugControlBlock,
  DoctorStateBlock,
} from './LiveBlocks';
import { RatingBlock, AutoJournalsBlock, KpiBlock, LearningBlock } from './DoctorBlocks';

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
      <style>{`
        @keyframes yuna-pulse { 0% { transform: scale(1); } 50% { transform: scale(1.02); } 100% { transform: scale(1); } }
        @keyframes yuna-protocol-glow { from { box-shadow: 0 0 10px rgba(59, 130, 246, 0.3); } to { box-shadow: 0 0 20px rgba(59, 130, 246, 0.6); } }
        @keyframes yuna-anesthesia-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.02); } }
        @keyframes yuna-alert-pulse { 0%, 100% { background-color: #fef2f2; } 50% { background-color: #fecaca; } }
        @keyframes yuna-training-glow { from { box-shadow: 0 0 10px rgba(139, 92, 246, 0.3); } to { box-shadow: 0 0 20px rgba(139, 92, 246, 0.6); } }
        @keyframes yuna-treatment-glow { 0%, 100% { box-shadow: 0 0 10px rgba(34, 197, 94, 0.3); } 50% { box-shadow: 0 0 20px rgba(34, 197, 94, 0.6); } }
        @keyframes yuna-prediction-glow { from { box-shadow: 0 0 10px rgba(139, 92, 246, 0.3); } to { box-shadow: 0 0 20px rgba(139, 92, 246, 0.6); } }
        @keyframes yuna-auto-fill-glow { 0%, 100% { box-shadow: 0 0 5px rgba(34, 197, 94, 0.5); } 50% { box-shadow: 0 0 15px rgba(34, 197, 94, 0.8); } }
        @keyframes yuna-stress-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        @keyframes yuna-coaching-glow { from { box-shadow: 0 0 10px rgba(168, 85, 247, 0.3); } to { box-shadow: 0 0 20px rgba(168, 85, 247, 0.6); } }
        @keyframes yuna-voice-automation { 0%, 100% { box-shadow: 0 0 10px rgba(59, 130, 246, 0.3); } 50% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.6); } }
        @keyframes yuna-voice-level { 0% { transform: scaleY(0.3); } 100% { transform: scaleY(1); } }
        @keyframes yuna-upsell-pulse { from { box-shadow: 0 0 10px rgba(245, 158, 11, 0.3); } to { box-shadow: 0 0 20px rgba(245, 158, 11, 0.6); } }
        .yuna-voice-automation { animation: yuna-voice-automation 3s ease-in-out infinite; }
        .yuna-protocol-glow { animation: yuna-protocol-glow 2s ease-in-out infinite alternate; }
        .yuna-anesthesia-calc { animation: yuna-anesthesia-pulse 3s ease-in-out infinite; }
        .yuna-contraindication-alert { animation: yuna-alert-pulse 1.5s ease-in-out infinite; }
        .yuna-training-rec { animation: yuna-training-glow 2s ease-in-out infinite alternate; }
        .yuna-treatment-recommendation { animation: yuna-treatment-glow 3s ease-in-out infinite; }
        .yuna-prediction-glow { animation: yuna-prediction-glow 2s ease-in-out infinite alternate; }
        .yuna-auto-fill-glow { animation: yuna-auto-fill-glow 2s ease-in-out infinite; }
        .yuna-stress-pulse { animation: yuna-stress-pulse 1.5s ease-in-out infinite; }
        .yuna-coaching-glow { animation: yuna-coaching-glow 2s ease-in-out infinite alternate; }
        .yuna-voice-recording { animation: yuna-pulse 2s infinite; }
        .yuna-upsell-analysis { animation: yuna-upsell-pulse 2s ease-in-out infinite alternate; }
        .yuna-voice-level-indicator { animation: yuna-voice-level 1.5s ease-in-out infinite alternate; }
        .yuna-quality-metric { transition: all 0.3s ease; }
        .yuna-quality-metric:hover { transform: translateY(-2px); }
        .yuna-medical-term { background: linear-gradient(135deg, #3b82f6, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-weight: 600; }
        .yuna-copyright { background: linear-gradient(135deg, #1e40af 0%, #7c3aed 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .yuna-section-divider { border-left: 3px solid; padding-left: 12px; }
        .yuna-doctor-divider { border-color: #1e40af; }
        .yuna-patient-divider { border-color: #0369a1; }
      `}</style>

      <div className="container mx-auto px-4 py-6 max-w-[1600px]">
        {/* Хедер с индикацией статуса Юны */}
        <div
          className="rounded-2xl shadow-2xl p-6 mb-6 text-white"
          style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #3730a3 100%)' }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <Icon name="Brain" size={32} className="text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold">Юна AI</h1>
                <p className="text-white/80">Интеллектуальная система для стоматологии премиум-класса</p>
              </div>
            </div>

            {/* Информация о вошедшем враче */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 lg:gap-6">
              <div className="sm:text-right">
                <p className="font-semibold text-lg">{currentDoctor?.name || 'Врач'}</p>
                <p className="text-white/70">
                  {currentDoctor
                    ? [currentDoctor.specialty, currentDoctor.experience_years ? `Опыт ${currentDoctor.experience_years} лет` : null].filter(Boolean).join(' • ')
                    : ''}
                </p>
                {currentDoctor && (
                  <div className="flex items-center gap-2 mt-1 sm:justify-end">
                    <div className="bg-yellow-400 px-2 py-1 rounded-full text-xs font-bold text-gray-800">
                      ⭐ {currentDoctor.points} баллов
                    </div>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-3 items-center">
                <div className="bg-white/20 rounded-xl p-3 backdrop-blur-sm">
                  <div className="flex items-center space-x-2">
                    <Icon name="Bot" size={16} className="text-green-400" />
                    <span className="text-sm">Юна онлайн</span>
                  </div>
                </div>
                <Link
                  to="/yuna"
                  className="bg-white/20 hover:bg-white/30 rounded-xl px-3 py-3 backdrop-blur-sm flex items-center gap-2 text-sm transition-colors"
                >
                  <Icon name="LayoutDashboard" size={16} />
                  Дашборд
                </Link>
                <Link
                  to="/yuna/settings"
                  className="bg-white/20 hover:bg-white/30 rounded-xl px-3 py-3 backdrop-blur-sm flex items-center gap-2 text-sm transition-colors"
                >
                  <Icon name="Settings" size={16} />
                  Настройки
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-white/20 hover:bg-white/30 rounded-xl px-3 py-3 backdrop-blur-sm flex items-center gap-2 text-sm transition-colors"
                >
                  <Icon name="LogOut" size={16} />
                  Выйти
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Дашборд по реальным сессиям */}
        {!loadingSessions && (
          <div className="mb-6">
            <YunaDashboard sessions={sessions} />
          </div>
        )}

        {/* Основная сетка */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* ЛЕВЫЙ САЙДБАР - РАЗДЕЛ ВРАЧА */}
          <div className="xl:col-span-1 space-y-6">
            {/* Заголовок раздела Врач */}
            <div
              className="rounded-2xl shadow-lg p-4 text-white"
              style={{ background: 'linear-gradient(135deg, #1e40af 0%, #3730a3 100%)' }}
            >
              <h2 className="text-xl font-bold flex items-center">
                <Icon name="Stethoscope" size={22} className="mr-3" />
                РАЗДЕЛ ВРАЧА
              </h2>
            </div>

            {/* ГОЛОСОВАЯ АВТОМАТИЗАЦИЯ + живой рекордер */}
            <div className="bg-white rounded-2xl shadow-lg p-6 yuna-voice-automation">
              <h2 className="text-xl font-bold text-gray-800 mb-4 yuna-section-divider yuna-doctor-divider">
                <Icon name="Mic" size={20} className="text-purple-500 mr-2 inline" />
                Голосовая автоматизация
              </h2>

              {/* Живой рекордер приёма */}
              <div className="mb-4 rounded-xl border-2 border-purple-100 bg-purple-50/40 p-4">
                <div className="flex flex-col items-center text-center">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 transition-colors ${
                      state === 'recording'
                        ? 'bg-red-100'
                        : state === 'paused'
                        ? 'bg-amber-100'
                        : 'bg-purple-100'
                    }`}
                  >
                    <Icon
                      name={state === 'recording' ? 'Mic' : state === 'paused' ? 'Pause' : 'Mic'}
                      size={28}
                      className={
                        state === 'recording'
                          ? 'text-red-500 animate-pulse'
                          : state === 'paused'
                          ? 'text-amber-500'
                          : 'text-purple-600'
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
                      <p className="text-2xl font-bold text-gray-800 tabular-nums mb-1">{fmtTime(seconds)}</p>
                      <p className="text-xs text-gray-500 mb-3">
                        {state === 'recording' ? 'Идёт запись приёма…' : 'На паузе'}
                      </p>

                      <div className="flex items-end justify-center gap-0.5 h-8 mb-3 w-full">
                        {Array.from({ length: 20 }).map((_, i) => {
                          const threshold = (i + 1) / 20;
                          const active = state === 'recording' && level >= threshold * 0.9;
                          const h = 20 + threshold * 80;
                          return (
                            <span
                              key={i}
                              className={`flex-1 rounded-full transition-all duration-75 ${
                                active ? 'bg-purple-500' : 'bg-gray-200'
                              }`}
                              style={{ height: active ? `${h}%` : '20%' }}
                            />
                          );
                        })}
                      </div>

                      {state === 'recording' && silent && (
                        <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-xl bg-amber-50 border border-amber-200">
                          <Icon name="MicOff" size={14} className="text-amber-600 flex-shrink-0" />
                          <span className="text-xs text-amber-700 text-left">
                            Звук слишком тихий — говорите громче или ближе к микрофону
                          </span>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center justify-center gap-2">
                        {state === 'recording' ? (
                          <button
                            onClick={pause}
                            className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-1.5"
                          >
                            <Icon name="Pause" size={14} /> Пауза
                          </button>
                        ) : (
                          <button
                            onClick={resume}
                            className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-1.5"
                          >
                            <Icon name="Play" size={14} /> Продолжить
                          </button>
                        )}
                        <button
                          onClick={handleStop}
                          className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-1.5"
                        >
                          <Icon name="Square" size={14} /> Завершить
                        </button>
                        <button onClick={cancel} className="text-gray-500 hover:text-gray-700 px-2 py-2 text-sm transition-colors">
                          Отмена
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-medium text-gray-800 mb-1">Готов к записи приёма</p>
                      <p className="text-xs text-gray-500 mb-3">
                        Нажмите «Начать приём» — после завершения запись расшифруется и разделится на реплики врача и пациента.
                      </p>
                      <button
                        onClick={start}
                        disabled={processing}
                        className="w-full bg-purple-500 hover:bg-purple-600 disabled:opacity-60 text-white px-4 py-2.5 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
                      >
                        <Icon name="Mic" size={16} /> Начать приём
                      </button>
                    </>
                  )}
                </div>
              </div>

              {(recError || error) && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                  <p className="text-xs text-red-600">{recError || error}</p>
                </div>
              )}

              {processing && (
                <div className="mb-4 bg-blue-50 border border-blue-200 rounded-xl px-3 py-3 flex flex-col items-center text-center">
                  <Icon name="LoaderCircle" size={22} className="text-blue-500 animate-spin mb-2" />
                  <p className="text-xs font-medium text-blue-800">Обрабатываем приём…</p>
                  <p className="text-[11px] text-blue-600 mt-0.5">
                    ИИ расшифровывает речь, разделяет реплики и оценивает приём
                  </p>
                </div>
              )}

              <div className="space-y-4">
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-purple-600">87%</p>
                  <p className="text-xs text-purple-700">Данных заполнено автоматически</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-green-50 rounded-lg p-2 text-center">
                    <p className="text-lg font-bold text-green-600">23 мин</p>
                    <p className="text-xs text-green-700">Сэкономлено сегодня</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-2 text-center">
                    <p className="text-lg font-bold text-blue-600">94%</p>
                    <p className="text-xs text-blue-700">Точность распознавания</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <button className="w-full bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-center">
                    <Icon name="Zap" size={16} className="mr-2" />
                    "Юна, новый пациент"
                  </button>
                  <button className="w-full bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-center">
                    <Icon name="Pill" size={16} className="mr-2" />
                    "Юна, план лечения"
                  </button>
                </div>

                <div className="space-y-2 mt-4">
                  <button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-center">
                    <Icon name="FileText" size={16} className="mr-2" />
                    "Заполни медицинскую карту"
                  </button>
                  <button className="w-full bg-teal-500 hover:bg-teal-600 text-white px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-center">
                    <Icon name="CalendarPlus" size={16} className="mr-2" />
                    "Запиши пациента в расписание"
                  </button>
                  <button className="w-full bg-amber-500 hover:bg-amber-600 text-white px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-center">
                    <Icon name="Camera" size={16} className="mr-2" />
                    "Прикрепи фото-протокол"
                  </button>
                  <button className="w-full bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-center">
                    <Icon name="CircleCheck" size={16} className="mr-2" />
                    "Заверши прием"
                  </button>
                </div>
              </div>
            </div>

            {/* Голосовые протоколы */}
            <div className="bg-black rounded-2xl shadow-lg p-6 yuna-protocol-glow min-h-[120px] [&>*]:invisible">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                <Icon name="FileText" size={20} className="text-blue-500 mr-2 inline" />
                Голосовые протоколы
              </h2>
              <div className="space-y-3">
                <div className="bg-blue-50 rounded-xl p-3">
                  <p className="text-sm font-semibold text-blue-800">Активный протокол:</p>
                  <p className="text-xs text-blue-700">Эндодонтия 36 зуб</p>
                </div>

                <div className="space-y-2">
                  <button className="w-full bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-center">
                    <Icon name="Syringe" size={16} className="mr-2" />"Начать анестезию"
                  </button>
                  <button className="w-full bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-center">
                    <Icon name="Shield" size={16} className="mr-2" />"Установить коффердам"
                  </button>
                  <button className="w-full bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-center">
                    <Icon name="Wrench" size={16} className="mr-2" />"Препарирование завершено"
                  </button>
                </div>

                <div className="bg-gray-50 rounded-xl p-3 max-h-32 overflow-y-auto">
                  <p className="text-xs font-semibold text-gray-700 mb-2">Автозаполненный протокол:</p>
                  <div className="text-xs text-gray-600 space-y-1">
                    <p>• 11:05 - Начало процедуры</p>
                    <p>• 11:07 - Анестезия: Ультракаин DS 1.7ml</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Сложность случая */}
            <div className="bg-black rounded-2xl shadow-lg p-6 min-h-[120px] [&>*]:invisible">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                <Icon name="ChartBar" size={20} className="text-orange-500 mr-2 inline" />
                Сложность случая
              </h2>
              <div className="space-y-4">
                <div
                  className="text-white rounded-xl p-4 text-center"
                  style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}
                >
                  <p className="text-2xl font-bold">ВЫСОКАЯ</p>
                  <p className="text-sm opacity-90">78% сложность</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Анатомия каналов:</span>
                    <span className="font-semibold text-red-600">Сложная</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Доступ:</span>
                    <span className="font-semibold text-orange-600">Ограниченный</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Предыдущее лечение:</span>
                    <span className="font-semibold text-red-600">Осложненное</span>
                  </div>
                </div>

                <div className="bg-yellow-50 rounded-xl p-3">
                  <p className="text-xs font-semibold text-yellow-800">Рекомендуемое время:</p>
                  <p className="text-sm text-yellow-700">75-90 минут</p>
                </div>
              </div>
            </div>

            {/* Расчет анестезии (реальные данные) */}
            <AnesthesiaBlock a={analysis?.anesthesia} />

            {/* Моё состояние — стресс врача по речи */}
            <DoctorStateBlock s={analysis?.doctor_state} />

            {/* Рейтинг врачей (реальные учётные записи) */}
            <RatingBlock refreshKey={ratingKey} />

            {/* Голосовые шаблоны */}
            <div className="bg-black rounded-2xl shadow-lg p-6 min-h-[120px] [&>*]:invisible">
              <h2 className="text-xl font-bold text-gray-800 mb-4 yuna-section-divider yuna-doctor-divider">
                <Icon name="MessageSquare" size={20} className="text-red-500 mr-2 inline" />
                Голосовые шаблоны
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <button className="bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl p-3 text-center transition-all duration-200 hover:scale-105 flex flex-col items-center">
                  <Icon name="Clipboard" size={18} className="text-blue-600 mb-2" />
                  <p className="text-sm font-medium text-gray-800">Осмотр</p>
                </button>
                <button className="bg-green-50 hover:bg-green-100 border border-green-200 rounded-xl p-3 text-center transition-all duration-200 hover:scale-105 flex flex-col items-center">
                  <Icon name="ClipboardCheck" size={18} className="text-green-600 mb-2" />
                  <p className="text-sm font-medium text-gray-800">Диагноз</p>
                </button>
                <button className="bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl p-3 text-center transition-all duration-200 hover:scale-105 flex flex-col items-center">
                  <Icon name="Syringe" size={18} className="text-purple-600 mb-2" />
                  <p className="text-sm font-medium text-gray-800">Анестезия</p>
                </button>
                <button className="bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-xl p-3 text-center transition-all duration-200 hover:scale-105 flex flex-col items-center">
                  <Icon name="FileText" size={18} className="text-orange-600 mb-2" />
                  <p className="text-sm font-medium text-gray-800">Протокол</p>
                </button>
              </div>

              <div className="mt-4 p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white text-center">
                <p className="text-sm font-semibold">Скажите: "Юна, помощь"</p>
                <p className="text-xs opacity-90">для списка всех команд</p>
              </div>
            </div>
          </div>

          {/* ЦЕНТРАЛЬНАЯ И ПРАВАЯ КОЛОНКИ - РАЗДЕЛ ПАЦИЕНТА */}
          <div className="xl:col-span-3 space-y-6">
            {/* Заголовок раздела Пациент */}
            <div
              className="rounded-2xl shadow-lg p-4 text-white"
              style={{ background: 'linear-gradient(135deg, #0369a1 0%, #0ea5e9 100%)' }}
            >
              <h2 className="text-xl font-bold flex items-center">
                <Icon name="User" size={22} className="mr-3" />
                РАЗДЕЛ ПАЦИЕНТА
              </h2>
            </div>

            {/* Автоматически заполненные данные (карта пациента из диалога) */}
            <AutoFillBlock p={analysis?.patient} />

            {/* Верхняя часть раздела пациента */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Текущий пациент */}
              <CurrentPatientBlock p={analysis?.patient} />

              {/* Психологическое состояние */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 yuna-section-divider yuna-patient-divider">
                  <Icon name="Brain" size={20} className="text-purple-500 mr-2 inline" />
                  Психологическое состояние
                </h2>
                {!processing && analysis ? (
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-gray-600">Спокойствие</span>
                        <span className="text-xs font-semibold text-green-600">{analysis.patient_state}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: `${analysis.patient_state}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-gray-600">Доверие к врачу</span>
                        <span className="text-xs font-semibold text-blue-600">{analysis.trust}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${analysis.trust}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-gray-600">Уровень тревоги</span>
                        <span className="text-xs font-semibold text-orange-600">{100 - analysis.patient_state}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${100 - analysis.patient_state}%` }} />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center py-6 text-gray-400">
                    <Icon name="Brain" size={28} className="mb-2" />
                    <p className="text-sm text-gray-500">Появится после приёма</p>
                  </div>
                )}
              </div>

              {/* Лояльность пациента */}
              <LoyaltyBlock l={analysis?.loyalty} />
            </div>

            {/* Реальный отчёт анализа приёма */}
            {!processing && analysis && <AnalysisReport analysis={analysis} />}

            {/* Анализ речи для доп. услуг */}
            <UpsellBlock u={analysis?.upsell} />

            {/* Диагностика и обследования */}
            {!processing && analysis?.dental && analysis.dental.primary_diagnosis ? (
              <DentalReport dental={analysis.dental} />
            ) : (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 yuna-section-divider yuna-patient-divider">
                <Icon name="Stethoscope" size={20} className="text-blue-500 mr-2 inline" />
                Диагностика и обследования
              </h2>
              <div className="flex flex-col items-center justify-center text-center py-10 text-gray-400">
                <Icon name="Stethoscope" size={32} className="mb-3" />
                <p className="text-sm font-medium text-gray-500">Диагностика появится после приёма</p>
                <p className="text-xs mt-1 max-w-xs">
                  Запишите приём — Юна сформирует предварительный диагноз, обследования и план лечения
                </p>
              </div>
            </div>
            )}

            {/* Тактика лечения */}
            <TacticsReport tactics={!processing ? analysis?.tactics : null} />

            {/* Контроль препаратов */}
            <DrugControlBlock d={analysis?.drug_control} />

            {/* AI-предсказание осложнений */}
            <ComplicationsReport complications={!processing ? analysis?.complications : null} />

            {/* AI-рекомендации по лечению */}
            <TreatmentReport treatment={!processing ? analysis?.treatment : null} />

            {/* Авто-журналы (реальная статистика) */}
            <AutoJournalsBlock stats={stats} />

            {/* KPI качества (реальные метрики) */}
            <KpiBlock stats={stats} />

            {/* Персональное обучение (поиск в интернете) */}
            <LearningBlock />

            {/* Уведомления для врача */}
            <div className="bg-black rounded-2xl shadow-lg p-6 min-h-[120px] [&>*]:invisible">
              <h2 className="text-xl font-bold text-gray-800 mb-4 yuna-section-divider yuna-patient-divider">
                <Icon name="Bell" size={20} className="text-yellow-500 mr-2 inline" />
                Уведомления для врача
              </h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-xl">
                  <Icon name="Syringe" size={18} className="text-yellow-600" />
                  <div>
                    <p className="text-sm font-semibold text-yellow-800">Заказ абатмента</p>
                    <p className="text-xs text-yellow-700">До 15.12.2024</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-xl">
                  <Icon name="CalendarCheck" size={18} className="text-blue-600" fallback="CalendarPlus" />
                  <div>
                    <p className="text-sm font-semibold text-blue-800">Снятие швов</p>
                    <p className="text-xs text-blue-700">25.12.2024, 11:00</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-xl">
                  <Icon name="Dumbbell" size={18} className="text-green-600" fallback="CircleAlert" />
                  <div>
                    <p className="text-sm font-semibold text-green-800">Тренировка эмпатии</p>
                    <p className="text-xs text-green-700">Рекомендовано сегодня</p>
                  </div>
                </div>

                <div className="bg-green-50 rounded-xl p-4 mt-4">
                  <h4 className="font-semibold text-green-800 mb-2">Рекомендации Юны</h4>
                  <p className="text-sm text-green-700">
                    Пациент проявляет признаки беспокойства. Рекомендуется дополнительное объяснение процедуры.
                  </p>
                  <div className="flex space-x-2 mt-2">
                    <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm transition-colors flex items-center">
                      <Icon name="MessageSquare" size={14} className="mr-1" />Объяснить
                    </button>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm transition-colors flex items-center">
                      <Icon name="CalendarPlus" size={14} className="mr-1" />Напомнить
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Голосовая транскрипция */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 yuna-section-divider yuna-patient-divider">
                  <Icon name="Mic" size={18} className="text-red-500 mr-2 inline" />
                  Голосовая транскрипция
                </h3>
                {state === 'recording' && (
                  <div className="yuna-voice-recording bg-red-50 border border-red-200 rounded-lg px-3 py-1">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      <span className="text-sm font-semibold text-red-700">Запись • {fmtTime(seconds)}</span>
                    </div>
                  </div>
                )}
              </div>

              {!processing && utterances.length > 0 ? (
                <TranscriptView utterances={utterances} />
              ) : (
                <div className="bg-white border-2 border-gray-100 rounded-xl p-4 h-48 overflow-y-auto shadow-inner">
                  <div className="space-y-3">
                    <div className="flex justify-start">
                      <div className="bg-gray-100 rounded-2xl rounded-tl-none px-4 py-3 max-w-md">
                        <p className="text-sm text-gray-800">
                          У меня <span className="yuna-medical-term">ноющая боль ночью</span>, и зуб{' '}
                          <span className="yuna-medical-term">реагирует на холодное</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Пациент • 11:02 • Автораспознавание</p>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <div className="bg-green-50 rounded-2xl rounded-tr-none px-4 py-3 max-w-md border border-green-200">
                        <p className="text-sm text-gray-800">
                          <span className="yuna-medical-term">Автоанализ:</span> Симптомы указывают на пульпит.
                        </p>
                        <p className="text-xs text-green-600 mt-1">Юна AI • 11:02</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* История приёмов (реальные сессии) */}
            <SessionHistory sessions={sessions} loading={loadingSessions} />
          </div>
        </div>

        {/* Футер */}
        <footer className="mt-8 py-6 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Icon name="Bot" size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Юна AI Ассистент</h3>
                <p className="text-sm text-gray-600">Интеллектуальная система для стоматологии</p>
              </div>
            </div>

            <div className="text-center md:text-right">
              <div className="yuna-copyright text-lg font-bold mb-1">© 2025 Роберт Лалиев</div>
              <p className="text-sm text-gray-600">Все права защищены.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default YunaPage;