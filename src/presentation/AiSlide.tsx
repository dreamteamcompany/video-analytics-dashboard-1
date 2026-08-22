import { Slide, AiStep, AiMetric } from './slides';
import Icon from '@/components/ui/icon';

const HEADER_GRADIENT = 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 60%, #5b21b6 100%)';
const STEP_GRADIENT = 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 55%, #ec4899 100%)';

const DocCard = ({ doc }: { doc: NonNullable<Slide['aiDoc']> }) => (
  <div
    className="relative min-h-0 flex flex-col rounded-2xl bg-white px-4 py-3.5 org-drop overflow-hidden"
    style={{ boxShadow: '0 14px 40px rgba(15,23,42,0.12)', animationDelay: '140ms' }}
  >
    <span className="absolute left-0 top-0 bottom-0 w-1.5" style={{ background: 'linear-gradient(180deg,#f97316,#ef4444)' }} />

    <div className="flex items-start gap-2.5 flex-shrink-0 pb-2.5 border-b border-slate-100">
      <div className="w-9 h-9 md:w-11 md:h-11 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
        <Icon name="FileText" size={21} className="text-slate-500" />
      </div>
      <div className="min-w-0">
        <p className="text-[14px] md:text-[clamp(14px,2.1vh,19px)] font-black text-slate-800 leading-tight">
          {doc.title}
        </p>
        {doc.subtitle && (
          <p className="text-[10.5px] md:text-[clamp(10.5px,1.45vh,13px)] text-slate-400 leading-snug mt-0.5">
            {doc.subtitle}
          </p>
        )}
      </div>
    </div>

    <div className="flex-1 min-h-0 flex flex-col gap-1.5 md:gap-2 py-2.5">
      {doc.lines.map((l, i) => (
        <div
          key={l.text}
          className={`org-in flex-1 min-h-0 flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 md:py-2 ${
            l.bad ? 'bg-rose-50 border border-rose-200' : 'bg-slate-50 border border-slate-100'
          }`}
          style={{ animationDelay: `${240 + i * 70}ms` }}
        >
          <Icon
            name={l.bad ? 'CircleAlert' : 'Check'}
            size={16}
            className={`flex-shrink-0 ${l.bad ? 'text-rose-500' : 'text-emerald-500'}`}
          />
          <p
            className={`min-w-0 flex-1 text-[11.5px] md:text-[clamp(11.5px,1.7vh,15px)] leading-snug ${
              l.bad ? 'font-semibold text-rose-700' : 'text-slate-500'
            } ${l.empty ? 'italic' : ''}`}
          >
            {l.text}
          </p>
          {l.badge && (
            <span className="flex-shrink-0 rounded-md bg-rose-500 px-2 py-0.5 text-[9px] md:text-[11px] font-bold text-white uppercase tracking-wide">
              {l.badge}
            </span>
          )}
        </div>
      ))}
    </div>

    {doc.alert && (
      <div className="flex-shrink-0 flex items-center gap-2.5 rounded-xl bg-orange-50 border border-orange-200 px-3 py-2">
        <Icon name="TriangleAlert" size={18} className="text-orange-600 flex-shrink-0" />
        <p className="text-[11px] md:text-[clamp(11px,1.6vh,14px)] font-bold text-orange-700 leading-snug">
          {doc.alert}
        </p>
      </div>
    )}
  </div>
);

const StepRow = ({ item, index, last }: { item: AiStep; index: number; last: boolean }) => (
  <div className="relative flex-1 min-h-0 flex items-center gap-3 pl-1">
    {!last && (
      <span
        className="absolute left-[22px] md:left-[27px] top-[calc(50%+28px)] bottom-0 w-[2px] -translate-x-1/2 rounded-full"
        style={{ background: 'linear-gradient(180deg,#ddd6fe,rgba(221,214,254,0.1))' }}
      />
    )}
    <div
      className="relative z-10 flex-shrink-0 w-11 h-11 md:w-[54px] md:h-[54px] rounded-2xl flex items-center justify-center org-in"
      style={{ background: STEP_GRADIENT, boxShadow: '0 8px 20px rgba(124,58,237,0.32)', animationDelay: `${300 + index * 110}ms` }}
    >
      <Icon name={item.icon ?? 'Sparkles'} size={24} className="text-white" />
    </div>
    <div className="min-w-0 org-in" style={{ animationDelay: `${340 + index * 110}ms` }}>
      <p className="text-[14px] md:text-[clamp(14px,2.2vh,20px)] font-black text-[#1e1b4b] leading-tight">
        {item.title}
      </p>
      {item.text && (
        <p className="text-[11.5px] md:text-[clamp(11.5px,1.65vh,15px)] text-slate-500 leading-snug mt-0.5">
          {item.text}
        </p>
      )}
    </div>
  </div>
);

const MetricItem = ({ item, index }: { item: AiMetric; index: number }) => (
  <div
    className="flex items-center gap-2.5 px-3 py-1.5 org-in"
    style={{ animationDelay: `${620 + index * 70}ms` }}
  >
    <Icon name={item.icon ?? 'TrendingUp'} size={20} className="text-violet-500 flex-shrink-0" />
    <div className="min-w-0">
      <p className="text-[17px] md:text-[clamp(17px,2.7vh,26px)] font-black text-violet-600 leading-none">
        {item.value}
      </p>
      <p className="text-[10.5px] md:text-[clamp(10.5px,1.5vh,13.5px)] font-semibold text-slate-500 leading-tight mt-0.5">
        {item.label}
      </p>
    </div>
  </div>
);

const AiSlide = ({ slide }: { slide: Slide }) => {
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

      <div className="relative z-10 flex-1 flex flex-col px-3 sm:px-6 lg:px-10 pt-3 pb-3 min-h-0 overflow-y-auto md:overflow-hidden">
        <div className="w-full max-w-[1400px] mx-auto flex flex-col flex-1 min-h-0">
          <div className="flex-shrink-0 flex flex-col items-center gap-1.5 mb-3">
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
                <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] md:text-[13px] font-bold bg-white border border-violet-200 text-violet-700">
                  <Icon name="Sparkles" size={14} className="flex-shrink-0" />
                  {slide.aiTag}
                </span>
              )}
            </div>
            <h2 className="text-2xl md:text-[40px] font-black leading-tight tracking-tight text-center text-[#1e1b4b]">
              {slide.title}
            </h2>
            {slide.subtitle && (
              <p className="text-[13px] md:text-[17px] font-semibold leading-snug max-w-[900px] text-center text-slate-500">
                {slide.subtitle}
              </p>
            )}
          </div>

          <div className="flex-1 min-h-0 grid gap-3 md:gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
            {slide.aiDoc && <DocCard doc={slide.aiDoc} />}

            <div className="min-h-0 flex flex-col">
              {slide.aiSolutionTitle && (
                <p className="flex-shrink-0 text-[11px] md:text-[13px] font-black uppercase tracking-[0.15em] text-violet-500 mb-2">
                  {slide.aiSolutionTitle}
                </p>
              )}
              <div className="flex-1 min-h-0 flex flex-col gap-1.5">
                {steps.map((s, i) => (
                  <StepRow key={s.title} item={s} index={i} last={i === steps.length - 1} />
                ))}
              </div>
            </div>
          </div>

          <div className="flex-shrink-0 mt-3 flex flex-col lg:flex-row gap-2.5">
            {metrics.length > 0 && (
              <div
                className="flex-1 rounded-2xl bg-white/90 border border-violet-100 flex flex-wrap items-center justify-around gap-1 py-1.5 org-in"
                style={{ boxShadow: '0 6px 18px rgba(124,58,237,0.08)', animationDelay: '600ms' }}
              >
                {metrics.map((m, i) => (
                  <MetricItem key={m.label} item={m} index={i} />
                ))}
              </div>
            )}

            {slide.aiHighlight && (
              <div
                className="lg:max-w-[420px] rounded-2xl px-4 py-2.5 flex items-center gap-3 org-in"
                style={{
                  background: 'linear-gradient(135deg, #059669 0%, #10b981 55%, #14b8a6 100%)',
                  boxShadow: '0 10px 26px rgba(16,185,129,0.3)',
                  animationDelay: '760ms',
                }}
              >
                <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <Icon name={slide.aiHighlight.icon ?? 'ShieldCheck'} size={22} className="text-white" />
                </div>
                <div className="min-w-0">
                  {slide.aiHighlight.label && (
                    <p className="text-[9.5px] md:text-[11px] font-black uppercase tracking-wider text-white/75">
                      {slide.aiHighlight.label}
                    </p>
                  )}
                  <p className="text-[12.5px] md:text-[15px] font-black text-white leading-snug">
                    {slide.aiHighlight.title}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiSlide;
