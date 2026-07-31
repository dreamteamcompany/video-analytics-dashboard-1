import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';
import { yunaApi, RatingEntry, YunaStats, Learning } from './api';

const placeColors = ['bg-yellow-400', 'bg-gray-400', 'bg-orange-400'];
const placeBg = ['bg-yellow-50', 'bg-gray-50', 'bg-orange-50 border border-orange-200'];

export const RatingBlock = ({ refreshKey }: { refreshKey?: number }) => {
  const [rating, setRating] = useState<RatingEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    yunaApi.rating()
      .then((r) => { if (active) setRating(r); })
      .catch(() => { /* silent */ })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [refreshKey]);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 yuna-section-divider yuna-doctor-divider">Рейтинг врачей</h2>
      {loading ? (
        <p className="text-sm text-gray-400 text-center py-4">Загрузка…</p>
      ) : rating.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-4">Добавьте врачей в разделе «Настройки»</p>
      ) : (
        <div className="space-y-3">
          {rating.map((d, i) => (
            <div key={d.id} className={`flex items-center justify-between p-2 rounded-lg ${placeBg[i] || 'bg-gray-50'}`}>
              <div className="flex items-center space-x-2">
                <div className={`w-6 h-6 ${placeColors[i] || 'bg-blue-300'} rounded-full flex items-center justify-center text-xs font-bold`}>{d.place}</div>
                {d.avatar_url ? (
                  <img src={d.avatar_url} alt={d.name} className="w-10 h-10 rounded-full object-cover border-2 border-white shadow" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center border-2 border-white shadow">
                    <Icon name="User" size={18} className="text-blue-500" />
                  </div>
                )}
                <div>
                  <span className="text-sm font-semibold">{d.name}</span>
                  <p className="text-xs text-gray-600">
                    {[d.specialty, d.experience_years ? `${d.experience_years} лет опыта` : null].filter(Boolean).join(' • ')}
                  </p>
                </div>
              </div>
              <span className="text-sm font-bold text-gray-700">{d.points}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const AutoJournalsBlock = ({ stats }: { stats: YunaStats | null }) => (
  <div className="bg-white rounded-2xl shadow-lg p-6">
    <h2 className="text-xl font-bold text-gray-800 mb-4">
      <Icon name="FileText" size={20} className="text-blue-500 mr-2 inline" />
      Авто-журналы
    </h2>
    <div className="grid grid-cols-3 gap-3">
      <div className="bg-blue-50 rounded-xl p-4 text-center">
        <p className="text-2xl font-bold text-blue-600">{stats?.counts.today ?? '—'}</p>
        <p className="text-xs text-blue-700">Сегодня</p>
      </div>
      <div className="bg-purple-50 rounded-xl p-4 text-center">
        <p className="text-2xl font-bold text-purple-600">{stats?.counts.week ?? '—'}</p>
        <p className="text-xs text-purple-700">За неделю</p>
      </div>
      <div className="bg-green-50 rounded-xl p-4 text-center">
        <p className="text-2xl font-bold text-green-600">{stats?.counts.month ?? '—'}</p>
        <p className="text-xs text-green-700">За месяц</p>
      </div>
    </div>
    <p className="text-xs text-gray-500 mt-3 text-center">Всего приёмов: {stats?.counts.total ?? '—'}</p>
  </div>
);

export const KpiBlock = ({ stats }: { stats: YunaStats | null }) => {
  const k = stats?.kpi;
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        <Icon name="Target" size={20} className="text-green-500 mr-2 inline" />
        KPI качества
      </h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Качество приёма</span>
          <span className="text-lg font-bold text-green-600">{k?.quality != null ? `${k.quality}%` : '—'}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Коммуникация</span>
          <span className="text-lg font-bold text-blue-600">{k?.communication != null ? `${k.communication}%` : '—'}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Среднее время приёма</span>
          <span className="text-lg font-bold text-purple-600">{k?.avg_minutes != null ? `${k.avg_minutes} мин` : '—'}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Удовлетворённость</span>
          <span className="text-lg font-bold text-amber-600">{k?.satisfaction != null ? `${k.satisfaction}/5` : '—'}</span>
        </div>
      </div>
    </div>
  );
};

export const LearningBlock = () => {
  const [data, setData] = useState<Learning | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    setError(null);
    yunaApi.learning()
      .then(setData)
      .catch(() => setError('Не удалось загрузить рекомендации'))
      .finally(() => setLoading(false));
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 yuna-training-rec">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">
          <Icon name="GraduationCap" size={20} className="text-purple-500 mr-2 inline" />
          Персональное обучение
        </h2>
        <button
          onClick={load}
          disabled={loading}
          className="text-sm bg-purple-500 hover:bg-purple-600 disabled:opacity-50 text-white px-3 py-1.5 rounded-lg transition-colors flex items-center"
        >
          <Icon name="Search" size={14} className="mr-1" />
          {loading ? 'Ищу…' : 'Найти курсы'}
        </button>
      </div>

      {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

      {!data && !loading && !error && (
        <p className="text-sm text-gray-500 text-center py-4">
          Нажмите «Найти курсы» — Юна подберёт актуальные курсы и мероприятия под ваши приёмы.
        </p>
      )}

      {data && (
        <div className="space-y-4">
          {data.recommended.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-purple-800 text-sm">Рекомендуется для вас</h4>
              {data.recommended.map((r, i) => (
                <div key={i} className="bg-purple-50 rounded-xl p-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-purple-800">{r.topic}</span>
                    <span className="text-xs font-bold text-purple-600">{r.relevance}%</span>
                  </div>
                  {r.why && <p className="text-xs text-purple-700 mt-1">{r.why}</p>}
                </div>
              ))}
            </div>
          )}
          {data.events.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-blue-800 text-sm">Ближайшие мероприятия</h4>
              {data.events.map((e, i) => (
                <a
                  key={i}
                  href={e.url || undefined}
                  target="_blank"
                  rel="noreferrer"
                  className="block bg-blue-50 hover:bg-blue-100 rounded-xl p-3 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-blue-800">{e.title}</span>
                    {e.url && <Icon name="ExternalLink" size={14} className="text-blue-500" />}
                  </div>
                  <p className="text-xs text-blue-700 mt-1">
                    {[e.date, e.format].filter(Boolean).join(' • ')}
                  </p>
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
