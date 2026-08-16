import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { yunaApi, YunaSession, YunaStats } from './api';
import { useAuth } from './useAuth';
import YunaDashboard from './YunaDashboard';
import { KpiBlock, AutoJournalsBlock, RatingBlock } from './DoctorBlocks';
import SpeechAnalytics from './SpeechAnalytics';
import DirectorBlocks, { AiRecsCard } from './DirectorBlocks';

const YunaDashboardPage = () => {
  const navigate = useNavigate();
  const { doctor, loading: authLoading, logout } = useAuth();
  const [sessions, setSessions] = useState<YunaSession[]>([]);
  const [stats, setStats] = useState<YunaStats | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!doctor) return;
    setLoading(true);
    try {
      const [s, st] = await Promise.all([
        yunaApi.listSessions(doctor.id),
        yunaApi.stats(doctor.id),
      ]);
      setSessions(s);
      setStats(st);
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  }, [doctor]);

  useEffect(() => {
    load();
  }, [load]);

  const handleLogout = async () => {
    await logout();
    navigate('/yuna/login', { replace: true });
  };

  const headerCards = useMemo(() => {
    const now = new Date();
    const inMonth = (s: YunaSession, offset: number) => {
      const d = new Date(s.created_at.replace(' ', 'T'));
      const ref = new Date(now.getFullYear(), now.getMonth() - offset, 1);
      return d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth();
    };
    const pct = (cur: number, prev: number) => (prev > 0 ? Math.round(((cur - prev) / prev) * 100) : cur > 0 ? 100 : 0);

    const thisMonth = sessions.filter((s) => inMonth(s, 0));
    const prevMonth = sessions.filter((s) => inMonth(s, 1));

    const scored = (list: YunaSession[]) => list.map((s) => s.overall).filter((v): v is number => typeof v === 'number');
    const mean = (a: number[]) => (a.length ? Math.round(a.reduce((x, y) => x + y, 0) / a.length) : 0);
    const qNow = mean(scored(thisMonth));
    const qPrev = mean(scored(prevMonth));

    const avgDay = prevMonth.length ? prevMonth.length / 30 : 0;
    const avgWeek = prevMonth.length ? (prevMonth.length / 30) * 7 : 0;

    return [
      {
        label: 'Приёмов сегодня',
        icon: 'CalendarCheck',
        value: stats?.counts.today ?? '—',
        delta: pct(stats?.counts.today ?? 0, Math.round(avgDay)),
        note: 'от среднего',
      },
      {
        label: 'За неделю',
        icon: 'CalendarDays',
        value: stats?.counts.week ?? '—',
        delta: pct(stats?.counts.week ?? 0, Math.round(avgWeek)),
        note: 'от среднего',
      },
      {
        label: 'За месяц',
        icon: 'CalendarRange',
        value: stats?.counts.month ?? '—',
        delta: pct(thisMonth.length, prevMonth.length),
        note: 'от прошлого месяца',
      },
      {
        label: 'Качество приёма',
        icon: 'Gauge',
        value: stats?.kpi.quality != null ? `${stats.kpi.quality}%` : '—',
        delta: pct(qNow, qPrev),
        note: 'от прошлого месяца',
      },
    ];
  }, [sessions, stats]);

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)' }}>
      <style>{`
        .yuna-section-divider { border-left: 3px solid; padding-left: 12px; }
        .yuna-doctor-divider { border-color: #1e40af; }
      `}</style>

      <div className="container mx-auto px-4 py-6 max-w-[1400px]">
        {/* Хедер врача */}
        <div
          className="rounded-2xl shadow-2xl p-6 mb-6 text-white"
          style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #3730a3 100%)' }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center space-x-4">
              {doctor?.avatar_url ? (
                <img src={doctor.avatar_url} alt={doctor.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-white/40 shadow" />
              ) : (
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <Icon name="UserRound" size={32} className="text-white" />
                </div>
              )}
              <div>
                <p className="text-white/70 text-sm">С возвращением,</p>
                <h1 className="text-3xl font-bold">{authLoading ? '…' : doctor?.name || 'Врач'}</h1>
                <p className="text-white/80">
                  {[doctor?.specialty, doctor?.experience_years ? `Опыт ${doctor.experience_years} лет` : null].filter(Boolean).join(' • ')}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 items-center">
              <div className="bg-yellow-400 text-gray-800 rounded-xl px-4 py-3 font-bold flex items-center gap-2">
                <Icon name="Star" size={18} />
                {doctor?.points ?? 0} баллов
              </div>
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

          {/* Быстрые показатели */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            {headerCards.map((c) => (
              <div key={c.label} className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
                    <Icon name={c.icon} size={20} className="text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-2xl font-bold leading-none">{c.value}</p>
                    <p className="text-white/70 text-sm mt-1 truncate">{c.label}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 mt-3 text-xs">
                  <Icon
                    name={c.delta > 0 ? 'TrendingUp' : c.delta < 0 ? 'TrendingDown' : 'Minus'}
                    size={13}
                    className={c.delta > 0 ? 'text-emerald-300' : c.delta < 0 ? 'text-rose-300' : 'text-white/50'}
                  />
                  <span className={`font-semibold ${c.delta > 0 ? 'text-emerald-300' : c.delta < 0 ? 'text-rose-300' : 'text-white/60'}`}>
                    {c.delta > 0 ? `+${c.delta}%` : `${c.delta}%`}
                  </span>
                  <span className="text-white/50">{c.note}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Кнопка начать приём */}
        <Link
          to="/yuna/work"
          className="block mb-6 rounded-2xl shadow-lg p-5 text-white text-center font-semibold text-lg transition-transform hover:scale-[1.01]"
          style={{ background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)' }}
        >
          <Icon name="Mic" size={22} className="inline mr-2" />
          Начать новый приём
        </Link>

        {loading ? (
          <div className="flex justify-center py-16">
            <Icon name="LoaderCircle" size={28} className="text-blue-500 animate-spin" />
          </div>
        ) : (
          <>
            {/* 1. Общая статистика */}
            <YunaDashboard sessions={sessions} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <KpiBlock stats={stats} />
              <AutoJournalsBlock stats={stats} sessions={sessions} />
            </div>

            {/* 2. Управленческая аналитика: психология, выработка, продажи, качество */}
            <div className="mt-6">
              <DirectorBlocks
                psychology={stats?.psychology ?? null}
                qualityMetrics={stats?.quality_metrics ?? null}
              />
            </div>

            {/* 3. Мониторинг врачей — рейтинг */}
            <div className="mt-6">
              <RatingBlock />
            </div>

            {/* 4. Речевая аналитика + комплексный анализ */}
            <div className="mt-6">
              <SpeechAnalytics speech={stats?.speech ?? null} />
            </div>

            {/* 5. AI-рекомендации — в самом конце */}
            {stats?.ai_recommendations && stats.ai_recommendations.length > 0 && (
              <div className="mt-6">
                <AiRecsCard recs={stats.ai_recommendations} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default YunaDashboardPage;