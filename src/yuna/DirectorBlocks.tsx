import type { ReactNode } from 'react';
import {
  ResponsiveContainer, Tooltip, CartesianGrid, XAxis, YAxis,
  BarChart, Bar, Cell,
  PieChart, Pie,
} from 'recharts';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { PsychologyStats, QualityMetric, AiRecommendation } from './api';

const tooltipStyle = {
  contentStyle: { borderRadius: 12, border: '1px solid #e5e7eb', fontSize: 12 },
};

/* ─────────── Данные ─────────── */

const PSY_COLORS = ['#22c55e', '#eab308', '#ef4444'];

const specData = [
  { name: 'Хирургия', value: 2100 },
  { name: 'Ортопедия', value: 1800 },
  { name: 'Терапия', value: 1200 },
  { name: 'Ортодонтия', value: 1600 },
  { name: 'Гигиена', value: 900 },
];

const salesCards = [
  {
    title: 'Доп. продажи', icon: 'ArrowUp', color: '#22c55e', bg: 'from-green-50 to-emerald-50', border: 'border-green-100', tColor: 'text-green-700',
    rows: ['Средний чек: +18%', 'Доп. услуги: 42% пациентов', 'Рекомендации: 78% эффективность'],
  },
  {
    title: 'Лояльность', icon: 'Heart', color: '#3b82f6', bg: 'from-blue-50 to-indigo-50', border: 'border-blue-100', tColor: 'text-blue-700',
    rows: ['Повторные визиты: 85%', 'NPS: +42', 'Рекомендации: 4.2/5'],
  },
  {
    title: 'Эффективность', icon: 'Zap', color: '#a855f7', bg: 'from-purple-50 to-pink-50', border: 'border-purple-100', tColor: 'text-purple-700',
    rows: ['Автоматизация: 87%', 'Время экономия: 23 мин/приём', 'Точность: 94%'],
  },
];

const toneStyle: Record<string, { border: string; badgeBg: string; badgeText: string }> = {
  high: { border: 'border-l-red-500', badgeBg: 'bg-red-100', badgeText: 'text-red-700' },
  medium: { border: 'border-l-yellow-500', badgeBg: 'bg-yellow-100', badgeText: 'text-yellow-700' },
  low: { border: 'border-l-green-500', badgeBg: 'bg-green-100', badgeText: 'text-green-700' },
};

/* ─────────── UI-хелперы ─────────── */

const SectionHeader = ({ icon, title, gradient }: { icon: string; title: string; gradient: string }) => (
  <div className="rounded-2xl shadow-lg p-4 text-white mb-4" style={{ background: gradient }}>
    <h2 className="text-lg font-bold flex items-center gap-3">
      <Icon name={icon} size={20} />
      {title}
    </h2>
  </div>
);

/* Обёртка для демо-блоков: затемняет содержимое и вешает бейдж «Демо» */
const DemoWrap = ({ children }: { children: ReactNode }) => (
  <div className="relative select-none">
    <div className="opacity-40 grayscale-[35%] pointer-events-none">{children}</div>
    <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-gray-800/85 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow">
      <Icon name="Lock" size={12} />
      Демо
    </div>
  </div>
);

