import Icon from '@/components/ui/icon';
import { Slide } from './slides';

const PersonCard = ({ role, name, salary, vacancy }: {
  role: string; name?: string; salary: string; vacancy?: boolean;
}) => (
  <div className="relative flex items-stretch">
    {/* соединитель от вертикальной линии */}
    <div className="absolute -left-5 top-1/2 w-5 h-0.5 bg-white/45" />
    <div className="flex-1 flex items-center rounded-2xl bg-white shadow-lg overflow-hidden">
      <div className="flex-1 px-4 py-2.5 min-w-0">
        <p className="text-sm sm:text-base font-bold text-slate-800 leading-tight">
          {role}
        </p>
        {name && (
          <p className={`text-xs sm:text-sm leading-tight ${vacancy ? 'text-indigo-500 italic' : 'text-slate-500'}`}>
            {name}
          </p>
        )}
      </div>
      <div
        className="px-3 py-2.5 text-white text-xs sm:text-sm font-bold whitespace-nowrap self-stretch flex items-center"
        style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #a855f7 100%)' }}
      >
        {salary}
      </div>
    </div>
  </div>
);

const OrgSlide = ({ slide }: { slide: Slide }) => (
  <div className="h-full flex flex-col px-16 sm:px-20 lg:px-28 pt-5 pb-2 overflow-hidden">
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
          <div className="rounded-2xl bg-white shadow-xl py-2.5 px-4 text-center mb-4">
            <p className="text-xl sm:text-2xl font-extrabold text-slate-800">{col.title}</p>
          </div>

          {/* Вертикальная ветка + карточки */}
          <div className="relative pl-5 space-y-2.5">
            <div className="absolute left-0 top-0 bottom-6 w-0.5 bg-white/45" />
            {col.people.map((p, i) => (
              <PersonCard key={i} {...p} />
            ))}
          </div>
        </div>
      ))}
    </div>

    {/* ФОТ */}
    {slide.payroll && (
      <div className="flex-shrink-0 mt-3 mb-2 flex justify-center">
        <div className="rounded-2xl bg-white shadow-2xl px-6 sm:px-10 py-2.5 sm:py-3 flex items-center gap-3">
          <p className="text-lg sm:text-3xl font-extrabold text-slate-800">
            ФОТ: {slide.payroll}
          </p>
          <Icon name="Coins" size={30} className="text-amber-400 flex-shrink-0" />
        </div>
      </div>
    )}
  </div>
);

export default OrgSlide;