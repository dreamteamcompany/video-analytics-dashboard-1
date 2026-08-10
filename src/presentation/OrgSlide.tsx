import { Slide } from './slides';

const SOFT_SHADOW = '6px 6px 14px rgba(163,177,198,0.55), -6px -6px 14px rgba(255,255,255,0.9)';
const PILL_GRADIENT = 'linear-gradient(90deg, #6d28d9 0%, #7c3aed 45%, #4f46e5 100%)';
const LINE_COLOR = '#5b21b6';

const PersonCard = ({ role, name, note, salary, vacancy }: {
  role: string; name?: string; note?: string; salary: string; vacancy?: boolean;
}) => (
  <div className="relative flex items-center group">
    {/* стрелка от вертикальной линии */}
    <div className="absolute -left-6 top-1/2 -translate-y-1/2 flex items-center">
      <div className="w-4 h-[3px] rounded-full" style={{ background: LINE_COLOR }} />
      <div
        className="w-0 h-0 border-y-[6px] border-y-transparent border-l-[9px]"
        style={{ borderLeftColor: LINE_COLOR }}
      />
    </div>

    <div
      className="flex-1 flex items-center rounded-full bg-[#eef0f6] min-w-0 transition-transform duration-300 hover:scale-[1.02]"
      style={{ boxShadow: SOFT_SHADOW }}
    >
      <div className="flex-1 px-5 py-3 min-w-0">
        <p className="text-sm sm:text-base font-semibold text-slate-800 leading-snug">
          {role}
        </p>
        <div className="flex items-center gap-2 flex-wrap mt-0.5">
          {name && (
            <span className={`text-sm sm:text-base leading-snug ${vacancy ? 'text-violet-600 font-bold italic' : 'text-slate-600'}`}>
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
        className="rounded-full px-5 py-3 text-white text-sm sm:text-base font-bold whitespace-nowrap self-stretch flex items-center -ml-6 shadow-lg"
        style={{ background: PILL_GRADIENT }}
      >
        {salary}
      </div>
    </div>
  </div>
);

const OrgSlide = ({ slide }: { slide: Slide }) => (
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
          className="inline-block rounded-br-[2.5rem] rounded-tr-[0.5rem] pl-10 pr-10 py-4 text-white text-xl sm:text-3xl font-extrabold shadow-xl"
          style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)' }}
        >
          {slide.badge}
        </span>
      </div>
    )}

    <div className="flex-1 flex flex-col px-10 sm:px-16 lg:px-24 pt-2 pb-3 min-h-0">
      {/* Руководитель */}
      {slide.head && (
        <div className="flex-shrink-0 flex justify-center">
          <div
            className="rounded-3xl bg-[#eef0f6] px-10 sm:px-16 py-4 text-center"
            style={{ boxShadow: SOFT_SHADOW }}
          >
            <p className="text-lg sm:text-3xl font-bold text-green-600 leading-tight">
              {slide.head.role}
            </p>
            <p className="text-lg sm:text-3xl font-bold text-green-600 leading-tight mt-1">
              {slide.head.salary}
            </p>
          </div>
        </div>
      )}

      {/* Диагональные стрелки к колонкам */}
      <div className="flex-shrink-0 relative h-12 sm:h-16">
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
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-10 min-h-0">
        {slide.columns?.map((col, ci) => (
          <div key={col.title} className="flex flex-col min-w-0">
            {/* Заголовок линии */}
            <div
              className="rounded-full bg-[#eef0f6] py-3 px-6 text-center mb-5"
              style={{ boxShadow: SOFT_SHADOW }}
            >
              <p className="text-xl sm:text-3xl font-extrabold text-slate-900">{col.title}</p>
            </div>

            {/* Вертикальная ветка + карточки */}
            <div className="relative pl-6 space-y-4">
              <div
                className="absolute left-0 top-0 bottom-6 w-[3px] rounded-full"
                style={{ background: LINE_COLOR }}
              />
              {col.people.map((p, i) => (
                <PersonCard key={i} {...p} />
              ))}
            </div>

            {/* ФОТ — под второй колонкой, как в макете */}
            {ci === 1 && slide.payroll && (
              <div
                className="mt-auto relative rounded-3xl bg-[#eef0f6] pl-6 pr-20 sm:pr-24 py-5 flex items-center justify-start overflow-hidden"
                style={{ boxShadow: SOFT_SHADOW }}
              >
                <p className="text-xl sm:text-3xl font-extrabold text-slate-900 whitespace-nowrap">
                  ФОТ: {slide.payroll}
                </p>
                <img
                  src="/coins-3d.png"
                  alt=""
                  className="absolute right-1 bottom-0 w-16 sm:w-20 object-contain pointer-events-none drop-shadow-lg"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default OrgSlide;