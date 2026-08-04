import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell,
  PieChart, Pie,
} from 'recharts';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { SpeechStats } from './api';

const tooltipStyle = {
  contentStyle: { borderRadius: 12, border: '1px solid #e5e7eb', fontSize: 12 },
};

const FILLER_COLORS = ['#eab308', '#f59e0b', '#f97316', '#facc15', '#fbbf24', '#d1d5db'];
const EMOTION_COLORS = ['#22c55e', '#94a3b8', '#ef4444'];

/* ─────────── UI-хелперы ─────────── */

const SectionHeader = ({ icon, title, gradient }: { icon: string; title: string; gradient: string }) => (
  <div className="rounded-2xl shadow-lg p-4 text-white mb-4" style={{ background: gradient }}>
    <h2 className="text-lg font-bold flex items-center gap-3">
      <Icon name={icon} size={20} />
      {title}
    </h2>
  </div>
);

const Empty = () => (
  <div>
    <SectionHeader icon="MicVocal" title="РЕЧЕВАЯ АНАЛИТИКА" gradient="linear-gradient(135deg, #ec4899 0%, #d946ef 100%)" />
    <Card className="p-10 text-center">
      <Icon name="MicOff" size={40} className="text-pink-300 mx-auto mb-3" />
      <p className="text-gray-600 font-medium">Здесь появится речевая аналитика</p>
      <p className="text-sm text-gray-400 mt-1">
        Показатели считаются автоматически из ваших приёмов — проведите и проанализируйте хотя бы один приём.
      </p>
    </Card>
  </div>
);

const RadarBlock = ({ title, icon, color, data, rows }: {
  title: string; icon: string; color: string;
  data: { name: string; value: number }[];
  rows: { label: string; value: string; color: string }[];
}) => (
  <div className="rounded-2xl p-5 border" style={{ borderColor: `${color}33`, background: `linear-gradient(135deg, ${color}0d, ${color}05)` }}>
    <h3 className="font-bold text-lg mb-3 flex items-center gap-2" style={{ color }}>
      <Icon name={icon} size={18} />{title}
    </h3>
    <div style={{ height: 190 }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="72%">
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis dataKey="name" tick={{ fontSize: 9, fill: '#6b7280' }} />
          <Radar dataKey="value" stroke={color} fill={color} fillOpacity={0.35} />
          <Tooltip {...tooltipStyle} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
    <div className="mt-3 space-y-1.5">
      {rows.map((r) => (
        <div key={r.label} className="flex justify-between text-sm">
          <span className="text-gray-600">{r.label}:</span>
          <span className="font-semibold" style={{ color: r.color }}>{r.value}</span>
        </div>
      ))}
    </div>
  </div>
);

/* оценка 0-100 -> «4.8/5» */
const to5 = (v: number) => `${(Math.round((v / 100) * 5 * 10) / 10).toFixed(1)}/5`;

/* ─────────── Компонент ─────────── */

const SpeechAnalytics = ({ speech }: { speech: SpeechStats | null }) => {
  if (!speech || speech.count === 0) return <Empty />;

  const cq = speech.comm_quality;
  const commCards = [
    { label: 'Эмпатия', value: to5(cq.empathy), bg: 'bg-green-50', text: 'text-green-600', sub: 'text-green-700' },
    { label: 'Ясность', value: to5(cq.clarity), bg: 'bg-blue-50', text: 'text-blue-600', sub: 'text-blue-700' },
    { label: 'Профессионализм', value: to5(cq.professionalism), bg: 'bg-purple-50', text: 'text-purple-600', sub: 'text-purple-700' },
    { label: 'Вовлечённость', value: to5(cq.engagement), bg: 'bg-yellow-50', text: 'text-yellow-600', sub: 'text-yellow-700' },
  ];

  const needsData = [
    { name: 'Активные вопросы', value: speech.needs.active_questions },
    { name: 'Глубина анализа', value: speech.needs.depth },
    { name: 'Скрытые нужды', value: speech.needs.hidden_needs },
  ];
  const objectionsData = [
    { name: 'Финансовые', value: speech.objections.financial },
    { name: 'Страх/боль', value: speech.objections.fear_pain },
    { name: 'Время/необходимость', value: speech.objections.time_need },
  ];
  const promoData = [
    { name: 'Упоминание', value: speech.promotions.mentioned },
    { name: 'Релевантность', value: speech.promotions.relevance },
    { name: 'Конверсия', value: speech.promotions.conversion },
  ];

  const fillerData = speech.filler_words.map((f) => ({ name: `«${f.word}»`, value: f.count }));
  const emotionsData = [
    { name: 'Позитивный', value: speech.emotion.positive },
    { name: 'Нейтральный', value: speech.emotion.neutral },
    { name: 'Негативный', value: speech.emotion.negative },
  ];
  const listeningData = [
    { name: 'Уточняющие', value: speech.listening.clarifying },
    { name: 'Перефразир.', value: speech.listening.paraphrasing },
  ];
  const termsData = [
    { name: 'Объяснение', value: speech.med_terms.explained },
    { name: 'Адаптация', value: speech.med_terms.adapted },
  ];

  return (
    <div className="space-y-6 mb-6">
      {/* ═══ РЕЧЕВАЯ АНАЛИТИКА ═══ */}
      <div>
        <SectionHeader icon="MicVocal" title="РЕЧЕВАЯ АНАЛИТИКА" gradient="linear-gradient(135deg, #ec4899 0%, #d946ef 100%)" />
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Icon name="MessagesSquare" size={20} className="text-blue-500" />
              Качество общения с пациентами
            </h2>
            <span className="text-xs text-gray-400">по {speech.count} приёмам</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {commCards.map((m) => (
              <div key={m.label} className={`${m.bg} rounded-lg p-3 text-center`}>
                <p className={`text-lg font-bold ${m.text}`}>{m.value}</p>
                <p className={`text-xs ${m.sub}`}>{m.label}</p>
              </div>
            ))}
          </div>
          <div className="bg-pink-50 rounded-xl p-3 mt-4 flex items-center gap-2">
            <Icon name="Timer" size={18} className="text-pink-500" />
            <div>
              <p className="text-sm font-semibold text-pink-800">Средняя пауза в речи</p>
              <p className="text-xs text-pink-700">{speech.pauses_sec} сек между репликами</p>
            </div>
          </div>
        </Card>
      </div>

      {/* ═══ ДЕТАЛЬНЫЙ АНАЛИЗ ═══ */}
      <div>
        <SectionHeader icon="ChartNetwork" title="КОМПЛЕКСНЫЙ АНАЛИЗ РЕЧЕВОЙ КОММУНИКАЦИИ" gradient="linear-gradient(135deg, #ec4899 0%, #d946ef 100%)" />
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Icon name="MicVocal" size={20} className="text-blue-500" />
            Детальный анализ коммуникации
          </h2>

          {/* Строка 1 — радары */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
            <RadarBlock title="Выявление потребностей" icon="Search" color="#3b82f6" data={needsData}
              rows={[
                { label: 'Активные вопросы', value: `${speech.needs.active_questions}%`, color: '#3b82f6' },
                { label: 'Глубина анализа', value: `${speech.needs.depth}%`, color: '#22c55e' },
                { label: 'Скрытые нужды', value: `${speech.needs.hidden_needs}%`, color: '#a855f7' },
              ]} />
            <RadarBlock title="Отработка возражений" icon="MessageCircleWarning" color="#10b981" data={objectionsData}
              rows={[
                { label: 'Финансовые', value: `${speech.objections.financial}%`, color: '#22c55e' },
                { label: 'Страх/боль', value: `${speech.objections.fear_pain}%`, color: '#eab308' },
                { label: 'Время/необходимость', value: `${speech.objections.time_need}%`, color: '#ef4444' },
              ]} />
            <RadarBlock title="Информирование об акциях" icon="Tag" color="#a855f7" data={promoData}
              rows={[
                { label: 'Упоминание акций', value: `${speech.promotions.mentioned}%`, color: '#a855f7' },
                { label: 'Релевантность', value: `${speech.promotions.relevance}%`, color: '#3b82f6' },
                { label: 'Конверсия', value: `${speech.promotions.conversion}%`, color: '#22c55e' },
              ]} />
          </div>

          {/* Строка 2 — паразиты / эмоции */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
            <div className="rounded-2xl p-5 border border-yellow-100 bg-gradient-to-br from-yellow-50 to-amber-50">
              <h3 className="font-bold text-yellow-800 text-lg mb-3 flex items-center gap-2">
                <Icon name="MessageSquareOff" size={18} />Слова-паразиты
              </h3>
              <div style={{ height: 190 }}>
                {fillerData.length ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={fillerData} dataKey="value" nameKey="name" innerRadius="50%" outerRadius="80%" paddingAngle={2}>
                        {fillerData.map((_, i) => <Cell key={i} fill={FILLER_COLORS[i % FILLER_COLORS.length]} />)}
                      </Pie>
                      <Tooltip {...tooltipStyle} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-sm text-gray-400">Слов-паразитов не выявлено</div>
                )}
              </div>
            </div>

            <div className="rounded-2xl p-5 border border-green-100 bg-gradient-to-br from-green-50 to-emerald-50">
              <h3 className="font-bold text-green-800 text-lg mb-3 flex items-center gap-2">
                <Icon name="Smile" size={18} />Эмоциональный окрас
              </h3>
              <div style={{ height: 190 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={emotionsData} dataKey="value" nameKey="name" outerRadius="80%" paddingAngle={2}>
                      {emotionsData.map((_, i) => <Cell key={i} fill={EMOTION_COLORS[i]} />)}
                    </Pie>
                    <Tooltip {...tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-around mt-2 text-xs">
                <span className="text-green-600 font-semibold">Позитив {speech.emotion.positive}%</span>
                <span className="text-gray-500 font-semibold">Нейтр. {speech.emotion.neutral}%</span>
                <span className="text-red-500 font-semibold">Негатив {speech.emotion.negative}%</span>
              </div>
            </div>
          </div>

          {/* Строка 3 — слушание / термины */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="rounded-2xl p-5 border border-teal-100 bg-gradient-to-br from-teal-50 to-cyan-50">
              <h3 className="font-bold text-teal-800 text-lg mb-3 flex items-center gap-2">
                <Icon name="Headphones" size={18} />Активное слушание
              </h3>
              <div style={{ height: 150 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={listeningData} layout="vertical">
                    <XAxis type="number" domain={[0, 100]} hide />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={80} />
                    <Tooltip {...tooltipStyle} />
                    <Bar dataKey="value" fill="#14b8a6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-2 text-center">
                <div><p className="text-lg font-bold text-teal-600">{speech.listening.clarifying}%</p><p className="text-xs text-teal-700">Уточняющие вопросы</p></div>
                <div><p className="text-lg font-bold text-blue-600">{speech.listening.paraphrasing}%</p><p className="text-xs text-blue-700">Перефразирование</p></div>
              </div>
            </div>

            <div className="rounded-2xl p-5 border border-gray-200 bg-gradient-to-br from-gray-50 to-slate-50">
              <h3 className="font-bold text-gray-800 text-lg mb-3 flex items-center gap-2">
                <Icon name="Stethoscope" size={18} />Медицинские термины
              </h3>
              <div style={{ height: 150 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={termsData} layout="vertical">
                    <XAxis type="number" domain={[0, 100]} hide />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={80} />
                    <Tooltip {...tooltipStyle} />
                    <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-2 text-center">
                <div><p className="text-lg font-bold text-purple-600">{speech.med_terms.explained}%</p><p className="text-xs text-purple-700">Объяснение терминов</p></div>
                <div><p className="text-lg font-bold text-green-600">{speech.med_terms.adapted}%</p><p className="text-xs text-green-700">Адаптация для пациента</p></div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* ═══ ОШИБКИ В ОБЩЕНИИ ═══ */}
      {speech.mistakes.length > 0 && (
        <div>
          <SectionHeader icon="MessageSquareWarning" title="ОШИБКИ В ОБЩЕНИИ С ПАЦИЕНТАМИ" gradient="linear-gradient(135deg, #ef4444 0%, #dc2626 100%)" />
          <Card className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div style={{ height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={speech.mistakes} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={130} />
                    <Tooltip {...tooltipStyle} />
                    <Bar dataKey="share" fill="#ef4444" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-red-50 rounded-xl p-4">
                <h4 className="font-semibold text-red-800 mb-2 text-sm">Частые ошибки</h4>
                <div className="space-y-1.5 text-sm text-red-700">
                  {speech.mistakes.map((m) => (
                    <div key={m.name} className="flex justify-between">
                      <span>{m.name}</span>
                      <span className="font-semibold">{m.share}% случаев</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SpeechAnalytics;
