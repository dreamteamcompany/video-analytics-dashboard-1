import Icon from '@/components/ui/icon';
import { Tactics, Complications, Treatment } from './api';

const Waiting = ({ title, icon, iconColor, divider }: { title: string; icon: string; iconColor: string; divider?: boolean }) => (
  <div className="bg-white rounded-2xl shadow-lg p-6">
    <h2 className={`text-xl font-bold text-gray-800 mb-4 ${divider ? 'yuna-section-divider yuna-patient-divider' : ''}`}>
      <Icon name={icon} size={20} className={`${iconColor} mr-2 inline`} fallback="CircleAlert" />
      {title}
    </h2>
    <div className="flex flex-col items-center justify-center text-center py-8 text-gray-400">
      <Icon name={icon} size={30} className="mb-3" fallback="CircleAlert" />
      <p className="text-sm font-medium text-gray-500">Появится после приёма</p>
      <p className="text-xs mt-1 max-w-xs">Запишите приём — Юна заполнит этот блок на основе разговора</p>
    </div>
  </div>
);

export const TacticsReport = ({ tactics }: { tactics?: Tactics | null }) => {
  if (!tactics || (!tactics.approach && !tactics.sequence.length && !tactics.equipment.length)) {
    return <Waiting title="Тактика лечения" icon="Grid3x3" iconColor="text-purple-500" />;
  }
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        <Icon name="Grid3x3" size={20} className="text-purple-500 mr-2 inline" fallback="CircleAlert" />
        Тактика лечения
      </h2>
      <div className="space-y-4">
        {(tactics.approach || tactics.notes.length > 0) && (
          <div className="bg-purple-50 rounded-xl p-4">
            {tactics.approach && <h3 className="font-semibold text-purple-800 mb-2">{tactics.approach}</h3>}
            <div className="space-y-2 text-sm text-purple-700">
              {tactics.notes.map((n, i) => (
                <div key={i} className="flex items-start space-x-2">
                  <Icon name="CircleCheck" size={16} className="mt-1 flex-shrink-0" />
                  <span>{n}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tactics.sequence.length > 0 && (
            <div className="bg-green-50 rounded-xl p-3">
              <h4 className="font-semibold text-green-800 text-sm mb-1">Оптимальная последовательность</h4>
              <ul className="text-xs text-green-700 space-y-1">
                {tactics.sequence.map((s, i) => (
                  <li key={i}>{i + 1}. {s}</li>
                ))}
              </ul>
            </div>
          )}
          {tactics.equipment.length > 0 && (
            <div className="bg-blue-50 rounded-xl p-3">
              <h4 className="font-semibold text-blue-800 text-sm mb-1">Оборудование и материалы</h4>
              <ul className="text-xs text-blue-700 space-y-1">
                {tactics.equipment.map((e, i) => (
                  <li key={i}>• {e}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const ComplicationsReport = ({ complications }: { complications?: Complications | null }) => {
  if (!complications) {
    return <Waiting title="AI-предсказание осложнений" icon="Bot" iconColor="text-purple-500" divider />;
  }
  const r = complications.risk;
  const riskColor = r >= 50 ? 'text-red-600' : r >= 25 ? 'text-orange-600' : 'text-green-600';
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 yuna-prediction-glow">
      <h2 className="text-xl font-bold text-gray-800 mb-4 yuna-section-divider yuna-patient-divider">
        <Icon name="Bot" size={20} className="text-purple-500 mr-2 inline" />
        AI-предсказание осложнений
      </h2>
      <div className="space-y-4">
        <div className="bg-red-50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-red-800">Риск послеоперационных осложнений</span>
            <span className={`font-bold ${riskColor}`}>{r}%</span>
          </div>
          {complications.factors.length > 0 && (
            <div className="text-sm text-red-700 space-y-1">
              {complications.factors.map((f, i) => (
                <p key={i}>• {f.name}{f.impact ? `: ${f.impact}` : ''}</p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const TreatmentReport = ({ treatment }: { treatment?: Treatment | null }) => {
  if (!treatment || (!treatment.recommended.length && !treatment.alternatives.length && !treatment.aftercare.length)) {
    return <Waiting title="AI-рекомендации по лечению" icon="Stethoscope" iconColor="text-green-500" divider />;
  }
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 yuna-treatment-recommendation">
      <h2 className="text-xl font-bold text-gray-800 mb-4 yuna-section-divider yuna-patient-divider">
        <Icon name="Stethoscope" size={20} className="text-green-500 mr-2 inline" />
        AI-рекомендации по лечению
      </h2>
      <div className="space-y-4">
        {treatment.recommended.length > 0 && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-200">
            <div className="flex items-center justify-between mb-3 gap-2">
              <h3 className="font-bold text-green-800 text-lg">Рекомендуемое лечение</h3>
              {treatment.match > 0 && (
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold whitespace-nowrap">
                  {treatment.match}% совпадение
                </span>
              )}
            </div>
            <div className="space-y-2">
              {treatment.recommended.map((r, i) => (
                <div key={i} className="flex items-start space-x-2">
                  <Icon name="CircleCheck" size={16} className="text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-800">{r.title}</p>
                    {r.detail && <p className="text-sm text-gray-600">{r.detail}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {treatment.alternatives.length > 0 && (
          <div className="bg-blue-50 rounded-xl p-4">
            <h4 className="font-semibold text-blue-800 mb-2">Альтернативные варианты</h4>
            <div className="space-y-2">
              {treatment.alternatives.map((a, i) => (
                <div key={i} className="flex justify-between items-center gap-2">
                  <span className="text-sm text-blue-700">{a.name}</span>
                  <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded text-xs whitespace-nowrap">{a.score}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {treatment.aftercare.length > 0 && (
          <div className="bg-purple-50 rounded-xl p-4">
            <h4 className="font-semibold text-purple-800 mb-2">Рекомендации после лечения</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {treatment.aftercare.map((a, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <Icon name="Pill" size={16} className="text-purple-500 flex-shrink-0" />
                  <span className="text-sm text-purple-700">{a}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
