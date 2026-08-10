import Icon from '@/components/ui/icon';
import { Slide } from './slides';

const PersonCard = ({ role, name, salary, vacancy }: {
  role: string; name?: string; salary: string; vacancy?: boolean;
}) => (
  <div className="relative flex items-stretch">
    {/* соединитель от вертикальной линии */}
    <div className="absolute -left-4 top-1/2 w-4 h-px bg-white/30" />
    <div className="flex-1 flex items-center rounded-full bg-white/95 shadow-lg overflow-hidden">
      <div className="flex-1 px-3 py-2 min-w-0">
        <p className="text-[11px] sm:text-xs font-semibold text-slate-700 leading-tight truncate">
          {role}
        </p>
        {name && (
          <p className={`text-[11px] sm:text-xs leading-tight truncate ${vacancy ? 'text-indigo-500 italic' : 'text-slate-500'}`}>
            {name}
          </p>
        )}
      </div>
      <div
        className="px-3 py-2.5 text-white text-[11px] sm:text-xs font-bold whitespace-nowrap self-stretch flex items-center"
        style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #a855f7 100%)' }}
      >
        {salary}
      </div>
    </div>
  </div>
);

const OrgSlide = ({ slide }: { slide: Slide }) => (
  <div className="h-full flex flex-col px-4 sm:px-10 lg:px-16 pt-6 pb-4 overflow-y-auto">
    {/* Бейдж отдела */}
    {slide.badge && (
      <div className="flex-shrink-0 mb-4">
        <span
          className="inline-block rounded-2xl px-5 py-2.5 text-white text-lg sm:text-2xl font-extrabold shadow-xl"
          style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #9333ea 100%)' }}
        >
          {slide.badge}
        </span>
      </div>
    )}

    {/* Руководитель */}
    {slide.head && (
      <div className="flex-shrink-0 flex justify-center mb-1">
        <div className="rounded-2xl bg-white/95 shadow-2xl px-6 sm:px-10 py-3 sm:py-4 text-center">
          <p className="text-base sm:text-2xl font-extrabold text-emerald-600 leading-tight">
            {slide.head.role}
          </p>
          <p className="text-base sm:text-2xl font-extrabold text-emerald-600 leading-tight">
            {slide.head.salary}
          </p>
        </div>
      </div>
    )}

    {/* Вертикальная линия от руководителя */}
    <div className="flex-shrink-0 flex justify-center">
      <div className="w-px h-5 bg-white/40" />
    </div>

    {/* Колонки линий */}
    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-7 min-h-0">
      {slide.columns?.map((col) => (
        <div key={col.title} className="flex flex-col min-w-0">
          {/* Заголовок линии */}
          <div className="rounded-2xl bg-white/95 shadow-xl py-2.5 px-4 text-center mb-4">
            <p className="text-lg sm:text-2xl font-extrabold text-slate-800">{col.title}</p>
          </div>

          {/* Вертикальная ветка + карточки */}
          <div className="relative pl-4 space-y-2.5">
            <div className="absolute left-0 top-0 bottom-4 w-px bg-white/30" />
            {col.people.map((p, i) => (
              <PersonCard key={i} {...p} />
            ))}
          </div>
        </div>
      ))}
    </div>

    {/* ФОТ */}
    {slide.payroll && (
      <div className="flex-shrink-0 mt-4 flex justify-center">
        <div className="rounded-2xl bg-white/95 shadow-2xl px-6 sm:px-12 py-3 sm:py-4 flex items-center gap-4">
          <p className="text-xl sm:text-4xl font-extrabold text-slate-800">
            ФОТ: {slide.payroll}
          </p>
          <Icon name="Coins" size={34} className="text-amber-400 flex-shrink-0" />
        </div>
      </div>
    )}
  </div>
);

export default OrgSlide;
