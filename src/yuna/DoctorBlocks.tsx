import { useEffect, useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import Icon from '@/components/ui/icon';
import { yunaApi, RatingEntry, WeeklyWinner, YunaStats, YunaSession, Learning } from './api';
import ProgressRing from './ProgressRing';

const placeColors = ['bg-yellow-400', 'bg-gray-400', 'bg-orange-400'];
const placeBg = ['bg-yellow-50', 'bg-gray-50', 'bg-orange-50 border border-orange-200'];

export const RatingBlock = ({ refreshKey }: { refreshKey?: number }) => {
  const [rating, setRating] = useState<RatingEntry[]>([]);
  const [weekly, setWeekly] = useState<WeeklyWinner | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    yunaApi.rating()
      .then((r) => {
        if (!active) return;
        setRating(r.rating);
        setWeekly(r.weekly);
      })
      .catch(() => { /* silent */ })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [refreshKey]);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 yuna-section-divider yuna-doctor-divider">Рейтинг врачей</h2>
      {loading ? (
        <p className="text-base text-gray-400 text-center py-6">Загрузка…</p>
      ) : rating.length === 0 ? (
        <p className="text-base text-gray-500 text-center py-6">Добавьте врачей в разделе «Настройки»</p>
      ) : (
        <div className="space-y-4">
          {(() => {
            const maxPts = Math.max(...rating.map((d) => d.points), 1);
            return rating.map((d, i) => (
              <div key={d.id} className={`p-4 rounded-2xl ${placeBg[i] || 'bg-gray-50'}`}>
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 ${placeColors[i] || 'bg-blue-300'} rounded-full flex items-center justify-center text-sm font-bold text-white`}>{d.place}</div>
                    {d.avatar_url ? (
                      <img src={d.avatar_url} alt={d.name} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center border-2 border-white shadow">
                        <Icon name="User" size={22} className="text-blue-500" />
                      </div>
                    )}
                    <div>
                      <span className="text-base font-semibold">{d.name}</span>
                      <p className="text-sm text-gray-500">
                        {[d.specialty, d.experience_years ? `${d.experience_years} лет` : null].filter(Boolean).join(' • ')}
                      </p>
                    </div>
                  </div>
                  <span className="text-xl font-bold text-indigo-600">{d.points}</span>
                </div>
                <div className="h-3 rounded-full bg-white/70 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${Math.max(6, (d.points / maxPts) * 100)}%`,
                      background: 'linear-gradient(90deg, #2563eb, #4f46e5)',
                    }}
                  />
                </div>
              </div>
            ));
          })()}
        </div>
      )}

      {!loading && (
        <div className="mt-5 rounded-2xl p-4 bg-blue-50 border border-blue-100">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Trophy" size={18} className="text-amber-500" fallback="Award" />
            <p className="text-base font-bold text-blue-800">Приз недели</p>
          </div>
          {weekly ? (
            <>
              <div className="flex items-center gap-3">
                {weekly.avatar_url ? (
                  <img src={weekly.avatar_url} alt={weekly.name} className="w-11 h-11 rounded-full object-cover border-2 border-white shadow" />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center border-2 border-white shadow">
                    <Icon name="User" size={20} className="text-blue-500" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-base font-semibold text-gray-800 truncate">{weekly.name}</p>
                  <p className="text-sm text-gray-500 truncate">
                    {weekly.sessions} прием{weekly.sessions % 10 === 1 && weekly.sessions !== 11 ? '' : weekly.sessions % 10 >= 2 && weekly.sessions % 10 <= 4 && (weekly.sessions < 12 || weekly.sessions > 14) ? 'а' : 'ов'} · качество {weekly.score}%
                  </p>
                </div>
              </div>
              <div className="mt-3 rounded-xl bg-white px-3 py-2 text-center">
                <p className="text-sm font-semibold text-blue-700">{weekly.prize}</p>
                <p className="text-xs text-gray-500 mt-0.5">Лучшее качество приёмов за 7 дней</p>
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-500 py-2">
              За последние 7 дней ещё нет проанализированных приёмов — победитель определится автоматически.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

const DAY_LABELS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

const JournalTooltip = ({ active, payload, label }: {
  active?: boolean; payload?: { value?: number }[]; label?: string;
}) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="rounded-lg bg-white/95 shadow-lg border border-blue-100 px-2.5 py-1.5">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-bold text-blue-600">{payload[0].value} приёмов</p>
    </div>
  );
};

export const AutoJournalsBlock = ({ stats, sessions }: { stats: YunaStats | null; sessions?: YunaSession[] }) => {
  const weekData = useMemo(() => {
    const days: { name: string; value: number }[] = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const count = (sessions || []).filter((s) => {
        const sd = new Date(s.created_at.replace(' ', 'T'));
        return sd.toISOString().slice(0, 10) === key;
      }).length;
      days.push({ name: DAY_LABELS[(d.getDay() + 6) % 7], value: count });
    }
    return days;
  }, [sessions]);

  const hasData = weekData.some((d) => d.value > 0);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        <Icon name="FileText" size={24} className="text-blue-500 mr-2 inline" />
        Авто-журналы
      </h2>

      <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 p-5 mb-6">
        <p className="text-sm text-gray-500 mb-2 px-1">Приёмы за 7 дней</p>
        <div className="h-56">
          {hasData ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekData} margin={{ top: 12, right: 4, left: 4, bottom: 0 }} barCategoryGap="26%">
                <defs>
                  <linearGradient id="barFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#818cf8" />
                    <stop offset="55%" stopColor="#4f46e5" />
                    <stop offset="100%" stopColor="#2563eb" />
                  </linearGradient>
                  <filter id="barGlow" x="-40%" y="-20%" width="180%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="b" />
                    <feMerge>
                      <feMergeNode in="b" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 13, fill: '#6b7280' }} />
                <Tooltip cursor={{ fill: 'rgba(79,70,229,0.06)' }} content={<JournalTooltip />} />
                <Bar dataKey="value" radius={[10, 10, 4, 4]} filter="url(#barGlow)" isAnimationActive animationDuration={900}>
                  {weekData.map((_, i) => (
                    <Cell key={i} fill="url(#barFill)" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-sm text-gray-400">За неделю приёмов пока нет</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-2xl p-5 text-center">
          <p className="text-4xl font-bold text-blue-600">{stats?.counts.today ?? '—'}</p>
          <p className="text-sm text-blue-700 mt-1">Сегодня</p>
        </div>
        <div className="bg-purple-50 rounded-2xl p-5 text-center">
          <p className="text-4xl font-bold text-purple-600">{stats?.counts.week ?? '—'}</p>
          <p className="text-sm text-purple-700 mt-1">Неделя</p>
        </div>
        <div className="bg-green-50 rounded-2xl p-5 text-center">
          <p className="text-4xl font-bold text-green-600">{stats?.counts.total ?? '—'}</p>
          <p className="text-sm text-green-700 mt-1">Всего</p>
        </div>
      </div>
    </div>
  );
};

export const KpiBlock = ({ stats }: { stats: YunaStats | null }) => {
  const k = stats?.kpi;
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-8">
        <Icon name="Target" size={24} className="text-green-500 mr-2 inline" />
        KPI качества
      </h2>
      <div className="grid grid-cols-2 gap-x-6 gap-y-10 place-items-center">
        <ProgressRing
          gradientId="kpiQuality"
          size={140}
          stroke={13}
          value={k?.quality ?? 0}
          from="#22c55e"
          to="#16a34a"
          label="Качество приёма"
        />
        <ProgressRing
          gradientId="kpiComm"
          size={140}
          stroke={13}
          value={k?.communication ?? 0}
          from="#3b82f6"
          to="#2563eb"
          label="Коммуникация"
        />
        <ProgressRing
          gradientId="kpiSat"
          size={140}
          stroke={13}
          value={k?.satisfaction != null ? (k.satisfaction / 5) * 100 : 0}
          from="#f59e0b"
          to="#d97706"
          suffix="/5"
          displayValue={k?.satisfaction != null ? String(k.satisfaction) : '—'}
          label="Удовлетворённость"
        />
        <div className="flex flex-col items-center justify-center">
          <div className="w-[140px] h-[140px] rounded-full bg-gradient-to-br from-purple-50 to-indigo-50 flex flex-col items-center justify-center">
            <Icon name="Clock" size={30} className="text-purple-500 mb-1" />
            <span className="text-3xl font-bold text-gray-800">
              {k?.avg_minutes != null ? k.avg_minutes : '—'}
              <span className="text-base text-gray-400"> мин</span>
            </span>
          </div>
          <span className="text-sm text-gray-500 mt-2 text-center leading-tight">Среднее время</span>
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