import { Slide, Goal } from './slides';
import Icon from '@/components/ui/icon';

const HEADER_GRADIENT = 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 60%, #5b21b6 100%)';
const VALUE_GRADIENT = 'linear-gradient(120deg, #7c3aed 0%, #6366f1 45%, #ec4899 100%)';
const VALUE_LABEL_GRADIENT = 'linear-gradient(90deg, #059669 0%, #10b981 55%, #14b8a6 100%)';

const GoalCard = ({ goal, index }: { goal: Goal; index: number }) => (
  <div
    className="goal-row group relative flex-1 min-h-0 overflow-hidden flex flex-col justify-center gap-2 rounded-xl bg-white/95 border border-violet-100 px-3 py-2.5 org-in cursor-pointer transition-shadow hover:shadow-lg"
    style={{ boxShadow: '0 4px 14px rgba(124,58,237,0.08)', animationDelay: `${120 + index * 60}ms` }}
  >
    <div className="flex items-center gap-2.5">
      <span className="flex-shrink-0 w-5 text-center text-[18px] md:text-[22px] font-black text-violet-500 leading-none">
        {index + 1}
      </span>

      <div
        className="flex-shrink-0 w-10 h-10 md:w-[46px] md:h-[46px] rounded-xl flex items-center justify-center"
        style={{ background: HEADER_GRADIENT, boxShadow: '0 5px 14px rgba(124,58,237,0.3)' }}
      >
        <Icon name={goal.icon ?? 'Target'} size={22} className="text-white" />
      </div>

      <p className="min-w-0 flex-1 text-[13px] md:text-[clamp(13px,1.9vh,20px)] font-bold text-slate-800 leading-tight line-clamp-2">
        {goal.title}
      </p>

      {goal.metric && (
        <div className="flex-shrink-0 text-center w-[92px] md:w-[132px]">
          <p
            className="text-[19px] md:text-[clamp(19px,3.2vh,32px)] font-black leading-none tracking-tight"
            style={{
              background: VALUE_GRADIENT,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {goal.metric}
          </p>
          {goal.metricNote && (
            <p className="text-[9px] md:text-[clamp(9px,1.25vh,12.5px)] font-semibold text-slate-400 leading-tight mt-1">
              {goal.metricNote}
            </p>
          )}
        </div>
      )}
    </div>

    {(goal.effect || goal.result) && (
      <div className="rounded-lg bg-emerald-50/70 border border-emerald-100 px-3 py-2 text-[12px] md:text-[clamp(12px,1.85vh,19px)] leading-snug text-slate-600 line-clamp-2">
        <span
          className="font-black"
          style={{
            background: VALUE_LABEL_GRADIENT,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Ценность для бизнеса:
        </span>{' '}
        {goal.effect ?? goal.result}
      </div>
    )}

    {goal.text && (
      <>
        <span className="absolute top-1.5 right-1.5 opacity-40 group-hover:opacity-0 transition-opacity">
          <Icon name="Info" size={13} className="text-violet-400" />
        </span>
        <div
          className="absolute inset-0 overflow-hidden flex flex-col justify-center gap-2 px-4 py-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 pointer-events-none"
          style={{ background: 'linear-gradient(135deg, #4c1d95 0%, #6d28d9 55%, #7c3aed 100%)' }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="flex-shrink-0 w-9 h-9 md:w-[42px] md:h-[42px] rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.16)', border: '1px solid rgba(255,255,255,0.25)' }}
            >
              <Icon name={goal.icon ?? 'Target'} size={20} className="text-white" />
            </div>
            <p className="min-w-0 flex-1 text-[12px] md:text-[clamp(12px,1.75vh,18px)] font-black text-white leading-tight line-clamp-2">
              {goal.title}
            </p>
          </div>
          <p className="text-[11px] md:text-[clamp(11px,1.6vh,16.5px)] text-white/90 leading-snug">
            {goal.text}
          </p>
        </div>
      </>
    )}
  </div>
);

const GoalsSlide = ({ slide }: { slide: Slide }) => {
  const goals = slide.goals ?? [];
  const impacts = slide.impacts ?? [];
  const kpis = slide.kpis ?? [];
  const flow = slide.flow ?? [];
  const half = Math.ceil(goals.length / 2);
  const left = goals.slice(0, half);
  const right = goals.slice(half);

  const titleParts = (slide.title ?? '').split(/(\d{4})/);

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

      <div className="relative z-10 flex-1 flex flex-col px-3 sm:px-6 lg:px-8 pt-4 pb-4 min-h-0 overflow-y-auto md:overflow-hidden">
        <div className="w-full max-w-[1400px] mx-auto flex flex-col flex-1 min-h-0">
          {/* Шапка */}
          <div className="flex-shrink-0 flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-3">
            <div className="flex flex-col items-center md:items-start gap-2">
              {slide.badge && (
                <span
                  className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-white text-[12px] md:text-[14px] font-semibold"
                  style={{ background: HEADER_GRADIENT, boxShadow: '0 6px 18px rgba(124,58,237,0.32)' }}
                >
                  <Icon name={slide.badgeIcon ?? 'Target'} size={16} className="flex-shrink-0" />
                  {slide.badge}
                </span>
              )}
              <h2 className="text-3xl md:text-[38px] font-black leading-none tracking-tight text-center md:text-left text-[#1e1b4b]">
                {titleParts.map((part, i) =>
                  /^\d{4}$/.test(part) ? (
                    <span
                      key={i}
                      style={{
                        background: VALUE_GRADIENT,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}
                    >
                      {part}
                    </span>
                  ) : (
                    <span key={i}>{part}</span>
                  ),
                )}
              </h2>
              {slide.subtitle && (
                <p className="text-[12px] md:text-[13.5px] text-slate-500 leading-snug max-w-[480px] text-center md:text-left">
                  {slide.subtitle}
                </p>
              )}
            </div>

            <div className="hidden md:flex items-center gap-4">
              {slide.goalsYear && (
                <span
                  className="text-[44px] font-black leading-none tracking-tight"
                  style={{
                    background: VALUE_GRADIENT,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {slide.goalsYear}
                </span>
              )}
              {slide.goalsImage && (
                <img src={slide.goalsImage} alt="" className="h-[78px] w-[78px] object-contain rounded-2xl" />
              )}
            </div>
          </div>

          {/* Основная сетка */}
          <div className="flex-none md:flex-1 md:min-h-0 grid gap-2.5 md:grid-cols-[1fr_1fr_0.62fr]">
            <div className="flex flex-col gap-1.5 md:min-h-0 md:overflow-hidden">
              {left.map((g, i) => (
                <GoalCard key={g.title} goal={g} index={i} />
              ))}
            </div>
            <div className="flex flex-col gap-1.5 md:min-h-0 md:overflow-hidden">
              {right.map((g, i) => (
                <GoalCard key={g.title} goal={g} index={half + i} />
              ))}
            </div>

            <div className="flex flex-col gap-2.5 md:min-h-0 md:overflow-hidden">
              {impacts.length > 0 && (
                <div
                  className="relative flex-shrink-0 rounded-2xl px-3.5 py-2.5 overflow-hidden org-in"
                  style={{
                    background: 'linear-gradient(155deg, #2e1065 0%, #5b21b6 45%, #1e1b4b 100%)',
                    boxShadow: '0 18px 42px rgba(46,16,101,0.42)',
                  }}
                >
                  <div
                    className="aurora-a absolute -top-20 -right-16 w-56 h-56 rounded-full pointer-events-none"
                    style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.4) 0%, transparent 68%)' }}
                  />
                  <div className="relative">
                    <span className="inline-flex items-center gap-1.5">
                      <Icon name="TrendingUp" size={14} className="text-emerald-300" />
                      <span className="text-[10px] md:text-[clamp(10px,1.25vh,12.5px)] font-bold text-emerald-300 tracking-[0.14em] uppercase">
                        Экономический эффект
                      </span>
                    </span>
                    {slide.impactGoal && (
                      <p className="text-[15px] md:text-[clamp(15px,1.95vh,19.5px)] font-black text-white leading-tight mt-1.5">
                        {slide.impactGoal}
                      </p>
                    )}
                  </div>

                  <div className="relative mt-2 space-y-1">
                    {impacts.map((it) => (
                      <div
                        key={it.label}
                        className="flex items-start gap-2 rounded-lg px-2.5 py-1.5"
                        style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)' }}
                      >
                        <Icon name={it.icon ?? 'Coins'} size={16} className="text-emerald-300 flex-shrink-0" />
                        <p className="text-[11px] md:text-[clamp(11px,1.4vh,14px)] font-semibold text-white/90 leading-snug flex-1 min-w-0">
                          {it.label}
                        </p>
                        {it.value && (
                          <p
                            className="text-[14px] md:text-[clamp(14px,1.9vh,19px)] font-black leading-none whitespace-nowrap"
                            style={{
                              background: 'linear-gradient(90deg, #6ee7b7 0%, #34d399 55%, #5eead4 100%)',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                              backgroundClip: 'text',
                            }}
                          >
                            {it.value}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {kpis.length > 0 && (
                <div
                  className="relative flex-1 overflow-hidden rounded-2xl bg-white/95 border border-violet-100 px-3.5 py-2.5 org-in md:min-h-0 flex flex-col"
                  style={{ boxShadow: '0 4px 16px rgba(124,58,237,0.07)' }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon name="Gauge" size={14} className="text-violet-500 flex-shrink-0" />
                    <p className="text-[10px] md:text-[clamp(10px,1.3vh,13px)] font-bold text-violet-500 tracking-[0.12em] uppercase">
                      {slide.kpiTitle ?? 'Целевые показатели'}
                    </p>
                  </div>

                  <div className="flex-1 min-h-0 grid grid-cols-2 grid-rows-3 gap-1.5">
                    {kpis.map((k) => (
                      <div
                        key={k.label}
                        className="min-w-0 min-h-0 rounded-lg bg-violet-50/60 border border-violet-100 px-2.5 py-1 flex flex-col justify-center gap-0.5"
                      >
                        <div className="flex items-start gap-1 min-w-0">
                          <Icon name={k.icon ?? 'Check'} size={12} className="text-violet-400 flex-shrink-0 mt-[1px]" />
                          <span className="flex-1 min-w-0 text-[10px] md:text-[clamp(10px,1.2vh,12.5px)] text-slate-500 font-semibold leading-[1.15]">
                            {k.label}
                          </span>
                        </div>
                        <div className="flex items-baseline gap-0.5 leading-none">
                          <span className="text-[17px] md:text-[clamp(17px,2.2vh,23px)] font-black text-violet-700 leading-none">
                            {k.value}
                          </span>
                          {k.note && (
                            <span className="text-[10px] md:text-[clamp(10px,1.2vh,12.5px)] font-bold text-slate-400">{k.note}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Нижняя лента */}
          {flow.length > 0 && (
            <div
              className="flex-shrink-0 mt-3 rounded-2xl px-4 py-3 relative overflow-hidden org-in"
              style={{
                background: 'linear-gradient(100deg, #4c1d95 0%, #6d28d9 45%, #7c3aed 100%)',
                boxShadow: '0 14px 34px rgba(76,29,149,0.35)',
              }}
            >
              <div className="relative grid gap-3 md:grid-cols-3">
                {flow.map((f) => (
                  <div key={f.title} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-11 h-11 rounded-full bg-white/12 border border-white/25 flex items-center justify-center">
                      <Icon name={f.icon ?? 'Circle'} size={22} className="text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[12px] md:text-[clamp(12px,1.6vh,16px)] font-black text-white tracking-wide">{f.title}</p>
                      {f.lines.map((l) => (
                        <p key={l} className="text-[11px] md:text-[clamp(11px,1.5vh,15px)] text-white/85 leading-snug">
                          {l}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoalsSlide;