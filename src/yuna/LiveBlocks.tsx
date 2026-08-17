import Icon from '@/components/ui/icon';
import {
  Analysis,
  PatientCard,
  Anesthesia,
  DrugControl,
  Upsell,
  Loyalty,
  DoctorState,
  Complexity,
} from './api';

const Empty = ({ icon, text }: { icon: string; text: string }) => (
  <div className="flex flex-col items-center justify-center text-center py-6 text-gray-400">
    <Icon name={icon} size={28} className="mb-2" fallback="CircleAlert" />
    <p className="text-sm text-gray-500">{text}</p>
  </div>
);

const Bar = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div>
    <div className="flex justify-between mb-1">
      <span className="text-xs text-gray-600">{label}</span>
      <span className="text-xs font-semibold" style={{ color }}>{value}%</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div className="h-2 rounded-full" style={{ width: `${value}%`, backgroundColor: color }} />
    </div>
  </div>
);


const severityStyle = (text: string) => {
  const t = text.toLowerCase();
  if (/сложн|затрудн|осложн/.test(t)) return 'text-red-600';
  if (/огранич|умерен/.test(t)) return 'text-orange-600';
  if (/типич|свободн|без осложн|не проводил/.test(t)) return 'text-green-600';
  return 'text-gray-700';
};

export const ComplexityBlock = ({ c }: { c?: Complexity | null }) => {
  const has = !!c && (!!c.score || !!c.anatomy || !!c.access || !!c.previous);
  const level = c?.level || '';
  const grad =
    level === 'ВЫСОКАЯ'
      ? 'linear-gradient(135deg, #ef4444, #dc2626)'
      : level === 'СРЕДНЯЯ'
      ? 'linear-gradient(135deg, #f59e0b, #d97706)'
      : 'linear-gradient(135deg, #10b981, #059669)';

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        <Icon name="ChartBar" size={20} className="text-orange-500 mr-2 inline" />
        Сложность случая
      </h2>
      {has && c ? (
        <div className="space-y-4">
          <div className="text-white rounded-xl p-4 text-center" style={{ background: grad }}>
            <p className="text-2xl font-bold">{level}</p>
            <p className="text-sm opacity-90">{c.score}% сложность</p>
          </div>

          <div className="space-y-2">
            {c.anatomy && (
              <div className="flex justify-between text-sm gap-3">
                <span className="text-gray-600">Анатомия каналов:</span>
                <span className={`font-semibold text-right ${severityStyle(c.anatomy)}`}>{c.anatomy}</span>
              </div>
            )}
            {c.access && (
              <div className="flex justify-between text-sm gap-3">
                <span className="text-gray-600">Доступ:</span>
                <span className={`font-semibold text-right ${severityStyle(c.access)}`}>{c.access}</span>
              </div>
            )}
            {c.previous && (
              <div className="flex justify-between text-sm gap-3">
                <span className="text-gray-600">Предыдущее лечение:</span>
                <span className={`font-semibold text-right ${severityStyle(c.previous)}`}>{c.previous}</span>
              </div>
            )}
          </div>

          {c.factors.length > 0 && (
            <ul className="space-y-1.5">
              {c.factors.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                  <Icon name="TriangleAlert" size={13} className="text-orange-500 mt-0.5 flex-shrink-0" fallback="CircleAlert" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          )}

          {(c.time_min || c.time_max) && (
            <div className="bg-yellow-50 rounded-xl p-3">
              <p className="text-xs font-semibold text-yellow-800">Рекомендуемое время:</p>
              <p className="text-sm text-yellow-700">
                {c.time_min && c.time_max ? `${c.time_min}-${c.time_max} минут` : `${c.time_min || c.time_max} минут`}
              </p>
            </div>
          )}
        </div>
      ) : (
        <Empty icon="ChartBar" text="Оценка появится после анализа приёма" />
      )}
    </div>
  );
};

