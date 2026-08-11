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
          className={`flex-none md:flex-1 grid ${compact ? 'gap-3 md:gap-4' : 'gap-3 md:gap-5'} md:min-h-0 auto-rows-max md:auto-rows-auto content-start md:content-stretch`}
          style={{ gridTemplateColumns: `repeat(${isMobile ? 1 : cols}, minmax(0, 1fr))` }}
        >
          {goals.map((g, i) => (
            <div
              key={g.title}
              className={`group relative rounded-3xl bg-white ${compact ? 'p-4 md:p-5' : 'p-4 md:p-6'} flex flex-col gap-3 org-in overflow-hidden transition-shadow`}
              style={{ boxShadow: CARD_SHADOW, animationDelay: `${200 + i * 110}ms` }}
            >
              <span
                className="absolute right-4 top-2 text-[52px] md:text-[64px] font-black leading-none select-none pointer-events-none"
                style={{ color: 'rgba(124,58,237,0.06)' }}
              >
                {i + 1}
              </span>

              <div className="relative flex items-start gap-3">
                <div
                  className="w-11 h-11 md:w-12 md:h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: HEADER_GRADIENT, boxShadow: '0 6px 16px rgba(124,58,237,0.28)' }}
                >
                  <Icon name={g.icon ?? 'Target'} size={22} className="text-white" />
                </div>
                <p className={`${dense ? 'text-[15px] md:text-[17px]' : 'text-[15px] md:text-xl'} font-bold text-slate-800 leading-tight pt-1 pr-8`}>
                  {g.title}
                </p>
              </div>

              {g.metric && (
                <div className="relative flex items-baseline gap-2 flex-wrap">
                  <span
                    className={`${dense ? 'text-[26px] md:text-[30px]' : 'text-3xl md:text-4xl'} font-black leading-none`}
                    style={{
                      background: HEADER_GRADIENT,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    {g.metric}
                  </span>
                  {g.metricNote && (
                    <span className="text-[11px] md:text-[13px] font-semibold text-slate-400 uppercase tracking-wide">
                      {g.metricNote}
                    </span>
                  )}
                </div>
              )}

              <p className={`relative ${dense ? 'text-[12px] md:text-[13px]' : 'text-[13px] md:text-[15px]'} text-slate-500 leading-snug`}>
                {g.text}
              </p>

              {(g.effect || g.result) && (
                <div className="relative mt-auto pt-2.5 border-t border-slate-100 flex items-center gap-2">
                  <Icon name="ArrowRight" size={14} className="text-violet-400 flex-shrink-0" />
                  <p className={`${dense ? 'text-[11px] md:text-[12px]' : 'text-[12px] md:text-[13px]'} font-semibold text-violet-600 leading-snug`}>
                    {g.effect ?? g.result}
                  </p>
                </div>
              )}
            </div>
          ))}

          {/* Экономический эффект — акцентный блок */}
          {slide.impacts && slide.impacts.length > 0 && (
            <div
              className="relative rounded-3xl p-4 md:px-5 md:py-4 flex flex-col gap-2.5 org-in overflow-hidden"
              style={{
                background: 'linear-gradient(150deg, #3b0764 0%, #5b21b6 45%, #312e81 100%)',
                boxShadow: '0 16px 40px rgba(59,7,100,0.42)',
                animationDelay: `${200 + goals.length * 110}ms`,
              }}
            >
              <div
                className="absolute -top-16 -right-16 w-56 h-56 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.38) 0%, transparent 70%)' }}
              />
              <div
                className="absolute inset-0 pointer-events-none opacity-[0.14]"
                style={{
                  backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
                  backgroundSize: '18px 18px',
                  maskImage: 'linear-gradient(200deg, #000 0%, transparent 55%)',
                  WebkitMaskImage: 'linear-gradient(200deg, #000 0%, transparent 55%)',
                }}
              />

              <div className="relative">
                <p className="text-[9px] md:text-[10px] font-bold text-cyan-300 tracking-[0.24em] uppercase mb-1.5">
                  Экономический эффект
                </p>
                <p className="text-[15px] md:text-xl font-extrabold text-white leading-tight">
                  {slide.impactGoal}
                </p>
              </div>

              <div className="relative grid grid-cols-2 gap-2 md:gap-2.5">
                {slide.impacts.map((it) => (
                  <div
                    key={it.label}
                    className="rounded-2xl bg-white/10 border border-white/10 px-2.5 py-2 flex flex-col gap-0.5"
                  >
                    <Icon name={it.icon ?? 'Coins'} size={16} className="text-cyan-300" />
                    <p className="text-[16px] md:text-[20px] font-black text-white leading-none">
                      {it.value}
                    </p>
                    <p className="text-[10px] md:text-[11px] text-white/55 leading-snug">
                      {it.label}
                    </p>
                  </div>
                ))}
              </div>

              {slide.conclusion && (
                <div className="relative mt-auto pt-2 border-t border-white/15 flex items-center gap-2">
                  <Icon name="ShieldCheck" size={14} className="text-cyan-300 flex-shrink-0" />
                  <p className="text-[11px] md:text-[12px] text-white/70 leading-snug">
                    {slide.conclusion}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoalsSlide;