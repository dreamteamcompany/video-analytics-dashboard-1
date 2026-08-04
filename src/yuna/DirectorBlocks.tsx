import type { ReactNode } from 'react';
import {
  ResponsiveContainer, Tooltip, CartesianGrid, XAxis, YAxis,
  BarChart, Bar, Cell,
  PieChart, Pie,
} from 'recharts';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const tooltipStyle = {
  contentStyle: { borderRadius: 12, border: '1px solid #e5e7eb', fontSize: 12 },
};

/* ─────────── Данные ─────────── */

const psychologyData = [
  { name: 'Низкий стресс', value: 25 },
  { name: 'Средний стресс', value: 45 },
  { name: 'Высокий стресс', value: 30 },
];
const PSY_COLORS = ['#22c55e', '#eab308', '#ef4444'];

const specData = [
  { name: 'Хирургия', value: 2100 },
  { name: 'Ортопедия', value: 1800 },
  { name: 'Терапия', value: 1200 },
  { name: 'Ортодонтия', value: 1600 },
  { name: 'Гигиена', value: 900 },
];

const qualityData = [
  { name: 'Удовлетвор.', value: 94 },
  { name: 'Эффективн.', value: 91 },
  { name: 'Время приёма', value: 84 },
  { name: 'Доп. продажи', value: 78 },
  { name: 'Лояльность', value: 85 },
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

const aiRecs = [
  {
    title: 'Повышение квалификации терапевтов', priority: 'Высокий приоритет', tone: 'high',
    text: 'Терапевтическое отделение показывает выработку на 35% ниже среднего по клинике. Врач Саркисян К.С. имеет только 52% позитивных диалогов и самый низкий средний чек — 8 400 руб. Требуется срочное вмешательство.',
  },
  {
    title: 'Внедрение системы мотивации', priority: 'Средний приоритет', tone: 'medium',
    text: 'Разрыв между лучшими и отстающими врачами велик. Притчина А.Н. показывает 104% выработки при чеке 24 500 руб., другие — ниже. Мотивация выровняет показатели.',
  },
  {
    title: 'Оптимизация расписания приёмов', priority: 'Низкий приоритет', tone: 'low',
    text: 'Утром (9:00–11:00) заполняемость 65%, вечером (17:00–19:00) — 98%. Перераспределение нагрузки повысит эффективность на 12–15%.',
  },
  {
    title: 'Внедрение программы менторства', priority: 'Высокий приоритет', tone: 'high',
    text: 'Ясиин М.Г. демонстрирует эмпатию 4.8/5, тогда как Мурадян Г.С. — 65% позитивных диалогов. Менторство передаст лучшие практики.',
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

/* ─────────── Компонент ─────────── */

const DirectorBlocks = () => (
  <div className="space-y-6 mb-6">
    <SectionHeader icon="Building2" title="УПРАВЛЕНЧЕСКАЯ АНАЛИТИКА КЛИНИКИ" gradient="linear-gradient(135deg, #0f766e 0%, #0d9488 100%)" />

    <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-center gap-2 text-sm text-amber-800">
      <Icon name="Info" size={16} />
      Блоки ниже — демонстрационные. Они оживут, когда подключим данные клиники (выработка, касса, продажи).
    </div>

    {/* Верхний ряд: психология / выработка / продажи */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Психологическое состояние */}
      <DemoWrap>
      <Card className="p-6 border border-red-200">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Icon name="Brain" size={20} className="text-red-500" />
          Психологическое состояние сотрудников
        </h2>
        <div style={{ height: 180 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={psychologyData} dataKey="value" nameKey="name" innerRadius="55%" outerRadius="80%" paddingAngle={2}>
                {psychologyData.map((_, i) => <Cell key={i} fill={PSY_COLORS[i]} />)}
              </Pie>
              <Tooltip {...tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-between text-sm mt-2 mb-1">
          <span className="text-gray-600">Средний уровень стресса:</span>
          <span className="font-semibold text-red-600">68%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-red-500 h-2 rounded-full" style={{ width: '68%' }} />
        </div>
        <div className="bg-red-100 rounded-xl p-3 border border-red-300 mt-4 flex items-start gap-2">
          <Icon name="TriangleAlert" size={18} className="text-red-500 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-800">Высокий уровень стресса</p>
            <p className="text-xs text-red-700">3 врача требуют срочной психологической поддержки</p>
          </div>
        </div>
      </Card>
      </DemoWrap>

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

    {/* Средние показатели качества */}
    <DemoWrap>
      <Card className="p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Icon name="Star" size={20} className="text-yellow-500" />
          Средние показатели качества
        </h2>
        <div style={{ height: 240 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={qualityData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={90} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="value" fill="#eab308" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </DemoWrap>

    {/* AI-рекомендации */}
    <div>
      <SectionHeader icon="Bot" title="AI-РЕКОМЕНДАЦИИ С ОБОСНОВАНИЕМ" gradient="linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)" />
      <DemoWrap>
      <Card className="p-6">
        <div className="space-y-4">
          {aiRecs.map((r) => {
            const t = toneStyle[r.tone];
            return (
              <div key={r.title} className={`border-l-4 ${t.border} bg-gray-50 rounded-r-xl p-4`}>
                <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
                  <p className="font-bold text-gray-800">{r.title}</p>
                  <span className={`${t.badgeBg} ${t.badgeText} text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap`}>{r.priority}</span>
                </div>
                <p className="text-xs font-semibold text-gray-500 mb-1">Обоснование рекомендации:</p>
                <p className="text-sm text-gray-600">{r.text}</p>
              </div>
            );
          })}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
          <button className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
            <Icon name="Download" size={16} />Скачать отчёт
          </button>
          <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
            <Icon name="Users" size={16} />Собрание с врачами
          </button>
        </div>
      </Card>
      </DemoWrap>
    </div>
  </div>
);

export default DirectorBlocks;