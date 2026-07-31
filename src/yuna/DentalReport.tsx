import Icon from '@/components/ui/icon';
import { DentalDiagnosis } from './api';

const probColor = (p: number) => {
  if (p >= 70) return 'bg-green-500';
  if (p >= 40) return 'bg-amber-500';
  return 'bg-gray-400';
};

const DentalReport = ({ dental }: { dental: DentalDiagnosis }) => {
  const pd = dental.primary_diagnosis;
  const hasPrimary = !!pd?.name;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 yuna-section-divider yuna-patient-divider">
        <Icon name="Stethoscope" size={20} className="text-blue-500 mr-2 inline" />
        Диагностика и обследования
      </h2>
      <div className="space-y-4">
        {hasPrimary && (
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border-2 border-blue-200">
            <div className="flex items-center justify-between mb-3 gap-2">
              <h3 className="font-bold text-blue-800 text-lg">Предварительный диагноз</h3>
              <span className={`${probColor(pd.probability)} text-white px-3 py-1 rounded-full text-sm font-bold whitespace-nowrap`}>
                {pd.probability}% вероятность
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <Icon name="Stethoscope" size={16} className="text-blue-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-800">{pd.name}</p>
                  {pd.tooth && <p className="text-sm text-gray-600">Зуб: {pd.tooth}</p>}
                </div>
              </div>
              {dental.differential.length > 0 && (
                <div className="flex items-start space-x-2">
                  <Icon name="TriangleAlert" size={16} className="text-orange-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-800">Дифференциальный диагноз</p>
                    <p className="text-sm text-gray-600">Исключить: {dental.differential.join(', ')}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {dental.examinations.length > 0 && (
          <div className="bg-green-50 rounded-xl p-4">
            <h4 className="font-semibold text-green-800 mb-3">Рекомендуемые обследования</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dental.examinations.map((ex, i) => (
                <div key={i} className="flex items-start space-x-2">
                  <Icon name="ScanLine" size={16} className="text-green-600 mt-1 flex-shrink-0" fallback="CircleAlert" />
                  <div>
                    <p className="text-sm font-semibold text-green-800">{ex.name}</p>
                    {ex.reason && <p className="text-xs text-green-700">{ex.reason}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {dental.plan.length > 0 && (
          <div className="bg-purple-50 rounded-xl p-4">
            <h4 className="font-semibold text-purple-800 mb-2">План лечения</h4>
            <div className="space-y-2 text-sm text-purple-700">
              {dental.plan.map((step, i) => (
                <div key={i} className="flex items-start space-x-2">
                  <span className="mt-0.5 w-5 h-5 rounded-full bg-purple-200 text-purple-800 text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DentalReport;
