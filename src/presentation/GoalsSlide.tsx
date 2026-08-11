import { Slide } from './slides';
import Icon from '@/components/ui/icon';

const HEADER_GRADIENT = 'linear-gradient(90deg, #6d28d9 0%, #7c3aed 50%, #6366f1 100%)';
const VALUE_GRADIENT = 'linear-gradient(120deg, #7c3aed 0%, #6366f1 45%, #ec4899 100%)';

const GoalsSlide = ({ slide }: { slide: Slide }) => {
  const goals = slide.goals ?? [];
  const impacts = slide.impacts ?? [];
  const kpis = slide.kpis ?? [];
  const hasAside = impacts.length > 0 || kpis.length > 0;

  return (
    <div
      className="h-full flex flex-col overflow-hidden relative"
      style={{ background: 'linear-gradient(135deg, #ffffff 0%, #fafaff 45%, #f3edfd 75%, #fdf0f7 100%)' }}
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(124,58,237,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.05) 1px, transparent 1px)',
            backgroundSize: '46px 46px',
            maskImage: 'radial-gradient(ellipse at 50% 0%, #000 18%, transparent 76%)',
            WebkitMaskImage: 'radial-gradient(ellipse at 50% 0%, #000 18%, transparent 76%)',
          }}
        />
        <div
          className="aurora-a absolute -bottom-32 -left-24 w-[32rem] h-[32rem] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.2) 0%, transparent 68%)' }}
        />
        <div
          className="aurora-b absolute -top-32 right-[4%] w-[30rem] h-[30rem] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.14) 0%, transparent 68%)' }}
        />
      </div>

      <div className="relative z-10 flex-1 flex flex-col px-3 sm:px-8 lg:px-12 pt-4 sm:pt-5 pb-6 md:pb-5 min-h-0 overflow-y-auto md:overflow-hidden">
        {/* Заголовок */}
        <div className="flex-shrink-0 flex flex-col md:flex-row md:items-end md:justify-between gap-2 md:gap-6 mb-3 md:mb-4 max-w-[1180px] w-full mx-auto">
          <div className="flex flex-col items-center md:items-start gap-1.5">
            {slide.badge && (
              <span
                className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-white text-[12px] md:text-[13px] font-semibold"
                style={{ background: HEADER_GRADIENT, boxShadow: '0 6px 18px rgba(124,58,237,0.32)' }}
              >
                <Icon name={slide.badgeIcon ?? 'Target'} size={15} className="flex-shrink-0" />
                {slide.badge}
              </span>
            )}
            <h2
              className="text-2xl md:text-[34px] font-black leading-none tracking-tight text-center md:text-left"
              style={{
                background: 'linear-gradient(100deg, #1e1b4b 0%, #6d28d9 55%, #db2777 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {slide.title ?? 'Цели на год'}
            </h2>
          </div>

          {slide.goalsYear && (
            <div className="hidden md:flex items-center gap-3">
              <span className="h-px w-20 bg-gradient-to-r from-transparent to-violet-300" />
              <span
                className="text-[26px] font-black leading-none tracking-tight"
                style={{
                  background: VALUE_GRADIENT,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {slide.goalsYear}
              </span>
            </div>
          )}
        </div>

        {/* Основная сетка */}
        <div
          className={`w-full max-w-[1180px] mx-auto flex-none md:flex-1 md:min-h-0 grid gap-3 md:gap-4 ${
            hasAside ? 'md:grid-cols-[1.42fr_1fr]' : ''
          }`}
        >
          {/* Цели */}
          <div className="flex flex-col gap-2 md:gap-2.5 md:min-h-0">
            {goals.map((g, i) => (
              <div
                key={g.title}
                className="goal-row group relative flex-1 flex items-center gap-3 rounded-2xl bg-white/90 border border-violet-100/80 px-3 py-2.5 md:px-3.5 org-in overflow-hidden"
                style={{
                  boxShadow: '0 4px 16px rgba(124,58,237,0.07)',
                  animationDelay: `${150 + i * 90}ms`,
                }}
              >
                <span
                  className="absolute left-0 top-0 bottom-0 w-[3px]"
                  style={{ background: VALUE_GRADIENT }}
                />

                <div className="relative flex-shrink-0">
                  <div
                    className="w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center"
                    style={{ background: HEADER_GRADIENT, boxShadow: '0 5px 14px rgba(124,58,237,0.28)' }}
                  >
                    <Icon name={g.icon ?? 'Target'} size={20} className="text-white" />
                  </div>
                  <span className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-white border border-violet-200 flex items-center justify-center text-[10px] font-black text-violet-600">
                    {i + 1}
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-[13px] md:text-[14px] font-bold text-slate-800 leading-tight">
                    {g.title}
                  </p>
                  <p className="text-[10px] md:text-[11px] text-slate-400 leading-snug mt-0.5 line-clamp-2">
                    {g.text}
                  </p>
                  {(g.effect || g.result) && (
                    <span className="inline-flex items-center gap-1 mt-1 rounded-md bg-violet-50 px-1.5 py-0.5">
                      <Icon name="Check" size={10} className="text-violet-500 flex-shrink-0" />
                      <span className="text-[10px] md:text-[11px] font-bold text-violet-700 leading-none">
                        {g.effect ?? g.result}
                      </span>
                    </span>
                  )}
                </div>

                {g.metric && (
                  <div className="flex-shrink-0 text-right pl-1 w-[76px] md:w-[104px]">
                    <p
                      className="text-[20px] md:text-[24px] font-black leading-none tracking-tight"
                      style={{
                        background: VALUE_GRADIENT,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}
                    >
                      {g.metric}
                    </p>
                    {g.metricNote && (
                      <p className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-[0.06em] leading-tight mt-1">
                        {g.metricNote}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Правая панель */}
          {hasAside && (
            <div className="flex flex-col gap-3 md:min-h-0">
              {impacts.length > 0 && (
                <div
                  className="relative rounded-2xl px-3.5 py-3 overflow-hidden org-in"
                  style={{
                    background: 'linear-gradient(155deg, #2e1065 0%, #5b21b6 45%, #1e1b4b 100%)',
                    boxShadow: '0 18px 42px rgba(46,16,101,0.42)',
                    animationDelay: `${150 + goals.length * 90}ms`,
                  }}
                >
                  <div
                    className="aurora-a absolute -top-20 -right-16 w-56 h-56 rounded-full pointer-events-none"
                    style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.42) 0%, transparent 68%)' }}
                  />
                  <div className="relative">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-2.5 py-1">
                      <Icon name="TrendingUp" size={11} className="text-cyan-300" />
                      <span className="text-[9px] font-bold text-cyan-300 tracking-[0.18em] uppercase">
                        Экономический эффект
                      </span>
                    </span>
                    {slide.impactGoal && (
                      <p className="text-[13px] md:text-[15px] font-black text-white leading-tight mt-2">
                        {slide.impactGoal}
                      </p>
                    )}
                  </div>

                  <div className="relative mt-2.5 space-y-1">
                    {impacts.map((it) => (
                      <div
                        key={it.label}
                        className="flex items-center gap-2 rounded-lg px-2.5 py-1.5"
                        style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
                      >
                        <Icon name={it.icon ?? 'Coins'} size={13} className="text-cyan-300 flex-shrink-0" />
                        <p className="text-[10px] md:text-[11px] text-white/60 leading-snug flex-1 min-w-0">
                          {it.label}
                        </p>
                        <p
                          className="text-[13px] md:text-[15px] font-black leading-none whitespace-nowrap"
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
                </div>
              )}

              {kpis.length > 0 && (
                <div
                  className="relative flex-1 rounded-2xl bg-white/90 border border-violet-100/80 px-3.5 py-3 org-in md:min-h-0"
                  style={{
                    boxShadow: '0 4px 16px rgba(124,58,237,0.07)',
                    animationDelay: `${230 + goals.length * 90}ms`,
                  }}
                >
                  <div className="flex items-center gap-2 mb-2.5">
                    <Icon name="Gauge" size={14} className="text-violet-500 flex-shrink-0" />
                    <p className="text-[9px] md:text-[10px] font-bold text-violet-500 tracking-[0.18em] uppercase">
                      {slide.kpiTitle ?? 'Целевые показатели'}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-x-3.5 gap-y-2 md:gap-y-3 md:h-[calc(100%-2rem)] md:content-around">
                    {kpis.map((k) => {
                      const pct = Math.max(0, Math.min(100, k.progress ?? 100));
                      return (
                        <div key={k.label}>
                          <div className="flex items-baseline justify-between gap-1">
                            <span className="text-[10px] md:text-[11px] text-slate-500 font-medium leading-tight truncate">
                              {k.label}
                            </span>
                            <span className="text-[13px] md:text-[15px] font-black text-violet-700 leading-none whitespace-nowrap">
                              {k.value}
                              {k.note && (
                                <span className="text-[9px] font-bold text-slate-400 ml-0.5">{k.note}</span>
                              )}
                            </span>
                          </div>
                          <div className="mt-1.5 h-1 rounded-full bg-violet-100 overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${pct}%`, background: VALUE_GRADIENT }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {slide.conclusion && (
          <div className="w-full max-w-[1180px] mx-auto mt-3 flex items-center justify-center gap-2">
            <Icon name="ShieldCheck" size={13} className="text-violet-400 flex-shrink-0" />
            <p className="text-[10px] md:text-[11px] text-slate-400 leading-snug text-center">
              {slide.conclusion}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalsSlide;