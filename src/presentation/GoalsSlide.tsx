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
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(124,58,237,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.055) 1px, transparent 1px)',
            backgroundSize: '46px 46px',
            maskImage: 'radial-gradient(ellipse at 50% 0%, #000 20%, transparent 78%)',
            WebkitMaskImage: 'radial-gradient(ellipse at 50% 0%, #000 20%, transparent 78%)',
          }}
        />
        <div
          className="aurora-a absolute -bottom-32 -left-24 w-[32rem] h-[32rem] rounded-full blur-[10px]"
          style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.22) 0%, transparent 68%)' }}
        />
        <div
          className="aurora-b absolute -top-32 right-[4%] w-[30rem] h-[30rem] rounded-full blur-[10px]"
          style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 68%)' }}
        />
        <div
          className="aurora-a absolute top-1/3 left-1/3 w-[26rem] h-[26rem] rounded-full blur-[10px]"
          style={{ background: 'radial-gradient(circle, rgba(56,189,248,0.12) 0%, transparent 68%)' }}
        />
      </div>

      <div className="relative z-10 flex-1 flex flex-col px-3 sm:px-10 pt-3 sm:pt-6 pb-6 md:pb-4 min-h-0 overflow-y-auto md:overflow-hidden">
        {/* Заголовок */}
        <div className={`flex-shrink-0 flex flex-col items-center gap-1.5 ${compact ? 'md:gap-1 mb-3 md:mb-3' : 'md:gap-3 mb-4 md:mb-6'}`}>
          {slide.badge && (
            <span
              className="inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 md:px-5 md:py-2 text-white text-[13px] md:text-[15px] font-semibold text-center"
              style={{ background: HEADER_GRADIENT, boxShadow: '0 8px 24px rgba(124,58,237,0.35)' }}
            >
              <Icon name={slide.badgeIcon ?? 'Target'} size={16} className="flex-shrink-0 md:hidden" />
              <Icon name={slide.badgeIcon ?? 'Target'} size={20} className="flex-shrink-0 hidden md:block" />
              <span className="leading-snug">{slide.badge}</span>
            </span>
          )}
          <h2
            className={`${compact ? 'text-2xl md:text-3xl' : 'text-2xl md:text-5xl'} font-black text-center leading-tight tracking-tight`}
            style={{
              background: 'linear-gradient(100deg, #1e1b4b 0%, #6d28d9 55%, #db2777 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {slide.title ?? 'Цели на год'}
          </h2>
          {slide.goalsYear && (
            <div className="flex items-center gap-3">
              <span className="h-px w-8 md:w-14 bg-gradient-to-r from-transparent to-violet-300" />
              <p className="text-xs md:text-sm font-bold text-violet-500 tracking-[0.4em]">
                {slide.goalsYear}
              </p>
              <span className="h-px w-8 md:w-14 bg-gradient-to-l from-transparent to-violet-300" />
            </div>
          )}
        </div>

        {/* Карточки целей */}
        <div
          className={`w-full max-w-[1080px] mx-auto flex-none md:flex-1 grid ${compact ? 'gap-3 md:gap-3' : 'gap-3 md:gap-5'} md:min-h-0 auto-rows-max items-start content-start`}
          style={{ gridTemplateColumns: `repeat(${isMobile ? 1 : cols}, minmax(0, 1fr))` }}
        >
          {goals.map((g, i) => (
            <div
              key={g.title}
              className={`goal-card group relative rounded-[22px] ${compact ? 'p-3.5 md:px-3.5 md:py-3' : 'p-4 md:p-5'} flex flex-col gap-1.5 org-in overflow-hidden`}
              style={{
                background: 'linear-gradient(160deg, rgba(255,255,255,0.96) 0%, rgba(250,248,255,0.92) 100%)',
                backdropFilter: 'blur(10px)',
                boxShadow: CARD_SHADOW,
                animationDelay: `${200 + i * 110}ms`,
              }}
            >
              <span
                className="absolute -right-1 -top-4 text-[64px] md:text-[76px] font-black leading-none select-none pointer-events-none italic"
                style={{
                  background: 'linear-gradient(180deg, rgba(124,58,237,0.13) 0%, rgba(124,58,237,0) 78%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {i + 1}
              </span>

              <div className="relative flex items-center gap-2.5">
                <div
                  className="w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: HEADER_GRADIENT, boxShadow: '0 5px 14px rgba(124,58,237,0.3)' }}
                >
                  <Icon name={g.icon ?? 'Target'} size={19} className="text-white" />
                </div>
                <p className="text-[13px] md:text-[15px] font-bold text-slate-800 leading-tight pr-5">
                  {g.title}
                </p>
              </div>

              {g.metric && (
                <div className="relative flex items-baseline gap-1.5 flex-wrap">
                  <span
                    className="text-[24px] md:text-[28px] font-black leading-none tracking-tight"
                    style={{
                      background: 'linear-gradient(120deg, #7c3aed 0%, #6366f1 45%, #ec4899 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    {g.metric}
                  </span>
                  {g.metricNote && (
                    <span className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">
                      {g.metricNote}
                    </span>
                  )}
                </div>
              )}

              <p className="relative text-[11px] md:text-[12px] text-slate-400 leading-snug">
                {g.text}
              </p>

              {(g.effect || g.result) && (
                <div
                  className="relative mt-auto flex items-center gap-2 rounded-xl px-2.5 py-2"
                  style={{
                    background: 'linear-gradient(100deg, rgba(124,58,237,0.11) 0%, rgba(236,72,153,0.09) 100%)',
                    borderLeft: '3px solid #7c3aed',
                  }}
                >
                  <p className="text-[12px] md:text-[14px] font-extrabold text-violet-800 leading-snug">
                    {g.effect ?? g.result}
                  </p>
                </div>
              )}
            </div>
          ))}

          {/* Экономический эффект — акцентный блок */}
          {slide.impacts && slide.impacts.length > 0 && (
            <div
              className="relative rounded-[22px] p-4 md:px-3.5 md:py-3 flex flex-col gap-2 org-in overflow-hidden"
              style={{
                background: 'linear-gradient(155deg, #2e1065 0%, #5b21b6 42%, #1e1b4b 100%)',
                boxShadow: '0 22px 50px rgba(46,16,101,0.5)',
                animationDelay: `${200 + goals.length * 110}ms`,
              }}
            >
              <div
                className="aurora-a absolute -top-20 -right-16 w-64 h-64 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.45) 0%, transparent 68%)' }}
              />
              <div
                className="aurora-b absolute -bottom-24 -left-16 w-56 h-56 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.32) 0%, transparent 68%)' }}
              />
              <div
                className="absolute inset-0 pointer-events-none opacity-[0.13]"
                style={{
                  backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
                  backgroundSize: '18px 18px',
                  maskImage: 'linear-gradient(200deg, #000 0%, transparent 60%)',
                  WebkitMaskImage: 'linear-gradient(200deg, #000 0%, transparent 60%)',
                }}
              />

              <div className="relative">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/12 border border-white/15 px-2.5 py-1 mb-2">
                  <Icon name="TrendingUp" size={12} className="text-cyan-300" />
                  <span className="text-[9px] md:text-[10px] font-bold text-cyan-300 tracking-[0.2em] uppercase">
                    Экономический эффект
                  </span>
                </span>
                <p className="text-[14px] md:text-[16px] font-black text-white leading-tight">
                  {slide.impactGoal}
                </p>
              </div>

              <div className="relative space-y-1">
                {slide.impacts.map((it) => (
                  <div
                    key={it.label}
                    className="relative rounded-xl px-2.5 py-1 flex items-center gap-2 overflow-hidden"
                    style={{
                      background: 'rgba(255,255,255,0.09)',
                      border: '1px solid rgba(255,255,255,0.14)',
                    }}
                  >
                    <Icon name={it.icon ?? 'Coins'} size={14} className="text-cyan-300 flex-shrink-0" />
                    <p className="text-[10px] md:text-[11px] text-white/60 leading-snug flex-1 min-w-0">
                      {it.label}
                    </p>
                    <p
                      className="text-[14px] md:text-[16px] font-black leading-none tracking-tight whitespace-nowrap"
                      style={{
                        background: 'linear-gradient(90deg, #a7f3d0 0%, #67e8f9 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}
                    >
                      {it.value}
                    </p>
                  </div>
                ))}
              </div>

              {slide.conclusion && (
                <div className="relative mt-auto flex items-center gap-1.5">
                  <Icon name="ShieldCheck" size={12} className="text-cyan-300 flex-shrink-0" />
                  <p className="text-[10px] md:text-[11px] text-white/55 leading-snug">
                    {slide.conclusion}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Целевые показатели */}
        {slide.kpis && slide.kpis.length > 0 && (
          <div
            className="w-full max-w-[1080px] mx-auto mt-3 md:mt-5 pt-1 org-in"
            style={{ animationDelay: `${300 + goals.length * 110}ms` }}
          >
            <div className="flex items-center gap-2.5 mb-2">
              <span className="h-px flex-1 bg-gradient-to-r from-transparent to-violet-200" />
              <p className="text-[9px] md:text-[10px] font-bold text-violet-500 tracking-[0.22em] uppercase whitespace-nowrap">
                {slide.kpiTitle ?? 'Целевые показатели'}
              </p>
              <span className="h-px flex-1 bg-gradient-to-l from-transparent to-violet-200" />
            </div>

            <div className="grid grid-cols-4 md:grid-cols-8 gap-1.5 md:gap-2">
              {slide.kpis.map((k, ki) => {
                const pct = Math.max(0, Math.min(100, k.progress ?? 100));
                const r = 20;
                const c = 2 * Math.PI * r;
                return (
                  <div
                    key={k.label}
                    className="rounded-2xl bg-white/85 border border-violet-100 px-1 py-2 flex flex-col items-center gap-1.5"
                    style={{ boxShadow: '0 3px 12px rgba(124,58,237,0.08)' }}
                  >
                    <div className="relative w-[58px] h-[58px]">
                      <svg viewBox="0 0 48 48" className="w-full h-full -rotate-90">
                        <defs>
                          <linearGradient id={`kpiG${ki}`} x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#7c3aed" />
                            <stop offset="100%" stopColor="#ec4899" />
                          </linearGradient>
                        </defs>
                        <circle cx="24" cy="24" r={r} fill="none" stroke="#ede9fe" strokeWidth="5" />
                        <circle
                          cx="24"
                          cy="24"
                          r={r}
                          fill="none"
                          stroke={`url(#kpiG${ki})`}
                          strokeWidth="5"
                          strokeLinecap="round"
                          strokeDasharray={c}
                          strokeDashoffset={c - (c * pct) / 100}
                          style={{ transition: 'stroke-dashoffset 1.2s ease' }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-[15px] font-black text-violet-700 leading-none">
                          {k.value}
                        </span>
                        {k.note && (
                          <span className="text-[8px] font-bold text-slate-400 leading-none mt-0.5">
                            {k.note}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-[9px] md:text-[10px] text-slate-500 leading-tight text-center font-semibold px-0.5">
                      {k.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalsSlide;