import { Slide } from '../slides';
import Icon from '@/components/ui/icon';
import { HEADER_GRADIENT, formatMoney, parseMoney, useDutiesToggle } from './orgShared';
import { DutiesOverlay } from './OrgOverlays';

const OrgHead = ({ slide }: { slide: Slide }) => {
  const headDuties = useDutiesToggle(!!slide.head?.duties?.length);

  return (
      <div className="flex-shrink-0 relative flex flex-col md:block items-center md:items-start gap-3 md:gap-0 md:flex md:flex-row md:justify-center">
        {slide.badge && (
          <span
            className="md:absolute md:left-0 md:top-0 inline-flex items-center justify-center gap-2 md:gap-2.5 rounded-full px-4 py-2 md:px-6 md:py-3 text-white text-[13px] md:text-lg font-semibold w-full md:w-auto md:max-w-[30%] text-center"
            style={{
              background: HEADER_GRADIENT,
              boxShadow: '0 8px 24px rgba(124,58,237,0.35)',
            }}
          >
            <Icon name={slide.badgeIcon ?? 'Headphones'} size={16} className="flex-shrink-0 md:hidden" />
            <Icon name={slide.badgeIcon ?? 'Headphones'} size={20} className="flex-shrink-0 hidden md:block" />
            <span className="leading-snug">{slide.badge}</span>
          </span>
        )}

        {slide.head && (
          <div className="relative org-drop w-full md:w-auto z-0 hover:z-[60]">
            <div
              className="absolute left-1/2 -top-3.5 md:-top-4 -translate-x-1/2 w-9 h-9 md:w-11 md:h-11 rounded-full bg-white flex items-center justify-center z-10"
              style={{ boxShadow: '0 4px 14px rgba(124,58,237,0.22)' }}
            >
              <Icon name="Crown" size={18} className="text-violet-500 md:hidden" />
              <Icon name="Crown" size={22} className="text-violet-500 hidden md:block" />
            </div>
            <div
              ref={headDuties.ref}
              {...headDuties.handlers}
              className={`group relative rounded-3xl px-6 sm:px-20 pt-5 md:pt-4 pb-3 md:pb-2.5 text-center flex flex-col items-center ${slide.head.replace ? 'bg-rose-50 ring-1 ring-rose-200' : 'bg-white'} ${slide.head.duties?.length ? 'cursor-pointer' : ''}`}
              style={{ boxShadow: '0 8px 30px rgba(124,58,237,0.12), 0 2px 6px rgba(15,23,42,0.06)' }}
            >
              {slide.head.photo && (
                <img
                  src={slide.head.photo}
                  alt={slide.head.name || slide.head.role}
                  className={`w-12 h-12 md:w-14 md:h-14 rounded-full object-cover ring-2 mb-1.5 ${slide.head.replace ? 'ring-rose-300' : 'ring-violet-200'}`}
                />
              )}
              <p className="text-lg md:text-3xl font-bold text-slate-800 leading-tight">
                {slide.head.role}
              </p>
              {slide.head.name && (
                slide.head.vacancy ? (
                  <span className="text-[11px] md:text-sm font-semibold text-white px-2.5 md:px-3 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 whitespace-nowrap mt-1.5">
                    {slide.head.name}
                  </span>
                ) : (
                  <p className="text-sm md:text-xl text-slate-500 leading-tight mt-1">
                    {slide.head.name}
                  </p>
                )
              )}
              {slide.head.note && (
                <span className="text-[10px] md:text-sm font-semibold text-white px-2.5 md:px-3 py-0.5 md:py-1 rounded-full bg-gradient-to-r from-rose-500 to-red-500 leading-snug mt-1.5">
                  {slide.head.note}
                </span>
              )}
              {slide.head.salaryWas && (
                <span className="relative inline-flex items-center mt-1.5">
                  <span className="text-xs md:text-lg font-semibold text-slate-400">
                    {slide.head.salaryWas}
                  </span>
                  <span
                    className="pointer-events-none absolute left-[-4%] right-[-4%] top-1/2 h-[2px] rounded-full rotate-[-2deg]"
                    style={{ background: 'linear-gradient(90deg, rgba(239,68,68,0) 0%, #ef4444 12%, #dc2626 50%, #ef4444 88%, rgba(239,68,68,0) 100%)' }}
                  />
                </span>
              )}
              <p className={`text-base md:text-2xl font-bold leading-tight mt-1.5 flex items-center gap-2 ${slide.head.replace ? 'text-rose-600' : 'text-violet-600'}`}>
                {slide.head.salary}
                {slide.head.salaryWas && (
                  <span className="text-[10px] md:text-sm font-black uppercase tracking-wider text-white px-2 py-0.5 rounded-full bg-emerald-500">
                    −{formatMoney(parseMoney(slide.head.salaryWas) - parseMoney(slide.head.salary))} ₽
                  </span>
                )}
              </p>
              {slide.head.salaryNote && (
                <p className="text-[10px] md:text-xs text-slate-400 leading-tight mt-0.5">
                  {slide.head.salaryNote}
                </p>
              )}

              {slide.head.duties && slide.head.duties.length > 0 && (
                <>
                  <span className="absolute top-2 right-2 opacity-40">
                    <Icon name="Info" size={14} className="text-violet-400" />
                  </span>
                  {headDuties.open && (
                    <DutiesOverlay title={slide.head.role} duties={slide.head.duties} />
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
  );
};

export default OrgHead;