/* Реальный блок психологического состояния врача — из стресса по речи */
const PsychologyCard = ({ psy }: { psy: PsychologyStats }) => {
  const dist = [
    { name: 'Спокоен', value: psy.distribution.low },
    { name: 'Умеренный стресс', value: psy.distribution.medium },
    { name: 'Высокий стресс', value: psy.distribution.high },
  ];
  const s = psy.avg_stress;
  const level = s < 34 ? 'спокойное' : s < 67 ? 'умеренное напряжение' : 'высокое напряжение';
  const barColor = s < 34 ? 'bg-green-500' : s < 67 ? 'bg-yellow-500' : 'bg-red-500';
  const txtColor = s < 34 ? 'text-green-600' : s < 67 ? 'text-yellow-600' : 'text-red-600';
  return (
    <Card className="p-6 border border-red-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <Icon name="Brain" size={20} className="text-red-500" />
          Моё психологическое состояние
        </h2>
        <span className="text-xs text-gray-400">по {psy.count} приёмам</span>
      </div>
      <div style={{ height: 180 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={dist} dataKey="value" nameKey="name" innerRadius="55%" outerRadius="80%" paddingAngle={2}>
              {dist.map((_, i) => <Cell key={i} fill={PSY_COLORS[i]} />)}
            </Pie>
            <Tooltip {...tooltipStyle} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center justify-between text-sm mt-2 mb-1">
        <span className="text-gray-600">Средний уровень стресса:</span>
        <span className={`font-semibold ${txtColor}`}>{s}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div className={`${barColor} h-2 rounded-full`} style={{ width: `${s}%` }} />
      </div>
      {psy.high_stress_count > 0 ? (
        <div className="bg-red-100 rounded-xl p-3 border border-red-300 mt-4 flex items-start gap-2">
          <Icon name="TriangleAlert" size={18} className="text-red-500 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-800">Замечено напряжение</p>
            <p className="text-xs text-red-700">
              В {psy.high_stress_count} {psy.high_stress_count === 1 ? 'приёме' : 'приёмах'} высокий уровень стресса — стоит отдохнуть.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-green-100 rounded-xl p-3 border border-green-300 mt-4 flex items-start gap-2">
          <Icon name="CircleCheck" size={18} className="text-green-600 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-green-800">Состояние {level}</p>
            <p className="text-xs text-green-700">По вашей речи всё в норме. Так держать!</p>
          </div>
        </div>
      )}
    </Card>
  );
};

/* Реальные средние показатели качества */
const QualityCard = ({ metrics }: { metrics: QualityMetric[] }) => (
  <div>
    <SectionHeader icon="Star" title="СРЕДНИЕ ПОКАЗАТЕЛИ КАЧЕСТВА" gradient="linear-gradient(135deg, #d97706 0%, #f59e0b 100%)" />
    <Card className="p-6">
      <div style={{ height: Math.max(200, metrics.length * 42) }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={metrics} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={130} />
            <Tooltip {...tooltipStyle} />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {metrics.map((m, i) => (
                <Cell key={i} fill={m.value >= 80 ? '#22c55e' : m.value >= 60 ? '#eab308' : '#ef4444'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  </div>
);

/* Реальные AI-рекомендации из приёмов */
const AiRecsCard = ({ recs }: { recs: AiRecommendation[] }) => (
  <div>
    <SectionHeader icon="Bot" title="AI-РЕКОМЕНДАЦИИ С ОБОСНОВАНИЕМ" gradient="linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)" />
    <Card className="p-6">
      <div className="space-y-4">
        {recs.map((r, i) => {
          const t = toneStyle[r.priority];
          const label = r.priority === 'high' ? 'Высокий приоритет' : r.priority === 'medium' ? 'Средний приоритет' : 'Низкий приоритет';
          return (
            <div key={i} className={`border-l-4 ${t.border} bg-gray-50 rounded-r-xl p-4`}>
              <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
                <p className="font-bold text-gray-800">{r.title}</p>
                <span className={`${t.badgeBg} ${t.badgeText} text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap`}>{label}</span>
              </div>
              <p className="text-xs font-semibold text-gray-500 mb-1">Обоснование рекомендации:</p>
              <p className="text-sm text-gray-600">{r.reason}</p>
            </div>
          );
        })}
      </div>
    </Card>
  </div>
);

/* ─────────── Компонент ─────────── */

const DirectorBlocks = ({ psychology, qualityMetrics, aiRecommendations }: {
  psychology: PsychologyStats | null;
  qualityMetrics: QualityMetric[] | null;
  aiRecommendations: AiRecommendation[] | null;
}) => (
  <div className="space-y-6 mb-6">
    {psychology && psychology.count > 0 && (
      <div>
        <SectionHeader icon="HeartPulse" title="ПСИХОЛОГИЧЕСКОЕ СОСТОЯНИЕ" gradient="linear-gradient(135deg, #dc2626 0%, #ea580c 100%)" />
        <PsychologyCard psy={psychology} />
      </div>
    )}

    {qualityMetrics && qualityMetrics.length > 0 && <QualityCard metrics={qualityMetrics} />}

    {aiRecommendations && aiRecommendations.length > 0 && <AiRecsCard recs={aiRecommendations} />}

    <SectionHeader icon="Building2" title="УПРАВЛЕНЧЕСКАЯ АНАЛИТИКА КЛИНИКИ" gradient="linear-gradient(135deg, #0f766e 0%, #0d9488 100%)" />

    <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-center gap-2 text-sm text-amber-800">
      <Icon name="Info" size={16} />
      Блоки ниже — демонстрационные. Они оживут, когда подключим данные клиники (выработка, касса, продажи).
    </div>

    {/* Верхний ряд: выработка / продажи */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* Выработка по направлениям */}
      <DemoWrap>
      <Card className="p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Icon name="ChartPie" size={20} className="text-indigo-500" />
          Выработка по направлениям
        </h2>
        <div style={{ height: 180 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={specData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 9 }} />
              <YAxis tick={{ fontSize: 9 }} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-3 text-center mt-4">
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-lg font-bold text-blue-600">2.1M руб.</p>
            <p className="text-xs text-blue-700">Хирургия</p>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <p className="text-lg font-bold text-green-600">1.8M руб.</p>
            <p className="text-xs text-green-700">Ортопедия</p>
          </div>
        </div>
      </Card>
      </DemoWrap>

      {/* Анализ продаж и лояльности */}
      <DemoWrap>
      <Card className="p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Icon name="ChartLine" size={20} className="text-green-500" />
          Анализ продаж и лояльности
        </h2>
        <div className="space-y-3">
          {salesCards.map((c) => (
            <div key={c.title} className={`bg-gradient-to-r ${c.bg} ${c.border} border rounded-xl p-3 flex items-start gap-3`}>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: c.color }}>
                <Icon name={c.icon} size={18} className="text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm mb-1">{c.title}</p>
                <div className={`space-y-0.5 text-xs ${c.tColor}`}>
                  {c.rows.map((r) => <p key={r}>• {r}</p>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
      </DemoWrap>
    </div>

  </div>
);

export default DirectorBlocks;