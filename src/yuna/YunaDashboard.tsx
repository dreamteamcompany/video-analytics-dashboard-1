import { useMemo } from 'react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { YunaSession } from './api';
import { scoreColor } from './utils';

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

  const oc = scoreColor(overallAvg);

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
      <div className="flex items-center gap-6 mb-6 flex-wrap">
        <div className="flex items-end gap-2">
          <span className={`text-5xl font-bold leading-none ${oc.text}`}>{overallAvg}</span>
          <span className="text-sm text-muted-foreground mb-1">/ 100</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">Средняя оценка приёмов</span>
          <div className="flex items-center gap-1 mt-0.5">
            <Icon
              name={trend > 0 ? 'TrendingUp' : trend < 0 ? 'TrendingDown' : 'Minus'}
              size={16}
              className={trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-500' : 'text-muted-foreground'}
            />
            <span
              className={`text-sm font-medium ${
                trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-500' : 'text-muted-foreground'
              }`}
            >
              {trend > 0 ? `+${trend}` : trend} к прошлым
            </span>
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
        <div>
          <p className="text-sm font-medium text-foreground mb-2">Баланс качества</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} outerRadius="70%">
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis
                  dataKey="metric"
                  tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                />
                <Radar
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Динамика */}
        <div>
          <p className="text-sm font-medium text-foreground mb-2">Динамика оценок</p>
          <div className="h-56">
            {lineData.length < 2 ? (
              <div className="h-full flex items-center justify-center text-center px-4">
                <p className="text-xs text-muted-foreground">
                  График появится после второго приёма
                </p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: '1px solid hsl(var(--border))',
                      fontSize: 12,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Общий"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default YunaDashboard;