export const AnesthesiaBlock = ({ a }: { a?: Anesthesia | null }) => (
  <div className="bg-white rounded-2xl shadow-lg p-6">
    <h2 className="text-xl font-bold text-gray-800 mb-4">
      <Icon name="Calculator" size={20} className="text-green-500 mr-2 inline" />
      Расчет анестезии
    </h2>
    {a && (a.drug || a.dose_ml != null) ? (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <p className="text-lg font-bold text-green-600">{a.dose_ml != null ? `${a.dose_ml}ml` : '—'}</p>
            <p className="text-xs text-green-700">{a.drug || 'Анестетик'}</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <p className="text-lg font-bold text-blue-600">{a.reserve_ml != null ? `${a.reserve_ml}ml` : '—'}</p>
            <p className="text-xs text-blue-700">Резерв</p>
          </div>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Макс. доза:</span>
            <span className="font-semibold text-green-600">{a.max_ml != null ? `${a.max_ml}ml` : '—'}</span>
          </div>
        </div>
        {a.basis && (
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-600">{a.basis}</p>
          </div>
        )}
        {a.alternatives.length > 0 && (
          <div className="bg-purple-50 rounded-xl p-3">
            <h4 className="font-semibold text-purple-800 text-sm mb-2">Аналоги по противопоказаниям</h4>
            <div className="space-y-1 text-xs text-purple-700">
              {a.alternatives.map((alt, i) => (
                <div key={i} className="flex justify-between">
                  <span>{alt.name}:</span>
                  <span className="font-semibold">{alt.dose_ml != null ? `${alt.dose_ml}ml` : '—'}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    ) : (
      <Empty icon="Calculator" text="Расчёт появится после приёма" />
    )}
  </div>
);

export const AutoFillBlock = ({ p }: { p?: PatientCard | null }) => (
  <div className="bg-white rounded-2xl shadow-lg p-6 yuna-auto-fill-glow">
    <h2 className="text-xl font-bold text-gray-800 mb-4 yuna-section-divider yuna-patient-divider">
      <Icon name="Sparkles" size={20} className="text-green-500 mr-2 inline" />
      Автоматически заполненные данные
    </h2>
    {p ? (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-green-800">Основная информация</span>
            <Icon name="CircleCheck" size={18} className="text-green-500" />
          </div>
          <div className="text-sm text-green-700 space-y-1">
            <p>• ФИО: {p.name || 'не указано'}</p>
            <p>• Возраст: {p.age != null ? `${p.age} лет` : 'не указан'}</p>
            <p>• Пол: {p.sex || 'не указан'}</p>
          </div>
        </div>
        <div className="bg-blue-50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-blue-800">Медицинские данные</span>
            <Icon name="CircleCheck" size={18} className="text-blue-500" />
          </div>
          <div className="text-sm text-blue-700 space-y-1">
            <p>• {p.allergies.length ? <span className="font-bold text-red-600">Аллергия: {p.allergies.join(', ')}</span> : 'Аллергий не выявлено'}</p>
            <p>• Хронические: {p.chronic.length ? p.chronic.join(', ') : 'Нет'}</p>
            <p>• Курение: {p.smoking || 'Не указано'}</p>
          </div>
        </div>
        <div className="bg-purple-50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-purple-800">Симптомы и жалобы</span>
            <Icon name="Activity" size={18} className="text-purple-500" fallback="CircleAlert" />
          </div>
          <div className="text-sm text-purple-700 space-y-1">
            {p.complaints.length ? p.complaints.map((c, i) => <p key={i}>• {c}</p>) : <p>• Жалобы не зафиксированы</p>}
            {p.localization && <p>• Локализация: {p.localization}</p>}
          </div>
        </div>
      </div>
    ) : (
      <Empty icon="Sparkles" text="Карта заполнится после приёма" />
    )}
  </div>
);

export const CurrentPatientBlock = ({ p }: { p?: PatientCard | null }) => (
  <div className="bg-white rounded-2xl shadow-lg p-6">
    <h2 className="text-xl font-bold text-gray-800 mb-4 yuna-section-divider yuna-patient-divider">Текущий пациент</h2>
    {p ? (
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <Icon name="User" size={22} className="text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800">{p.name || 'Пациент'}</h3>
            <p className="text-sm text-gray-600">
              {[p.age != null ? `${p.age} лет` : null, p.sex].filter(Boolean).join(' • ') || 'Данные из диалога'}
            </p>
          </div>
        </div>
        {p.allergies.length > 0 && (
          <div className="bg-red-50 rounded-xl p-3 border border-red-200">
            <div className="flex items-center space-x-2">
              <Icon name="TriangleAlert" size={18} className="text-red-500" />
              <p className="text-sm font-semibold text-red-800">Аллергия: {p.allergies.join(', ')}!</p>
            </div>
          </div>
        )}
      </div>
    ) : (
      <Empty icon="User" text="Появится после приёма" />
    )}
  </div>
);

export const LoyaltyBlock = ({ l }: { l?: Loyalty | null }) => (
  <div className="bg-white rounded-2xl shadow-lg p-6">
    <h2 className="text-xl font-bold text-gray-800 mb-4 yuna-section-divider yuna-patient-divider">
      <Icon name="ChartLine" size={20} className="text-green-500 mr-2 inline" fallback="TrendingUp" />
      Лояльность пациента
    </h2>
    {l ? (
      <div className="space-y-3">
        <Bar label="Вероятность повторного визита" value={l.repeat} color="#22c55e" />
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-xs text-gray-600">NPS пациента</span>
            <span className="text-xs font-semibold text-purple-600">{l.nps != null ? `${l.nps}/10` : '—'}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${(l.nps ?? 0) * 10}%` }} />
          </div>
        </div>
        <Bar label="Готовность к рекомендациям" value={l.recommend} color="#3b82f6" />
      </div>
    ) : (
      <Empty icon="ChartLine" text="Появится после приёма" />
    )}
  </div>
);

export const UpsellBlock = ({ u }: { u?: Upsell | null }) => (
  <div className="bg-white rounded-2xl shadow-lg p-6">
    <h2 className="text-xl font-bold text-gray-800 mb-4">
      <Icon name="TrendingUp" size={20} className="text-amber-500 mr-2 inline" />
      Анализ речи для доп. услуг
    </h2>
    {u ? (
      <div className="space-y-4">
        <div className="bg-amber-50 rounded-xl p-3 flex items-center justify-between">
          <span className="text-sm text-amber-800 font-semibold">Потенциал доп. продаж</span>
          <span className="text-sm font-bold text-amber-600">{u.potential || '—'}</span>
        </div>
        {u.services.length > 0 && (
          <div className="space-y-3">
            {u.services.map((s, i) => (
              <Bar key={i} label={s.name} value={s.score} color="#f59e0b" />
            ))}
          </div>
        )}
        {u.phrases.length > 0 && (
          <div className="bg-gray-50 rounded-xl p-3">
            <h4 className="font-semibold text-gray-700 text-sm mb-2">Ключевые фразы пациента</h4>
            <div className="flex flex-wrap gap-2">
              {u.phrases.map((ph, i) => (
                <span key={i} className="text-xs bg-white border border-amber-200 text-amber-700 rounded-full px-3 py-1">«{ph}»</span>
              ))}
            </div>
          </div>
        )}
      </div>
    ) : (
      <Empty icon="TrendingUp" text="Появится после приёма" />
    )}
  </div>
);

export const DrugControlBlock = ({ d }: { d?: DrugControl | null }) => (
  <div className="bg-white rounded-2xl shadow-lg p-6">
    <h2 className="text-xl font-bold text-gray-800 mb-4">
      <Icon name="Pill" size={20} className="text-red-500 mr-2 inline" />
      Контроль препаратов
    </h2>
    {d && (d.contraindications.length || d.interactions.length || d.safe.length) ? (
      <div className="space-y-3">
        {d.contraindications.map((c, i) => (
          <div key={`c${i}`} className="bg-red-50 border border-red-200 rounded-xl p-3">
            <div className="flex items-start space-x-2">
              <Icon name="TriangleAlert" size={18} className="text-red-500 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-800">Избегать: {c.drug}</p>
                {c.reason && <p className="text-xs text-red-700">{c.reason}</p>}
              </div>
            </div>
          </div>
        ))}
        {d.interactions.map((it, i) => (
          <div key={`i${i}`} className="bg-orange-50 border border-orange-200 rounded-xl p-3">
            <div className="flex items-start space-x-2">
              <Icon name="Info" size={18} className="text-orange-500 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-orange-800">Взаимодействие: {it.drug}</p>
                {it.note && <p className="text-xs text-orange-700">{it.note}</p>}
              </div>
            </div>
          </div>
        ))}
        {d.safe.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-3">
            <p className="text-sm font-semibold text-green-800 mb-1">Разрешённые препараты</p>
            <p className="text-xs text-green-700">{d.safe.join(', ')}</p>
          </div>
        )}
      </div>
    ) : (
      <Empty icon="Pill" text="Появится после приёма" />
    )}
  </div>
);

export const DoctorStateBlock = ({ s }: { s?: DoctorState | null }) => {
  const highStress = (s?.stress ?? 0) >= 50;
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 yuna-section-divider yuna-doctor-divider">
        <Icon name="Heart" size={20} className="text-red-500 mr-2 inline" />
        Моё состояние
      </h2>
      {s ? (
        <>
          <div className={`rounded-2xl p-6 mb-4 border-2 ${highStress ? 'bg-red-50 border-red-200 yuna-stress-pulse' : 'bg-green-50 border-green-200'}`}>
            <div className="flex items-center space-x-3 mb-3">
              <Icon name={highStress ? 'TriangleAlert' : 'CircleCheck'} size={22} className={highStress ? 'text-red-500' : 'text-green-500'} />
              <div>
                <h3 className={`font-semibold ${highStress ? 'text-red-800' : 'text-green-800'}`}>{s.status || (highStress ? 'Повышенное напряжение' : 'Спокоен и уверен')}</h3>
                <p className={`text-sm ${highStress ? 'text-red-700' : 'text-green-700'}`}>Уровень напряжения: {s.stress}%</p>
              </div>
            </div>
            <div className="space-y-2">
              {s.speech_rate && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Темп речи:</span>
                  <span className="font-semibold text-gray-800">{s.speech_rate}</span>
                </div>
              )}
              {s.tone && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Тональность:</span>
                  <span className="font-semibold text-gray-800">{s.tone}</span>
                </div>
              )}
            </div>
          </div>
          {s.improve.length > 0 && (
            <div className="bg-blue-50 rounded-xl p-4 mb-3">
              <h4 className="font-semibold text-blue-800 mb-2 text-sm">Требует улучшения</h4>
              <div className="space-y-1">
                {s.improve.map((im, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-blue-700">{im.area}</span>
                    <span className="font-semibold text-blue-600">{im.delta}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {s.coaching && (
            <div className="yuna-coaching-glow bg-purple-50 rounded-xl p-4">
              <h4 className="font-semibold text-purple-800 mb-1">Коучинг-тренировка</h4>
              <p className="text-sm text-purple-700">«{s.coaching}»</p>
            </div>
          )}
        </>
      ) : (
        <Empty icon="Heart" text="Анализ появится после приёма" />
      )}
    </div>
  );
};

export const analysisHas = (a: Analysis | null) => !!a;
