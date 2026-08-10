import { Slide } from './slides';
import Icon from '@/components/ui/icon';
import { useIsMobile } from '@/hooks/use-mobile';

const CARD_SHADOW = '0 4px 20px rgba(124,58,237,0.08), 0 1px 3px rgba(15,23,42,0.06)';
const HEADER_GRADIENT = 'linear-gradient(90deg, #6d28d9 0%, #7c3aed 50%, #6366f1 100%)';

const GoalsSlide = ({ slide }: { slide: Slide }) => {
  const isMobile = useIsMobile();
  const goals = slide.goals ?? [];
  const cells = goals.length + (slide.impacts?.length ? 1 : 0);
  const cols = cells <= 2 ? 1 : cells <= 4 ? 2 : 3;
  const compact = cells > 2;
  const dense = cells > 4;

  return (
    <div
      className="h-full flex flex-col overflow-hidden relative"
      style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #fafaff 45%, #f3edfd 75%, #fdf0f7 100%)',
      }}
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-0 right-0 w-[34%] h-[42%]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(99,102,241,0.28) 1.7px, transparent 1.7px)',
            backgroundSize: '17px 17px',
            maskImage: 'linear-gradient(225deg, #000 5%, transparent 60%)',
            WebkitMaskImage: 'linear-gradient(225deg, #000 5%, transparent 60%)',
          }}
        />
        <div
          className="absolute -bottom-28 -left-20 w-[26rem] h-[26rem] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.16) 0%, transparent 70%)' }}
        />
        <div
          className="absolute -top-24 right-[10%] w-[24rem] h-[24rem] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.10) 0%, transparent 70%)' }}
        />
      </div>

      <div className="relative z-10 flex-1 flex flex-col px-3 sm:px-10 pt-3 sm:pt-6 pb-6 md:pb-4 min-h-0 overflow-y-auto md:overflow-hidden">
        {/* Заголовок */}
        <div className={`flex-shrink-0 flex flex-col items-center gap-2 ${compact ? 'md:gap-1.5 mb-3 md:mb-4' : 'md:gap-3 mb-4 md:mb-6'}`}>
          {slide.badge && (
            <span
              className="inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 md:px-6 md:py-3 text-white text-[13px] md:text-lg font-semibold text-center"
              style={{ background: HEADER_GRADIENT, boxShadow: '0 8px 24px rgba(124,58,237,0.35)' }}
            >
              <Icon name={slide.badgeIcon ?? 'Target'} size={16} className="flex-shrink-0 md:hidden" />
              <Icon name={slide.badgeIcon ?? 'Target'} size={20} className="flex-shrink-0 hidden md:block" />
              <span className="leading-snug">{slide.badge}</span>
            </span>
          )}
          <h2 className={`${compact ? 'text-xl md:text-3xl' : 'text-xl md:text-4xl'} font-extrabold text-slate-800 text-center leading-tight`}>
            {slide.title ?? 'Цели на год'}
          </h2>
          {slide.goalsYear && (
            <p className="text-xs md:text-base font-semibold text-violet-500 tracking-[0.25em]">
              {slide.goalsYear}
            </p>
          )}
        </div>

        {/* Карточки целей */}
        <div
          className={`flex-none md:flex-1 grid ${compact ? 'gap-2.5 md:gap-3' : 'gap-3 md:gap-5'} md:min-h-0 auto-rows-max md:auto-rows-auto content-start md:content-stretch`}
          style={{ gridTemplateColumns: `repeat(${isMobile ? 1 : cols}, minmax(0, 1fr))` }}
        >
          {goals.map((g, i) => (
            <div
              key={g.title}
              className={`relative rounded-2xl bg-white/90 backdrop-blur-sm ${compact ? 'p-3 md:p-4' : 'p-4 md:p-6'} flex flex-col ${compact ? 'gap-2' : 'gap-2.5 md:gap-3'} org-in overflow-hidden`}
              style={{ boxShadow: CARD_SHADOW, animationDelay: `${200 + i * 130}ms` }}
            >
              <div
                className="absolute left-0 top-0 bottom-0 w-1.5"
                style={{ background: HEADER_GRADIENT }}
              />
              <div className="flex items-start gap-3 md:gap-4 pl-1.5">
                <div className={`${compact ? 'w-10 h-10 md:w-11 md:h-11' : 'w-10 h-10 md:w-14 md:h-14'} rounded-2xl bg-violet-50 flex items-center justify-center flex-shrink-0`}>
                  <Icon name={g.icon ?? 'Target'} size={20} className="text-violet-500 md:hidden" />
                  <Icon name={g.icon ?? 'Target'} size={compact ? 22 : 28} className="text-violet-500 hidden md:block" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="flex-shrink-0 w-6 h-6 rounded-full text-white text-[11px] md:text-xs font-bold flex items-center justify-center"
                      style={{ background: HEADER_GRADIENT }}
                    >
                      {i + 1}
                    </span>
                    <p className={`${dense ? 'text-[14px] md:text-[15px]' : compact ? 'text-[14px] md:text-base' : 'text-[14px] md:text-xl'} font-bold text-slate-800 leading-snug`}>
                      {g.title}
                    </p>
                  </div>
                </div>
              </div>

              <p className={`${dense ? 'text-[12px] md:text-xs leading-snug' : compact ? 'text-[12px] md:text-[13px] leading-snug' : 'text-[12px] md:text-base leading-relaxed'} text-slate-600 pl-1.5`}>
                {g.text}
              </p>

              {g.result && (
                <div className={`mt-auto flex items-start gap-2 rounded-xl bg-emerald-50 ${compact ? 'px-3 py-1.5 md:px-3 md:py-2' : 'px-3 py-2 md:px-4 md:py-2.5'}`}>
                  <Icon name="TrendingUp" size={15} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                  <p className={`${dense ? 'text-[12px] md:text-xs' : compact ? 'text-[12px] md:text-[13px]' : 'text-[12px] md:text-base'} font-semibold text-emerald-700 leading-snug`}>
                    {g.result}
                  </p>
                </div>
              )}

              {g.effect && (
                <div className="flex items-start gap-2 pl-1.5">
                  <Icon name="Sparkles" size={14} className="text-violet-400 flex-shrink-0 mt-0.5" />
                  <p className={`${dense ? 'text-[11px]' : compact ? 'text-[11px] md:text-xs' : 'text-[11px] md:text-sm'} text-slate-500 italic leading-snug`}>
                    {g.effect}
                  </p>
                </div>
              )}
            </div>
          ))}

          {/* Экономический эффект — акцентный блок */}
          {slide.impacts && slide.impacts.length > 0 && (
            <div
              className="relative rounded-2xl p-3.5 md:px-4 md:py-3 flex flex-col gap-2 org-in overflow-hidden"
              style={{
                background: 'linear-gradient(150deg, #4c1d95 0%, #6d28d9 45%, #4338ca 100%)',
                boxShadow: '0 12px 34px rgba(76,29,149,0.38)',
                animationDelay: `${200 + goals.length * 130}ms`,
              }}
            >
              <div
                className="absolute -top-10 -right-10 w-40 h-40 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.35) 0%, transparent 70%)' }}
              />

              <div className="relative flex items-center gap-2.5">
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
                  <Icon name="TrendingUp" size={20} className="text-cyan-200" />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] md:text-[10px] font-bold text-cyan-200 tracking-[0.2em] uppercase leading-none mb-1">
                    Экономический эффект
                  </p>
                  <p className="text-[12px] md:text-[13px] font-bold text-white leading-snug">
                    {slide.impactGoal}
                  </p>
                </div>
              </div>

              <div className="relative space-y-1.5">
                {slide.impacts.map((it) => (
                  <div
                    key={it.label}
                    className="flex items-center gap-2 rounded-xl bg-white/10 px-2.5 py-1"
                  >
                    <Icon name={it.icon ?? 'Coins'} size={15} className="text-cyan-200 flex-shrink-0" />
                    <p className="text-[11px] md:text-[12px] text-white/80 leading-snug flex-1 min-w-0">
                      {it.label}
                    </p>
                    <p className="text-[11px] md:text-[13px] font-extrabold text-emerald-300 whitespace-nowrap flex-shrink-0">
                      {it.value}
                    </p>
                  </div>
                ))}
              </div>

              {slide.conclusion && (
                <p className="relative text-[10px] md:text-[11px] text-white/65 italic leading-snug mt-auto">
                  {slide.conclusion}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoalsSlide;