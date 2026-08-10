import Icon from '@/components/ui/icon';
import { Slide } from './slides';

const SOFT_SHADOW = '6px 6px 14px rgba(163,177,198,0.55), -6px -6px 14px rgba(255,255,255,0.9)';
const PILL_GRADIENT = 'linear-gradient(90deg, #6d28d9 0%, #7c3aed 45%, #4f46e5 100%)';

const PersonCard = ({ role, name, salary, vacancy }: {
  role: string; name?: string; salary: string; vacancy?: boolean;
}) => (
  <div className="relative flex items-center">
    {/* стрелка от вертикальной линии */}
    <div className="absolute -left-6 top-1/2 -translate-y-1/2 flex items-center">
      <div className="w-4 h-0.5 bg-violet-700" />
      <div
        className="w-0 h-0 border-y-[5px] border-y-transparent border-l-[7px] border-l-violet-700"
      />
    </div>

    <div
      className="flex-1 flex items-center rounded-full bg-[#eef0f6] min-w-0"
      style={{ boxShadow: SOFT_SHADOW }}
    >
      <div className="flex-1 px-5 py-3 min-w-0">
        <p className="text-sm sm:text-base font-semibold text-slate-800 leading-snug">
          {role}
        </p>
        {name && (
          <p className={`text-sm sm:text-base leading-snug ${vacancy ? 'text-violet-600 italic' : 'text-slate-600'}`}>
            {name}
          </p>
        )}
      </div>
      <div
        className="rounded-full px-5 py-3 text-white text-sm sm:text-base font-semibold whitespace-nowrap self-stretch flex items-center -ml-6"
        style={{ background: PILL_GRADIENT }}
      >
        {salary}
      </div>
    </div>
  </div>
);

const OrgSlide = ({ slide }: { slide: Slide }) => (
  <div className="h-full flex flex-col bg-[#eef0f6] overflow-hidden">
    {/* Бейдж отдела */}
    {slide.badge && (
      <div className="flex-shrink-0">
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
          <line x1="150" y1="0" x2="50" y2="52" stroke="#6d28d9" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
          <line x1="150" y1="0" x2="150" y2="52" stroke="#6d28d9" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
          <line x1="150" y1="0" x2="250" y2="52" stroke="#6d28d9" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
        </svg>
        {/* наконечники стрелок */}
        <div className="absolute inset-x-0 bottom-0 grid grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex justify-center">
              <div className="w-0 h-0 border-x-[7px] border-x-transparent border-t-[10px] border-t-violet-700" />
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
              <div className="absolute left-0 top-0 bottom-6 w-0.5 bg-violet-700" />
              {col.people.map((p, i) => (
                <PersonCard key={i} {...p} />
              ))}
            </div>

            {/* ФОТ — под второй колонкой, как в макете */}
            {ci === 1 && slide.payroll && (
              <div
                className="mt-auto rounded-3xl bg-[#eef0f6] px-6 py-4 flex items-center justify-center gap-4"
                style={{ boxShadow: SOFT_SHADOW }}
              >
                <p className="text-xl sm:text-3xl font-extrabold text-slate-900 whitespace-nowrap">
                  ФОТ: {slide.payroll}
                </p>
                <Icon name="Coins" size={36} className="text-amber-400 flex-shrink-0" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default OrgSlide;