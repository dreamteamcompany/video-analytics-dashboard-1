import { Slide, AiPoint, AiStep, AiMetric } from './slides';
import Icon from '@/components/ui/icon';

const HEADER_GRADIENT = 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 60%, #5b21b6 100%)';
const STEP_GRADIENT = 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 55%, #ec4899 100%)';
const HIGHLIGHT_GRADIENT = 'linear-gradient(135deg, #059669 0%, #10b981 55%, #14b8a6 100%)';

const ProblemCard = ({ item, index }: { item: AiPoint; index: number }) => (
  <div
    className="flex-1 min-h-0 flex items-start gap-2.5 rounded-xl bg-white/95 border border-orange-100 px-3 py-2 org-in"
    style={{ boxShadow: '0 4px 14px rgba(249,115,22,0.1)', animationDelay: `${160 + index * 70}ms` }}
  >
    <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-lg bg-orange-100 flex items-center justify-center">
      <Icon name={item.icon ?? 'TriangleAlert'} size={19} className="text-orange-600" />
    </div>
    <div className="min-w-0">
      <p className="text-[12.5px] md:text-[clamp(12.5px,1.9vh,16px)] font-bold text-slate-800 leading-snug">
        {item.title}
      </p>
      {item.note && (
        <p className="text-[10.5px] md:text-[clamp(10.5px,1.5vh,13px)] text-slate-500 leading-snug mt-0.5">
          {item.note}
        </p>
      )}
    </div>
  </div>
);

const StepCard = ({ item, index }: { item: AiStep; index: number }) => (
  <div
    className="flex-1 min-h-0 flex items-start gap-2.5 rounded-xl bg-white/95 border border-violet-100 px-3 py-2 org-in"
    style={{ boxShadow: '0 4px 14px rgba(124,58,237,0.1)', animationDelay: `${240 + index * 70}ms` }}
  >
    <div
      className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center"
      style={{ background: STEP_GRADIENT, boxShadow: '0 5px 14px rgba(124,58,237,0.28)' }}
    >
      <Icon name={item.icon ?? 'Sparkles'} size={19} className="text-white" />
    </div>
    <div className="min-w-0">
      <p className="text-[12.5px] md:text-[clamp(12.5px,1.9vh,16px)] font-bold text-slate-800 leading-snug">
        {item.title}
      </p>
      {item.text && (
        <p className="text-[10.5px] md:text-[clamp(10.5px,1.5vh,13px)] text-slate-500 leading-snug mt-0.5">
          {item.text}
        </p>
      )}
    </div>
  </div>
);

const MetricCard = ({ item, index }: { item: AiMetric; index: number }) => (
  <div
    className="rounded-xl bg-white/95 border border-violet-100 px-3 py-2 flex items-center gap-2.5 org-in"
    style={{ boxShadow: '0 4px 14px rgba(124,58,237,0.08)', animationDelay: `${520 + index * 70}ms` }}
  >
    <div className="flex-shrink-0 w-9 h-9 md:w-11 md:h-11 rounded-lg bg-violet-50 flex items-center justify-center">
      <Icon name={item.icon ?? 'TrendingUp'} size={20} className="text-violet-600" />
    </div>
    <div className="min-w-0">
      <p className="text-[16px] md:text-[clamp(16px,2.6vh,24px)] font-black text-violet-600 leading-none">
        {item.value}
      </p>
      <p className="text-[11px] md:text-[clamp(11px,1.6vh,14px)] font-bold text-slate-700 leading-tight mt-0.5">
        {item.label}
      </p>
      {item.note && (
        <p className="text-[9.5px] md:text-[clamp(9.5px,1.35vh,12px)] text-slate-400 leading-snug mt-0.5">
          {item.note}
        </p>
      )}
    </div>
  </div>
);

