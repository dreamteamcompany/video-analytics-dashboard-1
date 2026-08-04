import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell,
  PieChart, Pie,
} from 'recharts';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

/* ─────────── Данные ─────────── */

const commQuality = [
  { label: 'Эмпатия', value: '4.8/5', bg: 'bg-green-50', text: 'text-green-600', sub: 'text-green-700' },
  { label: 'Ясность', value: '4.6/5', bg: 'bg-blue-50', text: 'text-blue-600', sub: 'text-blue-700' },
  { label: 'Профессионализм', value: '4.7/5', bg: 'bg-purple-50', text: 'text-purple-600', sub: 'text-purple-700' },
  { label: 'Вовлечённость', value: '4.5/5', bg: 'bg-yellow-50', text: 'text-yellow-600', sub: 'text-yellow-700' },
];

const needsData = [
  { name: 'Активные вопросы', value: 78 },
  { name: 'Глубина анализа', value: 82 },
  { name: 'Скрытые нужды', value: 65 },
  { name: 'Уточнение деталей', value: 74 },
  { name: 'Связь с лечением', value: 80 },
];
const objectionsData = [
  { name: 'Финансовые', value: 72 },
  { name: 'Страх/боль', value: 68 },
  { name: 'Время/необходимость', value: 45 },
  { name: 'Доверие', value: 78 },
  { name: 'Альтернативы', value: 62 },
];
const promoData = [
  { name: 'Упоминание', value: 58 },
  { name: 'Релевантность', value: 76 },
  { name: 'Конверсия', value: 42 },
  { name: 'Время упомин.', value: 65 },
  { name: 'Частота', value: 48 },
];
const fillerData = [
  { name: '«Так сказать»', value: 12 },
  { name: '«Ну…»', value: 18 },
  { name: '«Короче»', value: 8 },
  { name: '«Типа»', value: 14 },
  { name: '«В общем»', value: 10 },
  { name: 'Другие', value: 38 },
];
const emotionsData = [
  { name: 'Позитивный', value: 68 },
  { name: 'Нейтральный', value: 25 },
  { name: 'Негативный', value: 7 },
];
const listeningData = [
  { name: 'Уточняющие', value: 78 },
  { name: 'Перефразир.', value: 82 },
  { name: 'Резюмиров.', value: 65 },
  { name: 'Эмпатия', value: 74 },
  { name: 'Подтвержд.', value: 70 },
];
const termsData = [
  { name: 'Объяснение', value: 64 },
  { name: 'Адаптация', value: 42 },
  { name: 'Аналогии', value: 58 },
  { name: 'Визуализация', value: 35 },
  { name: 'Проверка', value: 48 },
];

const FILLER_COLORS = ['#eab308', '#f59e0b', '#f97316', '#facc15', '#fbbf24', '#d1d5db'];
const EMOTION_COLORS = ['#22c55e', '#94a3b8', '#ef4444'];

const doctorsTable = [
  { name: 'Притчина А.Н.', img: 'https://www.32top.ru/images/Doctor/1150861_21249_40a19107559007268357b1a70b55cd84bb906d3c.jpg', needs: '92%', obj: '88%', promo: '76%', filler: '4%', pause: '2.1с', emo: '82%', good: true },
  { name: 'Ясиин М.Г.', img: 'https://optim.tildacdn.com/stor3239-6139-4664-b038-663762646539/-/cover/372x495/center/center/-/format/webp/63340173.png.webp', needs: '85%', obj: '79%', promo: '68%', filler: '12%', pause: '2.8с', emo: '78%', good: true },
  { name: 'Мурадян Г.С.', img: 'https://optim.tildacdn.com/stor3661-6630-4034-a334-656230363239/-/cover/372x495/center/center/-/format/webp/68706041.png.webp', needs: '72%', obj: '65%', promo: '54%', filler: '18%', pause: '4.2с', emo: '62%', good: false },
];

/* ─────────── UI-хелперы ─────────── */

const SectionHeader = ({ icon, title, gradient }: { icon: string; title: string; gradient: string }) => (
  <div className="rounded-2xl shadow-lg p-4 text-white mb-4" style={{ background: gradient }}>
    <h2 className="text-lg font-bold flex items-center gap-3">
      <Icon name={icon} size={20} />
      {title}
    </h2>
  </div>
);

const tooltipStyle = {
  contentStyle: { borderRadius: 12, border: '1px solid #e5e7eb', fontSize: 12 },
};

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

/* ─────────── Компонент ─────────── */

