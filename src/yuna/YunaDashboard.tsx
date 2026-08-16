import { useMemo } from 'react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { YunaSession } from './api';
import { scoreColor } from './utils';

const BRAND = '#4f46e5';
const BRAND2 = '#2563eb';

const ChartTooltip = ({ active, payload, label }: {
  active?: boolean;
  payload?: { value?: number | string }[];
  label?: string | number;
}) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="rounded-xl bg-white/95 backdrop-blur shadow-lg border border-indigo-100 px-3 py-2">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-bold text-indigo-600">{payload[0].value} / 100</p>
    </div>
  );
};

const METRICS = [
  { key: 'empathy', label: 'Эмпатия', short: 'Эмпатия', icon: 'HeartHandshake' },
  { key: 'trust', label: 'Доверие', short: 'Доверие', icon: 'Handshake' },
  { key: 'patient_state', label: 'Состояние', short: 'Состояние', icon: 'Brain' },
  { key: 'quality', label: 'Качество', short: 'Качество', icon: 'BadgeCheck' },
  { key: 'communication', label: 'Коммуникация', short: 'Общение', icon: 'MessagesSquare' },
] as const;

type MetricKey = (typeof METRICS)[number]['key'];

const avg = (nums: number[]) =>
  nums.length ? Math.round(nums.reduce((a, b) => a + b, 0) / nums.length) : 0;

const MONTHS_SHORT = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];

const RadarTick = ({ payload, x, y, textAnchor, data }: {
  payload?: { value?: string };
  x?: number;
  y?: number;
  textAnchor?: 'start' | 'end' | 'middle' | 'inherit';
  data: { metric: string; value: number }[];
}) => {
  const name = payload?.value ?? '';
  const item = data.find((d) => d.metric === name);
  return (
    <g>
      <text x={x} y={y} textAnchor={textAnchor} fill="#475569" fontSize={12} fontWeight={700}>
        {name}
      </text>
      <text x={x} y={(y ?? 0) + 16} textAnchor={textAnchor} fill="#4f46e5" fontSize={12} fontWeight={800}>
        {item?.value ?? 0}%
      </text>
    </g>
  );
};

const LastValueDot = ({ cx, cy, index, total, value }: {
  cx?: number;
  cy?: number;
  index?: number;
  total: number;
  value?: number;
}) => {
  const isLast = index === total - 1;
  if (cx == null || cy == null) return null;
  return (
    <g>
      <circle cx={cx} cy={cy} r={isLast ? 5 : 4} fill="#fff" stroke={BRAND} strokeWidth={2.5} />
      {isLast && (
        <g transform={`translate(${cx - 26}, ${cy - 42})`}>
          <rect width="52" height="26" rx="13" fill="#fff" stroke="#c7d2fe" strokeWidth="1.5" />
          <text x="26" y="17" textAnchor="middle" fontSize="12.5" fontWeight="800" fill={BRAND}>
            {value}%
          </text>
        </g>
      )}
    </g>
  );
};

