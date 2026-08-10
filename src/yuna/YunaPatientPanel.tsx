import Icon from '@/components/ui/icon';
import { Utterance, Analysis, YunaSession, YunaStats } from './api';
import { fmtTime } from './utils';
import TranscriptView from './TranscriptView';
import AnalysisReport from './AnalysisReport';
import SessionHistory from './SessionHistory';
import DentalReport from './DentalReport';
import { TacticsReport, ComplicationsReport, TreatmentReport } from './PatientReports';
import { AutoFillBlock, CurrentPatientBlock, LoyaltyBlock, UpsellBlock, DrugControlBlock } from './LiveBlocks';
import { AutoJournalsBlock, KpiBlock, LearningBlock } from './DoctorBlocks';

interface YunaPatientPanelProps {
  state: 'idle' | 'recording' | 'paused';
  seconds: number;
  processing: boolean;
  analysis: Analysis | null;
  utterances: Utterance[];
  sessions: YunaSession[];
  loadingSessions: boolean;
  stats: YunaStats | null;
}

const YunaPatientPanel = ({
  state,
  seconds,
  processing,
  analysis,
  utterances,
  sessions,
  loadingSessions,
  stats,
}: YunaPatientPanelProps) => (
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
    <AutoJournalsBlock stats={stats} sessions={sessions} />

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
);

export default YunaPatientPanel;
