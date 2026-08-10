import Icon from '@/components/ui/icon';
import { Analysis } from './api';
import { fmtTime } from './utils';
import { AnesthesiaBlock, DoctorStateBlock } from './LiveBlocks';
import { RatingBlock } from './DoctorBlocks';

interface YunaDoctorPanelProps {
  state: 'idle' | 'recording' | 'paused';
  seconds: number;
  level: number;
  silent: boolean;
  recording: boolean;
  processing: boolean;
  recError: string | null;
  error: string | null;
  analysis: Analysis | null;
  ratingKey: number;
  start: () => void;
  pause: () => void;
  resume: () => void;
  cancel: () => void;
  onStop: () => void;
}

const YunaDoctorPanel = ({
  state,
  seconds,
  level,
  silent,
  recording,
  processing,
  recError,
  error,
  analysis,
  ratingKey,
  start,
  pause,
  resume,
  cancel,
  onStop,
}: YunaDoctorPanelProps) => (
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
                  onClick={onStop}
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
);

export default YunaDoctorPanel;
