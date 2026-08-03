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
      [...analyzed].reverse().map((s, i) => ({
        name: `№${i + 1}`,
        Общий: s.overall,
      })),
    [analyzed],
  );

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

  return (
    <Card className="p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Icon name="LayoutDashboard" size={18} className="text-primary" />
          <h2 className="font-semibold text-foreground">Сводка по приёмам</h2>
        </div>
        <span className="text-xs text-muted-foreground">{analyzed.length} приёмов</span>
      </div>

      {/* Общий балл + тренд */}
      <div className="flex items-center gap-5 mb-6 flex-wrap">
        <div
          className="relative w-24 h-24 rounded-full flex items-center justify-center shadow-lg"
          style={{
            background: `conic-gradient(${BRAND} ${overallAvg * 3.6}deg, #e0e7ff ${overallAvg * 3.6}deg)`,
          }}
        >
          <div className="w-[76px] h-[76px] rounded-full bg-white flex flex-col items-center justify-center">
            <span className="text-3xl font-bold leading-none text-indigo-600">{overallAvg}</span>
            <span className="text-[10px] text-gray-400">из 100</span>
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">Средняя оценка приёмов</span>
          <div className="flex items-center gap-1.5 mt-1">
            <div
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-sm font-semibold ${
                trend > 0 ? 'bg-green-50 text-green-600' : trend < 0 ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-500'
              }`}
            >
              <Icon
                name={trend > 0 ? 'TrendingUp' : trend < 0 ? 'TrendingDown' : 'Minus'}
                size={15}
              />
              {trend > 0 ? `+${trend}` : trend}
            </div>
            <span className="text-xs text-gray-400">к прошлым приёмам</span>
          </div>
        </div>
      </div>

      {/* Карточки метрик */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        {METRICS.map((m) => {
          const v = averages[m.key];
          const c = scoreColor(v);
          return (
            <div key={m.key} className={`rounded-xl p-3 ${c.bg}`}>
              <Icon name={m.icon} size={16} className={c.text} />
              <p className={`text-2xl font-bold mt-1.5 ${c.text}`}>{v}</p>
              <p className="text-xs text-muted-foreground leading-tight mt-0.5">{m.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Радар */}
        <div className="rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 p-4">
          <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
            <Icon name="Radar" size={15} className="text-indigo-500" />
            Баланс качества
          </p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} outerRadius="72%">
                <defs>
                  <radialGradient id="radarFill" cx="50%" cy="50%" r="75%">
                    <stop offset="0%" stopColor={BRAND2} stopOpacity={0.55} />
                    <stop offset="100%" stopColor={BRAND} stopOpacity={0.15} />
                  </radialGradient>
                </defs>
                <PolarGrid stroke="#c7d2fe" />
                <PolarAngleAxis
                  dataKey="metric"
                  tick={{ fontSize: 11, fill: '#4b5563', fontWeight: 500 }}
                />
                <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  dataKey="value"
                  stroke={BRAND}
                  strokeWidth={2}
                  fill="url(#radarFill)"
                  fillOpacity={1}
                  dot={{ r: 3, fill: BRAND, strokeWidth: 0 }}
                />
                <Tooltip content={<ChartTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Динамика */}
        <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
          <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
            <Icon name="TrendingUp" size={15} className="text-blue-500" />
            Динамика оценок
          </p>
          <div className="h-56">
            {lineData.length < 2 ? (
              <div className="h-full flex items-center justify-center text-center px-4">
                <p className="text-xs text-gray-500">
                  График появится после второго приёма
                </p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={lineData} margin={{ top: 5, right: 12, left: -18, bottom: 0 }}>
                  <defs>
                    <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={BRAND2} stopOpacity={0.35} />
                      <stop offset="100%" stopColor={BRAND2} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="lineStroke" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor={BRAND2} />
                      <stop offset="100%" stopColor={BRAND} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" stroke="#e0e7ff" vertical={false} />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} />
                  <YAxis domain={[0, 100]} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="Общий"
                    stroke="url(#lineStroke)"
                    strokeWidth={3}
                    fill="url(#areaFill)"
                    dot={{ r: 3, fill: '#fff', stroke: BRAND, strokeWidth: 2 }}
                    activeDot={{ r: 5, fill: BRAND, stroke: '#fff', strokeWidth: 2 }}
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