const SpeechAnalytics = () => (
  <div className="space-y-6 mb-6">
    {/* ═══ РЕЧЕВАЯ АНАЛИТИКА ═══ */}
    <div>
      <SectionHeader icon="MicVocal" title="РЕЧЕВАЯ АНАЛИТИКА" gradient="linear-gradient(135deg, #ec4899 0%, #d946ef 100%)" />
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Icon name="MessagesSquare" size={20} className="text-blue-500" />
          Качество общения с пациентами
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {commQuality.map((m) => (
            <div key={m.label} className={`${m.bg} rounded-lg p-3 text-center`}>
              <p className={`text-lg font-bold ${m.text}`}>{m.value}</p>
              <p className={`text-xs ${m.sub}`}>{m.label}</p>
            </div>
          ))}
        </div>
        <div className="bg-pink-50 rounded-xl p-3 mt-4 flex items-center gap-2">
          <Icon name="TrendingUp" size={18} className="text-pink-500" />
          <div>
            <p className="text-sm font-semibold text-pink-800">Рост качества</p>
            <p className="text-xs text-pink-700">+12% за последний месяц</p>
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
          Детальный анализ коммуникации врачей
        </h2>

        {/* Строка 1 — радары */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
          <RadarBlock title="Выявление потребностей" icon="Search" color="#3b82f6" data={needsData}
            rows={[
              { label: 'Активные вопросы', value: '78%', color: '#3b82f6' },
              { label: 'Глубина анализа', value: '82%', color: '#22c55e' },
              { label: 'Скрытые нужды', value: '65%', color: '#a855f7' },
            ]} />
          <RadarBlock title="Отработка возражений" icon="MessageCircleWarning" color="#10b981" data={objectionsData}
            rows={[
              { label: 'Финансовые', value: '72%', color: '#22c55e' },
              { label: 'Страх/боль', value: '68%', color: '#eab308' },
              { label: 'Время/необходимость', value: '45%', color: '#ef4444' },
            ]} />
          <RadarBlock title="Информирование об акциях" icon="Tag" color="#a855f7" data={promoData}
            rows={[
              { label: 'Упоминание акций', value: '58%', color: '#a855f7' },
              { label: 'Релевантность', value: '76%', color: '#3b82f6' },
              { label: 'Конверсия', value: '42%', color: '#22c55e' },
            ]} />
        </div>

        {/* Строка 2 — паразиты / паузы / эмоции */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
          <div className="rounded-2xl p-5 border border-yellow-100 bg-gradient-to-br from-yellow-50 to-amber-50">
            <h3 className="font-bold text-yellow-800 text-lg mb-3 flex items-center gap-2">
              <Icon name="MessageSquareOff" size={18} />Слова-паразиты
            </h3>
            <div style={{ height: 190 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={fillerData} dataKey="value" nameKey="name" innerRadius="50%" outerRadius="80%" paddingAngle={2}>
                    {fillerData.map((_, i) => <Cell key={i} fill={FILLER_COLORS[i]} />)}
                  </Pie>
                  <Tooltip {...tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl p-5 border border-red-100 bg-gradient-to-br from-red-50 to-orange-50">
            <h3 className="font-bold text-red-800 text-lg mb-3 flex items-center gap-2">
              <Icon name="Timer" size={18} />Паузы в речи (сек)
            </h3>
            <div style={{ height: 190 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { name: '9:00', v: 2.8 }, { name: '11:00', v: 2.5 }, { name: '13:00', v: 4.2 },
                  { name: '15:00', v: 2.9 }, { name: '17:00', v: 4.1 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip {...tooltipStyle} />
                  <Bar dataKey="v" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
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
              <span className="text-green-600 font-semibold">Позитив 68%</span>
              <span className="text-gray-500 font-semibold">Нейтр. 25%</span>
              <span className="text-red-500 font-semibold">Негатив 7%</span>
            </div>
          </div>
        </div>

        {/* Строка 3 — слушание / термины */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
          <div className="rounded-2xl p-5 border border-teal-100 bg-gradient-to-br from-teal-50 to-cyan-50">
            <h3 className="font-bold text-teal-800 text-lg mb-3 flex items-center gap-2">
              <Icon name="Headphones" size={18} />Активное слушание
            </h3>
            <div style={{ height: 180 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={listeningData} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={80} />
                  <Tooltip {...tooltipStyle} />
                  <Bar dataKey="value" fill="#14b8a6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-2 text-center">
              <div><p className="text-lg font-bold text-teal-600">78%</p><p className="text-xs text-teal-700">Уточняющие вопросы</p></div>
              <div><p className="text-lg font-bold text-blue-600">82%</p><p className="text-xs text-blue-700">Перефразирование</p></div>
            </div>
          </div>

          <div className="rounded-2xl p-5 border border-gray-200 bg-gradient-to-br from-gray-50 to-slate-50">
            <h3 className="font-bold text-gray-800 text-lg mb-3 flex items-center gap-2">
              <Icon name="Stethoscope" size={18} />Медицинские термины
            </h3>
            <div style={{ height: 180 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={termsData} outerRadius="72%">
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="name" tick={{ fontSize: 9, fill: '#6b7280' }} />
                  <Radar dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.35} />
                  <Tooltip {...tooltipStyle} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-2 text-center">
              <div><p className="text-lg font-bold text-purple-600">64%</p><p className="text-xs text-purple-700">Объяснение терминов</p></div>
              <div><p className="text-lg font-bold text-green-600">42%</p><p className="text-xs text-green-700">Адаптация для пациента</p></div>
            </div>
          </div>
        </div>

        {/* Сравнительная таблица */}
        <h3 className="font-bold text-gray-800 text-lg mb-3 flex items-center gap-2">
          <Icon name="UserRoundCheck" size={18} />Сравнительная таблица по врачам
        </h3>
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['Врач', 'Потребности', 'Возражения', 'Акции', 'Слова-паразиты', 'Паузы', 'Эмоции'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {doctorsTable.map((d) => (
                <tr key={d.name} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <img src={d.img} alt={d.name} className="h-8 w-8 rounded-full object-cover" />
                      <span className="font-medium text-gray-900">{d.name}</span>
                    </div>
                  </td>
                  <td className={`px-4 py-3 font-bold ${d.good ? 'text-green-600' : 'text-yellow-600'}`}>{d.needs}</td>
                  <td className={`px-4 py-3 font-bold ${d.good ? 'text-green-600' : 'text-yellow-600'}`}>{d.obj}</td>
                  <td className="px-4 py-3 font-bold text-blue-600">{d.promo}</td>
                  <td className={`px-4 py-3 font-bold ${d.good ? 'text-green-600' : 'text-yellow-600'}`}>{d.filler}</td>
                  <td className={`px-4 py-3 font-bold ${d.good ? 'text-green-600' : 'text-yellow-600'}`}>{d.pause}</td>
                  <td className={`px-4 py-3 font-bold ${d.good ? 'text-green-600' : 'text-yellow-600'}`}>{d.emo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-5">
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
            <Icon name="Download" size={16} />Скачать детальный отчёт
          </button>
          <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
            <Icon name="GraduationCap" size={16} />Запланировать тренинг
          </button>
        </div>
      </Card>
    </div>

    {/* ═══ РЕКОМЕНДАЦИИ ═══ */}
    <div>
      <SectionHeader icon="Lightbulb" title="РЕКОМЕНДАЦИИ НА ОСНОВЕ РЕЧЕВОЙ АНАЛИТИКИ" gradient="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" />
      <Card className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Общие */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5">
            <h3 className="font-bold text-blue-800 text-lg mb-3 flex items-center gap-2">
              <Icon name="ChartLine" size={18} />Общие рекомендации
            </h3>
            <div className="space-y-3">
              {[
                { icon: 'CircleCheck', color: 'text-green-500', title: 'Улучшение эмпатии', text: '68% диалогов имеют позитивную окраску. Продолжайте в том же духе!' },
                { icon: 'TriangleAlert', color: 'text-orange-500', title: 'Снижение негативных диалогов', text: '7% диалогов имеют негативную окраску. Требуется работа с врачами.' },
                { icon: 'Target', color: 'text-purple-500', title: 'Повышение ясности объяснений', text: 'Оценка ясности: 4.6/5. Есть потенциал для улучшения.' },
              ].map((r) => (
                <div key={r.title} className="flex items-start gap-2">
                  <Icon name={r.icon} size={18} className={`${r.color} mt-0.5`} />
                  <div>
                    <p className="font-semibold text-gray-800">{r.title}</p>
                    <p className="text-sm text-gray-600">{r.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* По врачам */}
          <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-5">
            <h3 className="font-bold text-green-800 text-lg mb-3 flex items-center gap-2">
              <Icon name="UserRoundCog" size={18} />Рекомендации по врачам
            </h3>
            <div className="space-y-3">
              {[
                { icon: 'Crown', bg: 'bg-green-100', color: 'text-green-600', title: 'Ясиин М.Г.', text: 'Лучший показатель эмпатии (4.8/5). Может быть ментором для коллег.' },
                { icon: 'TriangleAlert', bg: 'bg-yellow-100', color: 'text-yellow-600', title: 'Саркисян К.С.', text: 'Требуется тренинг по коммуникации (52% позитивных диалогов).' },
                { icon: 'ArrowUp', bg: 'bg-blue-100', color: 'text-blue-600', title: 'Притчина А.Н.', text: 'Стабильный рост качества общения (+3% за месяц).' },
              ].map((r) => (
                <div key={r.title} className="flex items-start gap-2">
                  <div className={`flex-shrink-0 w-6 h-6 ${r.bg} rounded-full flex items-center justify-center`}>
                    <Icon name={r.icon} size={12} className={r.color} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{r.title}</p>
                    <p className="text-sm text-gray-600">{r.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Конкретные шаги */}
        <div className="mt-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-5">
          <h3 className="font-bold text-purple-800 text-lg mb-3 flex items-center gap-2">
            <Icon name="ListChecks" size={18} />Конкретные шаги для улучшения
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {[
              'Провести тренинг по активному слушанию',
              'Внедрить чек-лист ключевых фраз для врачей',
              'Разработать скрипты отработки возражений',
              'Настроить программу менторства',
              'Ввести регулярную оценку речевой аналитики',
              'Обновить стандарты информирования об акциях',
            ].map((step) => (
              <div key={step} className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0" />
                <span className="text-sm text-gray-700">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  </div>
);

export default SpeechAnalytics;