const YunaDashboard = ({ sessions }: { sessions: YunaSession[] }) => {
  const analyzed = useMemo(
    () => sessions.filter((s) => s.metrics && s.overall != null),
    [sessions],
  );

  const averages = useMemo(() => {
    const res = {} as Record<MetricKey, number>;
    for (const m of METRICS) {
      const vals = analyzed
        .map((s) => s.metrics?.[m.key])
        .filter((v): v is number => typeof v === 'number');
      res[m.key] = avg(vals);
    }
    return res;
  }, [analyzed]);

  const overallAvg = useMemo(
    () => avg(analyzed.map((s) => s.overall as number)),
    [analyzed],
  );

  // тренд: сравниваем среднее последних приёмов с предыдущими
  const trend = useMemo(() => {
    const chrono = [...analyzed].reverse().map((s) => s.overall as number);
    if (chrono.length < 2) return 0;
    const half = Math.max(1, Math.floor(chrono.length / 2));
    const older = avg(chrono.slice(0, half));
    const recent = avg(chrono.slice(-half));
    return recent - older;
  }, [analyzed]);

  const radarData = METRICS.map((m) => ({ metric: m.short, value: averages[m.key] }));

  const lineData = useMemo(
    () =>
      [...analyzed].reverse().map((s) => {
        const d = new Date(s.created_at.replace(' ', 'T'));
        const name = Number.isNaN(d.getTime())
          ? '—'
          : `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}`;
        return { name, Общий: s.overall as number };
      }),
    [analyzed],
  );

  // Помесячная динамика для героя-блока (последние 7 месяцев)
  const monthData = useMemo(() => {
    const now = new Date();
    const buckets: { key: string; name: string; vals: number[] }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      buckets.push({ key: `${d.getFullYear()}-${d.getMonth()}`, name: MONTHS_SHORT[d.getMonth()], vals: [] });
    }
    for (const s of analyzed) {
      const d = new Date(s.created_at.replace(' ', 'T'));
      if (Number.isNaN(d.getTime())) continue;
      const b = buckets.find((x) => x.key === `${d.getFullYear()}-${d.getMonth()}`);
      if (b) b.vals.push(s.overall as number);
    }
    let last = 0;
    return buckets.map((b) => {
      if (b.vals.length) last = avg(b.vals);
      return { name: b.name, Общий: last };
    });
  }, [analyzed]);

  if (analyzed.length === 0) {
    return (
      <Card className="p-6 mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Icon name="LayoutDashboard" size={18} className="text-primary" />
          <h2 className="font-semibold text-foreground">Сводка по приёмам</h2>
        </div>
        <p className="text-sm text-muted-foreground py-6 text-center">
          Здесь появится статистика, когда будут проанализированные приёмы.
        </p>
      </Card>
    );
  }

  const ringSize = 150;
  const ringStroke = 14;
  const ringR = (ringSize - ringStroke) / 2;
  const ringCirc = 2 * Math.PI * ringR;
  const ringOffset = ringCirc - (overallAvg / 100) * ringCirc;

  return (
    <Card className="p-6 mb-6 overflow-hidden chart-card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Icon name="LayoutDashboard" size={18} className="text-primary" />
          <h2 className="font-semibold text-foreground">Сводка по приёмам</h2>
        </div>
        <span className="text-xs text-muted-foreground">{analyzed.length} приёмов</span>
      </div>

      {/* Общий балл + тренд — герой-кольцо со свечением */}
      <div
        className="relative flex items-center gap-7 mb-7 flex-nowrap max-lg:flex-wrap rounded-3xl p-6 overflow-hidden"
        style={{ background: 'radial-gradient(120% 140% at 0% 0%, #eef2ff 0%, #e0e7ff 45%, #dbeafe 100%)' }}
      >
        {/* декоративные блики */}
        <div className="pointer-events-none absolute -top-10 -right-6 w-40 h-40 rounded-full blur-3xl opacity-40" style={{ background: BRAND }} />
        <div className="pointer-events-none absolute -bottom-12 left-24 w-40 h-40 rounded-full blur-3xl opacity-30" style={{ background: BRAND2 }} />

        <div className="relative" style={{ width: ringSize, height: ringSize }}>
          <svg width={ringSize} height={ringSize} className="-rotate-90">
            <defs>
              <linearGradient id="heroRing" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="55%" stopColor={BRAND2} />
                <stop offset="100%" stopColor={BRAND} />
              </linearGradient>
              <filter id="heroGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <circle cx={ringSize / 2} cy={ringSize / 2} r={ringR} fill="none" stroke="#ffffff" strokeWidth={ringStroke} strokeOpacity={0.6} />
            <circle
              className="ring-anim"
              cx={ringSize / 2}
              cy={ringSize / 2}
              r={ringR}
              fill="none"
              stroke="url(#heroRing)"
              strokeWidth={ringStroke}
              strokeLinecap="round"
              strokeDasharray={ringCirc}
              filter="url(#heroGlow)"
              style={{ ['--ring-circ' as string]: `${ringCirc}`, ['--ring-offset' as string]: `${ringOffset}`, strokeDashoffset: ringOffset }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center count-pop">
            <span className="text-5xl font-extrabold leading-none bg-gradient-to-br from-blue-600 to-indigo-600 bg-clip-text text-transparent">{overallAvg}</span>
            <span className="text-xs text-gray-400 mt-0.5">из 100</span>
          </div>
        </div>

        <div className="relative flex flex-col gap-1 flex-shrink-0">
          <span className="text-xs uppercase tracking-wider text-indigo-400 font-semibold">Средняя оценка</span>
          <span className="text-lg font-bold text-gray-700">Качество приёмов</span>
          <div className="flex items-center gap-2 mt-1">
            <div
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-bold shadow-sm ${
                trend > 0 ? 'bg-green-100 text-green-600' : trend < 0 ? 'bg-red-100 text-red-500' : 'bg-white text-gray-500'
              }`}
            >
              <Icon name={trend > 0 ? 'TrendingUp' : trend < 0 ? 'TrendingDown' : 'Minus'} size={15} />
              {trend > 0 ? `+${trend}%` : `${trend}%`}
            </div>
            <span className="text-xs text-gray-400">от прошлого месяца</span>
          </div>
        </div>

        {/* Помесячная динамика */}
        <div className="relative flex-1 min-w-[260px] h-[150px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthData} margin={{ top: 26, right: 22, left: -18, bottom: 0 }}>
              <defs>
                <linearGradient id="heroAreaFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.4} />
                  <stop offset="100%" stopColor={BRAND2} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="heroLineStroke" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#60a5fa" />
                  <stop offset="100%" stopColor={BRAND} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis
                domain={[0, 100]}
                ticks={[0, 25, 50, 75, 100]}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                width={38}
              />
              <Tooltip content={<ChartTooltip />} cursor={{ stroke: '#c7d2fe', strokeWidth: 2 }} />
              <Area
                type="monotone"
                dataKey="Общий"
                stroke="url(#heroLineStroke)"
                strokeWidth={3}
                fill="url(#heroAreaFill)"
                dot={(props) => <LastValueDot {...props} total={monthData.length} />}
                activeDot={{ r: 6, fill: BRAND, stroke: '#fff', strokeWidth: 2.5 }}
                isAnimationActive
                animationDuration={1100}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Карточки метрик — стеклянные с акцентной полосой */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        {METRICS.map((m, idx) => {
          const v = averages[m.key];
          const c = scoreColor(v);
          return (
            <div
              key={m.key}
              className={`relative rounded-2xl p-4 ${c.bg} overflow-hidden chart-card shadow-sm hover:shadow-md transition-shadow`}
              style={{ animationDelay: `${0.1 + idx * 0.07}s` }}
            >
              <div className={`absolute top-0 left-0 h-full w-1.5 ${c.bar}`} />
              <Icon name={m.icon} size={18} className={c.text} />
              <p className={`text-3xl font-extrabold mt-2 ${c.text}`}>{v}</p>
              <p className="text-xs text-muted-foreground leading-tight mt-0.5">{m.label}</p>
              <div className="mt-2 h-1.5 rounded-full bg-white/60 overflow-hidden">
                <div className={`h-full rounded-full ${c.bar}`} style={{ width: `${v}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Радар */}
        <div className="relative rounded-2xl p-5 overflow-hidden chart-card shadow-sm" style={{ background: 'radial-gradient(120% 120% at 50% 0%, #eef2ff 0%, #e0e7ff 100%)' }}>
          <div className="pointer-events-none absolute -top-8 -right-8 w-32 h-32 rounded-full blur-3xl opacity-40" style={{ background: BRAND }} />
          <p className="relative text-sm font-bold text-gray-700 mb-3 flex items-center gap-1.5">
            <Icon name="Radar" size={16} className="text-indigo-500" />
            Баланс качества
          </p>
          <div className="relative h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} outerRadius="62%">
                <defs>
                  <radialGradient id="radarFill" cx="50%" cy="50%" r="75%">
                    <stop offset="0%" stopColor="#818cf8" stopOpacity={0.75} />
                    <stop offset="60%" stopColor={BRAND2} stopOpacity={0.4} />
                    <stop offset="100%" stopColor={BRAND} stopOpacity={0.1} />
                  </radialGradient>
                  <filter id="radarGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3.5" result="b" />
                    <feMerge>
                      <feMergeNode in="b" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <PolarGrid stroke="#c7d2fe" strokeDasharray="3 4" />
                <PolarAngleAxis
                  dataKey="metric"
                  tick={(props) => <RadarTick {...props} data={radarData} />}
                />
                <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  dataKey="value"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  fill="url(#radarFill)"
                  fillOpacity={1}
                  filter="url(#radarGlow)"
                  dot={{ r: 4, fill: '#fff', stroke: BRAND, strokeWidth: 2 }}
                  isAnimationActive
                  animationDuration={1100}
                />
                <Tooltip content={<ChartTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Динамика */}
        <div className="relative rounded-2xl p-5 overflow-hidden chart-card shadow-sm" style={{ background: 'radial-gradient(120% 120% at 50% 0%, #eff6ff 0%, #e0e7ff 100%)' }}>
          <div className="pointer-events-none absolute -top-8 -left-8 w-32 h-32 rounded-full blur-3xl opacity-40" style={{ background: BRAND2 }} />
          <p className="relative text-sm font-bold text-gray-700 mb-3 flex items-center gap-1.5">
            <Icon name="TrendingUp" size={16} className="text-blue-500" />
            Динамика оценок
          </p>
          <div className="relative h-64">
            {lineData.length < 2 ? (
              <div className="h-full flex items-center justify-center text-center px-4">
                <p className="text-sm text-gray-500">
                  График появится после второго приёма
                </p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={lineData} margin={{ top: 30, right: 20, left: -14, bottom: 0 }}>
                  <defs>
                    <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.5} />
                      <stop offset="100%" stopColor={BRAND2} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="lineStroke" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#60a5fa" />
                      <stop offset="100%" stopColor={BRAND} />
                    </linearGradient>
                    <filter id="lineGlow" x="-20%" y="-50%" width="140%" height="200%">
                      <feGaussianBlur stdDeviation="3" result="b" />
                      <feMerge>
                        <feMergeNode in="b" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" stroke="#dbeafe" vertical={false} />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis
                    domain={[0, 100]}
                    ticks={[0, 25, 50, 75, 100]}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: '#64748b' }}
                  />
                  <Tooltip content={<ChartTooltip />} cursor={{ stroke: '#c7d2fe', strokeWidth: 2 }} />
                  <Area
                    type="monotone"
                    dataKey="Общий"
                    stroke="url(#lineStroke)"
                    strokeWidth={3.5}
                    fill="url(#areaFill)"
                    filter="url(#lineGlow)"
                    dot={(props) => <LastValueDot {...props} total={lineData.length} />}
                    activeDot={{ r: 6, fill: BRAND, stroke: '#fff', strokeWidth: 2.5 }}
                    isAnimationActive
                    animationDuration={1200}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default YunaDashboard;