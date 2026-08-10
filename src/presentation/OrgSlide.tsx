import { Slide } from './slides';
import Icon from '@/components/ui/icon';

const CARD_SHADOW = '0 4px 20px rgba(124,58,237,0.08), 0 1px 3px rgba(15,23,42,0.06)';
const PILL_GRADIENT = 'linear-gradient(90deg, #7c3aed 0%, #6366f1 100%)';
const HEADER_GRADIENT = 'linear-gradient(90deg, #6d28d9 0%, #7c3aed 50%, #6366f1 100%)';
const LINE_COLOR = '#a78bfa';

const COLUMN_ICONS = ['Target', 'Users', 'Rocket'];

const PersonCard = ({ role, name, note, tag, salary, vacancy, photo, delay = 0 }: {
  role: string; name?: string; note?: string; tag?: string; salary: string; vacancy?: boolean; photo?: string; delay?: number;
}) => (
  <div
    className="flex items-center gap-4 rounded-2xl bg-white/90 backdrop-blur-sm min-w-0 px-5 py-7 org-in transition-transform duration-300 hover:scale-[1.02]"
    style={{
      boxShadow: CARD_SHADOW,
      animationDelay: `${delay}ms`,
      minHeight: 'clamp(88px, 12vh, 170px)',
    }}
  >
    {photo ? (
      <img
        src={photo}
        alt={name || role}
        className="w-14 h-14 rounded-full object-cover flex-shrink-0 ring-2 ring-violet-200"
      />
    ) : (
      <div className="w-14 h-14 rounded-full bg-violet-50 flex items-center justify-center flex-shrink-0">
        <Icon name={vacancy ? 'UserPlus' : 'User'} size={26} className="text-violet-500" />
      </div>
    )}

    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <p className="text-base font-semibold text-slate-800 leading-snug whitespace-nowrap">
          {role}
        </p>
        {tag && (
          <span
            className="text-xs font-semibold text-white px-2.5 py-0.5 rounded-full whitespace-nowrap"
            style={{ background: PILL_GRADIENT }}
          >
            {tag}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2 flex-wrap mt-0.5">
        {name && (
          vacancy ? (
            <span className="text-xs font-semibold text-white px-2.5 py-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 whitespace-nowrap">
              {name}
            </span>
          ) : (
            <span className="text-base leading-snug text-slate-500">{name}</span>
          )
        )}
        {note && (
          <span className="text-xs font-semibold text-white px-2.5 py-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 whitespace-nowrap">
            {note}
          </span>
        )}
      </div>
    </div>

    <div
      className="rounded-full px-3.5 py-1.5 text-white text-sm font-semibold whitespace-nowrap flex-shrink-0"
      style={{ background: PILL_GRADIENT }}
    >
      {salary}
    </div>
  </div>
);

const StatCard = ({ icon, value, label, delay }: {
  icon: string; value: string; label: string; delay: number;
}) => (
  <div
    className="flex-1 min-w-0 rounded-2xl bg-white/90 px-5 py-2.5 flex items-center gap-3 org-drop"
    style={{
      boxShadow: CARD_SHADOW,
      animationDelay: `${delay}ms`,
      minHeight: 'clamp(58px, 8vh, 110px)',
    }}
  >
    <Icon name={icon} size={26} className="text-violet-500 flex-shrink-0" />
    <div className="min-w-0">
      <p className="text-2xl font-bold text-violet-600 leading-none">{value}</p>
      <p className="text-sm text-slate-500 leading-tight mt-0.5">{label}</p>
    </div>
  </div>
);

const OrgSlide = ({ slide }: { slide: Slide }) => {
  const allPeople = slide.columns?.flatMap((c) => c.people) ?? [];
  const total = allPeople.length + (slide.head ? 1 : 0);
  const vacancies = allPeople.filter((p) => p.vacancy).length;

  return (
  <div
    className="h-full flex flex-col overflow-hidden relative"
    style={{
      background: 'linear-gradient(135deg, #ffffff 0%, #fafaff 45%, #f3edfd 75%, #fdf0f7 100%)',
    }}
  >
    {/* Фоновые узоры */}
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Точечная сетка в правом верхнем углу */}
      <div
        className="absolute top-0 right-0 w-[34%] h-[42%]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(99,102,241,0.28) 1.7px, transparent 1.7px)',
          backgroundSize: '17px 17px',
          maskImage: 'linear-gradient(225deg, #000 5%, transparent 60%)',
          WebkitMaskImage: 'linear-gradient(225deg, #000 5%, transparent 60%)',
        }}
      />

      {/* Гексагоны справа */}
      <svg className="absolute top-[8%] right-[2%] w-[26%] h-[70%]" viewBox="0 0 300 400" fill="none">
        <g stroke="rgba(124,58,237,0.09)" strokeWidth="1.6">
          <polygon points="230,40 268,62 268,106 230,128 192,106 192,62" />
          <polygon points="150,120 188,142 188,186 150,208 112,186 112,142" />
          <polygon points="255,175 293,197 293,241 255,263 217,241 217,197" />
          <polygon points="185,265 223,287 223,331 185,353 147,331 147,287" />
          <polygon points="90,300 121,318 121,354 90,372 59,354 59,318" />
        </g>
        <g fill="rgba(236,72,153,0.035)">
          <polygon points="230,40 268,62 268,106 230,128 192,106 192,62" />
          <polygon points="255,175 293,197 293,241 255,263 217,241 217,197" />
        </g>
      </svg>

      {/* Гексагоны слева внизу */}
      <svg className="absolute bottom-[6%] left-[1%] w-[12%] h-[34%]" viewBox="0 0 150 220" fill="none">
        <g stroke="rgba(124,58,237,0.08)" strokeWidth="1.5">
          <polygon points="60,20 92,38 92,74 60,92 28,74 28,38" />
          <polygon points="105,95 133,111 133,143 105,159 77,143 77,111" />
          <polygon points="45,150 73,166 73,198 45,214 17,198 17,166" />
        </g>
      </svg>

      {/* Волны в левом нижнем углу */}
      <svg className="absolute bottom-0 left-0 w-[42%] h-[42%]" viewBox="0 0 500 300" fill="none" preserveAspectRatio="none">
        <g stroke="rgba(124,58,237,0.12)" strokeWidth="1.8" fill="none">
          <path d="M-40 300 C 80 200, 200 260, 320 170 S 480 60, 560 20" />
          <path d="M-40 300 C 90 215, 210 275, 330 190 S 490 85, 570 45" />
          <path d="M-40 300 C 100 230, 220 290, 340 210 S 500 110, 580 70" />
          <path d="M-40 300 C 110 245, 230 305, 350 230 S 510 135, 590 95" />
        </g>
      </svg>

      {/* Мягкие цветные пятна */}
      <div
        className="absolute -top-24 -left-20 w-96 h-96 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.14) 0%, transparent 70%)' }}
      />
      <div
        className="absolute -bottom-28 right-[12%] w-[28rem] h-[28rem] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.10) 0%, transparent 70%)' }}
      />
    </div>
    <div className="relative z-10 flex-1 flex flex-col px-6 sm:px-10 pt-4 pb-2 min-h-0">
      {/* Верхняя строка: бейдж + руководитель */}
      <div className="flex-shrink-0 relative flex items-start justify-center">
        {slide.badge && (
          <span
            className="absolute left-0 top-0 inline-flex items-center gap-2.5 rounded-full px-6 py-3 text-white text-lg font-semibold"
            style={{
              background: HEADER_GRADIENT,
              boxShadow: '0 8px 24px rgba(124,58,237,0.35)',
            }}
          >
            <Icon name="Headphones" size={20} />
            {slide.badge}
          </span>
        )}

        {slide.head && (
          <div className="relative org-drop">
            <div
              className="absolute left-1/2 -top-4 -translate-x-1/2 w-11 h-11 rounded-full bg-white flex items-center justify-center z-10"
              style={{ boxShadow: '0 4px 14px rgba(124,58,237,0.22)' }}
            >
              <Icon name="Crown" size={22} className="text-violet-500" />
            </div>
            <div
              className="rounded-3xl bg-white px-16 sm:px-20 pt-5 pb-3 text-center"
              style={{ boxShadow: '0 8px 30px rgba(124,58,237,0.12), 0 2px 6px rgba(15,23,42,0.06)' }}
            >
              <p className="text-2xl sm:text-3xl font-bold text-slate-800 leading-tight">
                {slide.head.role}
              </p>
              {slide.head.name && (
                <p className="text-lg sm:text-xl text-slate-500 leading-tight mt-1">
                  {slide.head.name}
                </p>
              )}
              <p className="text-xl sm:text-2xl font-bold text-violet-600 leading-tight mt-1.5">
                {slide.head.salary}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Скруглённая разводка линий к колонкам */}
      <div className="flex-shrink-0 relative h-7 sm:h-8">
        <div
          className="absolute left-1/2 top-0 h-1/2 w-[2px] -translate-x-1/2"
          style={{ background: LINE_COLOR }}
        />
        <div
          className="absolute left-[16.666%] right-[16.666%] top-1/2 bottom-[11px] rounded-t-2xl border-l-2 border-r-2 border-t-2"
          style={{ borderColor: LINE_COLOR }}
        />
        <div
          className="absolute left-1/2 top-1/2 bottom-[11px] w-[2px] -translate-x-1/2"
          style={{ background: LINE_COLOR }}
        />
        <div className="absolute inset-0 grid grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="relative flex justify-center">
              <div
                className="absolute bottom-0 w-0 h-0 border-x-[7px] border-x-transparent border-t-[11px]"
                style={{ borderTopColor: LINE_COLOR }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Колонки линий */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 min-h-0">
        {slide.columns?.map((col, ci) => (
          <div key={col.title} className="flex flex-col min-w-0">
            {/* Заголовок линии */}
            <div
              className="rounded-full py-2.5 px-6 flex items-center justify-center gap-2.5 mb-2.5 org-drop"
              style={{
                background: HEADER_GRADIENT,
                boxShadow: '0 8px 22px rgba(99,102,241,0.28)',
                animationDelay: `${250 + ci * 110}ms`,
              }}
            >
              <Icon name={COLUMN_ICONS[ci] ?? 'Circle'} size={20} className="text-white/90" />
              <p className="text-lg sm:text-xl font-semibold text-white">{col.title}</p>
            </div>

            {/* Карточки сотрудников */}
            <div className="space-y-2">
              {col.people.map((p, i) => (
                <PersonCard key={i} {...p} delay={500 + ci * 120 + i * 110} />
              ))}
            </div>

            {/* Итоги в цифрах + ФОТ */}
            {ci === 1 && slide.payroll && (
              <div className="mt-auto md:w-[calc(160%+1.5rem)]">
                {slide.columns && (
                  <div className="flex gap-3 mb-2">
                    <StatCard icon="Users" value={String(total)} label="сотрудников" delay={1200} />
                    <StatCard icon="Layers" value={String(slide.columns.length)} label="линии поддержки" delay={1320} />
                    {vacancies > 0 && (
                      <StatCard icon="Search" value={String(vacancies)} label={vacancies === 1 ? 'вакансия' : 'вакансии'} delay={1440} />
                    )}
                  </div>
                )}
                <div
                  className="relative rounded-3xl bg-white pl-8 pr-32 sm:pr-40 py-4 flex items-center overflow-hidden org-drop"
                  style={{
                    boxShadow: CARD_SHADOW,
                    animationDelay: '1550ms',
                    minHeight: 'clamp(96px, 13vh, 165px)',
                  }}
                >
                  <div className="min-w-0">
                    <p className="text-3xl lg:text-4xl font-extrabold text-slate-900 whitespace-nowrap">
                      ФОТ: {slide.payroll}
                    </p>
                    {slide.payrollNote && (
                      <p className="text-sm text-slate-500 mt-1">{slide.payrollNote}</p>
                    )}
                  </div>
                  <img
                    src="/coins-3d.png"
                    alt=""
                    className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 w-24 sm:w-32 object-contain pointer-events-none"
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
  );
};

export default OrgSlide;