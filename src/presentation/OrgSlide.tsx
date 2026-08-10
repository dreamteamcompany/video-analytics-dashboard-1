import { Slide } from './slides';
import Icon from '@/components/ui/icon';

const SOFT_SHADOW = '6px 6px 14px rgba(163,177,198,0.55), -6px -6px 14px rgba(255,255,255,0.9)';
const PILL_GRADIENT = 'linear-gradient(90deg, #6d28d9 0%, #7c3aed 45%, #4f46e5 100%)';
const LINE_COLOR = '#5b21b6';

const PersonCard = ({ role, name, note, salary, vacancy, delay = 0 }: {
  role: string; name?: string; note?: string; salary: string; vacancy?: boolean; delay?: number;
}) => (
  <div className="relative flex items-center group org-in" style={{ animationDelay: `${delay}ms` }}>
    {/* стрелка от вертикальной линии */}
    <div className="absolute -left-6 top-1/2 -translate-y-1/2 flex items-center">
      <div className="w-4 h-[3px] rounded-full" style={{ background: LINE_COLOR }} />
      <div
        className="w-0 h-0 border-y-[6px] border-y-transparent border-l-[9px]"
        style={{ borderLeftColor: LINE_COLOR }}
      />
    </div>

    <div
      className="flex-1 flex items-center gap-3 rounded-3xl bg-[#eef0f6] min-w-0 pl-6 pr-3 py-3 transition-transform duration-300 hover:scale-[1.02]"
      style={{ boxShadow: SOFT_SHADOW }}
    >
      <div className="flex-1 min-w-0">
        <p className="text-base sm:text-lg font-semibold text-slate-800 leading-snug whitespace-nowrap">
          {role}
        </p>
        <div className="flex items-center gap-2 flex-wrap mt-0.5">
          {name && (
            <span className={`text-sm sm:text-lg leading-snug ${vacancy ? 'text-violet-600 font-bold italic' : 'text-slate-600'}`}>
              {name}
            </span>
          )}
          {note && (
            <span className="text-xs sm:text-sm font-bold text-white px-2.5 py-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 shadow-sm whitespace-nowrap">
              {note}
            </span>
          )}
        </div>
      </div>
      <div
        className="rounded-full px-4 py-2 text-white text-sm sm:text-lg font-bold whitespace-nowrap shadow-lg flex-shrink-0"
        style={{ background: PILL_GRADIENT }}
      >
        {salary}
      </div>
    </div>
  </div>
);

const StatCard = ({ icon, value, label, delay }: {
  icon: string; value: string; label: string; delay: number;
}) => (
  <div
    className="flex-1 min-w-0 rounded-2xl bg-[#eef0f6] px-3 py-1.5 flex items-center justify-center gap-2.5 org-drop"
    style={{ boxShadow: SOFT_SHADOW, animationDelay: `${delay}ms` }}
  >
    <Icon name={icon} size={20} className="text-violet-600 flex-shrink-0" />
    <p className="text-2xl sm:text-3xl font-extrabold leading-none bg-gradient-to-r from-violet-700 to-indigo-600 bg-clip-text text-transparent">
      {value}
    </p>
    <p className="text-xs sm:text-sm font-semibold text-slate-500 leading-tight">{label}</p>
  </div>
);

const OrgSlide = ({ slide }: { slide: Slide }) => {
  const allPeople = slide.columns?.flatMap((c) => c.people) ?? [];
  const total = allPeople.length + (slide.head ? 1 : 0);
  const vacancies = allPeople.filter((p) => p.vacancy).length;

  return (
  <div className="h-full flex flex-col bg-[#eef0f6] overflow-hidden relative">
    {/* Декоративная сфера в углу */}
    <div
      className="absolute top-6 right-24 w-24 h-24 rounded-full pointer-events-none hidden sm:block"
      style={{
        background: 'radial-gradient(circle at 32% 28%, #ffffff 0%, #f1f3f9 45%, #d7dce8 100%)',
        boxShadow: '10px 12px 24px rgba(163,177,198,0.5), -6px -6px 16px rgba(255,255,255,0.9)',
      }}
    />

    {/* Бейдж отдела */}
    {slide.badge && (
      <div className="flex-shrink-0 relative z-10">
        <span
          className="inline-block rounded-br-[2.5rem] rounded-tr-[0.5rem] pl-10 pr-10 py-3 text-white text-xl sm:text-2xl font-extrabold shadow-xl"
          style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)' }}
        >
          {slide.badge}
        </span>
      </div>
    )}

    <div className="flex-1 flex flex-col px-4 sm:px-6 lg:px-8 pt-1 pb-1 min-h-0">
      {/* Руководитель */}
      {slide.head && (
        <div className="flex-shrink-0 flex justify-center">
          <div
            className="rounded-[2rem] bg-[#eef0f6] px-14 sm:px-20 py-3 text-center org-drop"
            style={{ boxShadow: SOFT_SHADOW }}
          >
            <p className="text-2xl sm:text-3xl font-bold text-green-600 leading-tight">
              {slide.head.role}
            </p>
            {slide.head.name && (
              <p className="text-xl sm:text-2xl font-bold text-slate-700 leading-tight mt-0.5">
                {slide.head.name}
              </p>
            )}
            <p className="text-2xl sm:text-3xl font-bold text-green-600 leading-tight mt-0.5">
              {slide.head.salary}
            </p>
          </div>
        </div>
      )}

      {/* Диагональные стрелки к колонкам */}
      <div className="flex-shrink-0 relative h-8 sm:h-10">
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 300 60"
          preserveAspectRatio="none"
        >
          <line x1="150" y1="0" x2="50" y2="52" stroke={LINE_COLOR} strokeWidth="3" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          <line x1="150" y1="0" x2="150" y2="52" stroke={LINE_COLOR} strokeWidth="3" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          <line x1="150" y1="0" x2="250" y2="52" stroke={LINE_COLOR} strokeWidth="3" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        </svg>
        {/* наконечники стрелок */}
        <div className="absolute inset-x-0 bottom-0 grid grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex justify-center">
              <div
                className="w-0 h-0 border-x-[9px] border-x-transparent border-t-[13px]"
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
              className="rounded-full py-2 px-6 text-center mb-3 org-drop"
              style={{
                background: 'linear-gradient(135deg, #312e81 0%, #4c1d95 100%)',
                boxShadow: '6px 6px 16px rgba(76,29,149,0.35), -4px -4px 12px rgba(255,255,255,0.8)',
                animationDelay: `${250 + ci * 110}ms`,
              }}
            >
              <p className="text-xl sm:text-2xl font-extrabold text-white">{col.title}</p>
            </div>

            {/* Вертикальная ветка + карточки */}
            <div className="relative pl-6 space-y-2">
              <div
                className="absolute left-0 top-0 bottom-6 w-[3px] rounded-full"
                style={{ background: LINE_COLOR }}
              />
              {col.people.map((p, i) => (
                <PersonCard key={i} {...p} delay={500 + ci * 120 + i * 110} />
              ))}
            </div>

            {/* Итоги в цифрах + ФОТ — под 2-й и 3-й колонками */}
            {ci === 1 && slide.payroll && (
              <div className="mt-auto md:w-[calc(160%+1.5rem)]">
                {slide.columns && (
                  <div className="flex gap-3 mb-2.5">
                    <StatCard icon="Users" value={String(total)} label="сотрудников" delay={1200} />
                    <StatCard icon="Layers" value={String(slide.columns.length)} label="линии" delay={1320} />
                    {vacancies > 0 && (
                      <StatCard icon="Search" value={String(vacancies)} label={vacancies === 1 ? 'вакансия' : 'вакансии'} delay={1440} />
                    )}
                  </div>
                )}
                <div
                  className="relative rounded-[2rem] bg-[#eef0f6] pl-8 pr-28 sm:pr-36 py-4 sm:py-5 flex items-center overflow-hidden org-drop"
                  style={{ boxShadow: SOFT_SHADOW, animationDelay: '1550ms' }}
                >
                  <div className="min-w-0">
                    <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 whitespace-nowrap">
                      ФОТ: {slide.payroll}
                    </p>
                    {slide.payrollNote && (
                      <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
                        {slide.payrollNote}
                      </p>
                    )}
                  </div>
                  <img
                    src="/coins-3d.png"
                    alt=""
                    className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-20 sm:w-28 lg:w-32 object-contain pointer-events-none drop-shadow-xl"
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