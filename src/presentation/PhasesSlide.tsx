import { Slide, PhaseItem } from './slides';
import Icon from '@/components/ui/icon';

const HEADER_GRADIENT = 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 60%, #5b21b6 100%)';
const STAGE_TWO_GRADIENT = 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)';

const PhaseCard = ({ phase, index }: { phase: PhaseItem; index: number }) => {
  const gradient = index === 0 ? HEADER_GRADIENT : STAGE_TWO_GRADIENT;

  return (
    <div
      className="relative flex flex-col min-h-0 rounded-2xl bg-white/95 border border-violet-100 px-4 py-3.5 org-in transition-shadow hover:shadow-lg"
      style={{ boxShadow: '0 6px 20px rgba(124,58,237,0.1)', animationDelay: `${140 + index * 120}ms` }}
    >
      <div className="flex items-center gap-3 flex-shrink-0">
        <div
          className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center"
          style={{ background: gradient, boxShadow: '0 6px 16px rgba(124,58,237,0.3)' }}
        >
          <Icon name={phase.icon ?? 'Target'} size={26} className="text-white" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span
              className="inline-flex items-center rounded-full px-2.5 py-0.5 text-white text-[10.5px] md:text-[12px] font-bold"
              style={{ background: gradient }}
            >
              {phase.stage}
            </span>
            <span className="text-[10.5px] md:text-[12.5px] font-semibold text-slate-400">
              {phase.period}
            </span>
          </div>
          <p className="text-[14px] md:text-[clamp(14px,2.2vh,21px)] font-black text-[#1e1b4b] leading-tight mt-1">
            {phase.title}
          </p>
        </div>
      </div>

      <p className="text-[11.5px] md:text-[clamp(11.5px,1.55vh,14.5px)] text-slate-500 leading-snug mt-2.5 flex-shrink-0">
        {phase.summary}
      </p>

      <div className="flex-1 min-h-0 flex flex-col gap-1.5 mt-2.5">
        {phase.points.map((p, i) => (
          <div
            key={p.text}
            className="flex items-center gap-2.5 rounded-xl bg-violet-50/60 border border-violet-100 px-2.5 py-2"
          >
            <div
              className="flex-shrink-0 w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#ede9fe,#fae8ff)' }}
            >
              <Icon name={p.icon ?? 'Check'} size={16} className="text-violet-600" />
            </div>
            <p className="text-[11.5px] md:text-[clamp(11.5px,1.6vh,15px)] font-semibold text-slate-700 leading-snug">
              {p.text}
            </p>
          </div>
        ))}
      </div>

      {phase.outcome && (
        <div className="flex-shrink-0 mt-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100 px-3 py-2">
          <p className="text-[11px] md:text-[clamp(11px,1.5vh,14px)] text-slate-600 leading-snug">
            <span className="font-black text-emerald-600">Результат: </span>
            {phase.outcome}
          </p>
        </div>
      )}
    </div>
  );
};

const PhasesSlide = ({ slide }: { slide: Slide }) => {
  const phases = slide.phases ?? [];

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
          <div className="flex-shrink-0 flex flex-col items-center gap-2 mb-3">
            {slide.badge && (
              <span
                className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-white text-[12px] md:text-[14px] font-semibold"
                style={{ background: HEADER_GRADIENT, boxShadow: '0 6px 18px rgba(124,58,237,0.32)' }}
              >
                <Icon name={slide.badgeIcon ?? 'Route'} size={16} className="flex-shrink-0" />
                {slide.badge}
              </span>
            )}
            <h2 className="text-2xl md:text-[40px] font-black leading-tight tracking-tight text-center text-[#1e1b4b]">
              {slide.title}
            </h2>
            {slide.subtitle && (
              <p className="text-[12.5px] md:text-[15px] text-slate-500 leading-snug max-w-[860px] text-center">
                {slide.subtitle}
              </p>
            )}
          </div>

          <div className="flex-1 min-h-0 grid gap-3 md:grid-cols-2">
            {phases.map((p, i) => (
              <PhaseCard key={p.stage} phase={p} index={i} />
            ))}
          </div>

          {slide.phasesFooter && (
            <div
              className="flex-shrink-0 mt-3 rounded-xl px-4 py-2.5 text-center text-white text-[12px] md:text-[15px] font-semibold org-in"
              style={{ background: HEADER_GRADIENT, boxShadow: '0 8px 22px rgba(124,58,237,0.28)', animationDelay: '600ms' }}
            >
              {slide.phasesFooter}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhasesSlide;