const AiSlide = ({ slide }: { slide: Slide }) => {
  const problems = slide.aiProblems ?? [];
  const steps = slide.aiSteps ?? [];
  const metrics = slide.aiMetrics ?? [];

  return (
    <div
      className="h-full flex flex-col overflow-hidden relative"
      style={{ background: 'linear-gradient(135deg, #ffffff 0%, #faf8ff 45%, #f3edfd 75%, #fdf0f7 100%)' }}
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(124,58,237,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.05) 1px, transparent 1px)',
            backgroundSize: '46px 46px',
            maskImage: 'radial-gradient(ellipse at 50% 45%, #000 20%, transparent 76%)',
            WebkitMaskImage: 'radial-gradient(ellipse at 50% 45%, #000 20%, transparent 76%)',
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

      <div className="relative z-10 flex-1 flex flex-col px-3 sm:px-6 lg:px-8 pt-3 pb-3 min-h-0 overflow-y-auto md:overflow-hidden">
        <div className="w-full max-w-[1400px] mx-auto flex flex-col flex-1 min-h-0">
          <div className="flex-shrink-0 flex flex-col items-center gap-1.5 mb-2.5">
            <div className="flex flex-wrap items-center justify-center gap-2">
              {slide.badge && (
                <span
                  className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-white text-[12px] md:text-[14px] font-semibold"
                  style={{ background: HEADER_GRADIENT, boxShadow: '0 6px 18px rgba(124,58,237,0.32)' }}
                >
                  <Icon name={slide.badgeIcon ?? 'BrainCircuit'} size={16} className="flex-shrink-0" />
                  {slide.badge}
                </span>
              )}
              {slide.aiTag && (
                <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] md:text-[13px] font-bold bg-violet-50 border border-violet-200 text-violet-700">
                  <Icon name="Sparkles" size={14} className="flex-shrink-0" />
                  {slide.aiTag}
                </span>
              )}
            </div>
            <h2 className="text-2xl md:text-[36px] font-black leading-tight tracking-tight text-center text-[#1e1b4b]">
              {slide.title}
            </h2>
            {slide.subtitle && (
              <p className="text-[13px] md:text-[17px] font-semibold leading-snug max-w-[980px] text-center text-slate-500">
                {slide.subtitle}
              </p>
            )}
          </div>

          <div className="flex-1 min-h-0 grid gap-2.5 md:gap-3 lg:grid-cols-2">
            <div
              className="min-h-0 flex flex-col rounded-2xl px-3 py-2.5 org-drop"
              style={{ background: 'linear-gradient(125deg,#fff7ed 0%,#ffedd5 100%)', animationDelay: '120ms' }}
            >
              <div className="flex items-center gap-2 mb-2 flex-shrink-0">
                <Icon name="TriangleAlert" size={17} className="text-orange-600 flex-shrink-0" />
                <p className="text-[11px] md:text-[13.5px] font-black uppercase tracking-wider text-orange-700">
                  {slide.aiProblemTitle ?? 'Что происходит сейчас'}
                </p>
              </div>
              <div className="flex-1 min-h-0 flex flex-col gap-2">
                {problems.map((p, i) => (
                  <ProblemCard key={p.title} item={p} index={i} />
                ))}
              </div>
            </div>

            <div
              className="min-h-0 flex flex-col rounded-2xl px-3 py-2.5 org-drop"
              style={{ background: 'linear-gradient(125deg,#f5f3ff 0%,#ede9fe 100%)', animationDelay: '200ms' }}
            >
              <div className="flex items-center gap-2 mb-2 flex-shrink-0">
                <Icon name="BrainCircuit" size={17} className="text-violet-600 flex-shrink-0" />
                <p className="text-[11px] md:text-[13.5px] font-black uppercase tracking-wider text-violet-700">
                  {slide.aiSolutionTitle ?? 'Как работает ИИ'}
                </p>
              </div>
              <div className="flex-1 min-h-0 flex flex-col gap-2">
                {steps.map((s, i) => (
                  <StepCard key={s.title} item={s} index={i} />
                ))}
              </div>
            </div>
          </div>

          {metrics.length > 0 && (
            <div className="flex-shrink-0 mt-2.5 grid gap-2 grid-cols-2 lg:grid-cols-4">
              {metrics.map((m, i) => (
                <MetricCard key={m.label} item={m} index={i} />
              ))}
            </div>
          )}

          {slide.aiHighlight && (
            <div
              className="flex-shrink-0 mt-2.5 rounded-2xl px-4 py-2.5 flex items-center gap-3 org-in"
              style={{ background: HIGHLIGHT_GRADIENT, boxShadow: '0 8px 22px rgba(16,185,129,0.28)', animationDelay: '760ms' }}
            >
              <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <Icon name={slide.aiHighlight.icon ?? 'ShieldCheck'} size={22} className="text-white" />
              </div>
              <div className="min-w-0">
                {slide.aiHighlight.label && (
                  <p className="text-[10px] md:text-[12px] font-black uppercase tracking-wider text-white/75">
                    {slide.aiHighlight.label}
                  </p>
                )}
                <p className="text-[13px] md:text-[17px] font-black text-white leading-snug">
                  {slide.aiHighlight.title}
                </p>
                {slide.aiHighlight.note && (
                  <p className="text-[11px] md:text-[13.5px] text-white/85 leading-snug mt-0.5">
                    {slide.aiHighlight.note}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiSlide;
