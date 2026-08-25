import { Slide } from './slides';
import Icon from '@/components/ui/icon';

const HEADER_GRADIENT = 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 60%, #5b21b6 100%)';

const WAVE_GRADIENTS = [
  'linear-gradient(135deg,#7c3aed,#6d28d9)',
  'linear-gradient(135deg,#6366f1,#8b5cf6)',
  'linear-gradient(135deg,#8b5cf6,#a855f7)',
  'linear-gradient(135deg,#a855f7,#d946ef)',
  'linear-gradient(135deg,#d946ef,#ec4899)',
];

const RoadmapSlide = ({ slide }: { slide: Slide }) => {
  const waves = slide.roadmap ?? [];

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
        <div className="w-full max-w-[1600px] mx-auto flex flex-col flex-1 min-h-0">
          <div className="flex-shrink-0 flex flex-col items-center gap-1.5 mb-3">
            {slide.badge && (
              <span
                className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-white text-[12px] md:text-[14px] font-semibold"
                style={{ background: HEADER_GRADIENT, boxShadow: '0 6px 18px rgba(124,58,237,0.32)' }}
              >
                <Icon name={slide.badgeIcon ?? 'Route'} size={16} className="flex-shrink-0" />
                {slide.badge}
              </span>
            )}
            <h2 className="text-2xl md:text-[38px] font-black leading-tight tracking-tight text-center text-[#1e1b4b]">
              {slide.title}
            </h2>
            {slide.subtitle && (
              <p className="text-[12.5px] md:text-[15px] text-slate-500 leading-snug max-w-[900px] text-center">
                {slide.subtitle}
              </p>
            )}
          </div>

          <div className="flex-1 min-h-0 grid gap-2.5 md:gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
            {waves.map((w, i) => (
              <div
                key={w.period}
                className="relative flex flex-col min-h-0 rounded-2xl bg-white/95 border border-violet-100 px-3 py-3 org-in"
                style={{ boxShadow: '0 6px 20px rgba(124,58,237,0.1)', animationDelay: `${120 + i * 100}ms` }}
              >
                <div className="flex-shrink-0 flex items-center gap-2.5">
                  <div
                    className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center"
                    style={{ background: WAVE_GRADIENTS[i % WAVE_GRADIENTS.length], boxShadow: '0 6px 16px rgba(124,58,237,0.3)' }}
                  >
                    <Icon name={w.icon ?? 'Rocket'} size={22} className="text-white" />
                  </div>
                  <div className="min-w-0">
                    <span
                      className="inline-flex items-center rounded-full px-2 py-0.5 text-white text-[10px] md:text-[11px] font-bold"
                      style={{ background: WAVE_GRADIENTS[i % WAVE_GRADIENTS.length] }}
                    >
                      {w.period}
                    </span>
                    <p className="text-[13px] md:text-[15.5px] font-black text-[#1e1b4b] leading-tight mt-1">
                      {w.title}
                    </p>
                  </div>
                </div>

                <p className="flex-shrink-0 text-[11px] md:text-[12px] text-slate-500 leading-snug mt-2">
                  {w.summary}
                </p>

                <div className="flex-1 min-h-0 flex flex-col gap-1.5 mt-2.5">
                  {w.items.map((it) => (
                    <div
                      key={it}
                      className="flex items-start gap-2 rounded-lg bg-violet-50/70 border border-violet-100 px-2.5 py-1.5"
                    >
                      <Icon name="Check" size={13} className="text-violet-500 flex-shrink-0 mt-[3px]" />
                      <p className="text-[11px] md:text-[12.5px] font-semibold text-slate-700 leading-snug">
                        {it}
                      </p>
                    </div>
                  ))}
                </div>

                {w.outcome && (
                  <div
                    className="flex-shrink-0 mt-2 rounded-lg px-2.5 py-2"
                    style={{ background: 'linear-gradient(135deg,#059669,#10b981)', boxShadow: '0 6px 16px rgba(16,185,129,0.26)' }}
                  >
                    <p className="text-[10.5px] md:text-[12px] text-white leading-snug font-semibold">
                      <span className="font-black uppercase tracking-wide">Итог: </span>
                      {w.outcome}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {slide.roadmapFooter && (
            <div
              className="flex-shrink-0 mt-3 rounded-xl px-4 py-2.5 flex items-center justify-center gap-3 text-white text-[12.5px] md:text-[16px] font-bold org-in"
              style={{ background: HEADER_GRADIENT, boxShadow: '0 8px 22px rgba(124,58,237,0.3)', animationDelay: '640ms' }}
            >
              <div className="flex-shrink-0 w-8 h-8 md:w-9 md:h-9 rounded-lg bg-white/20 flex items-center justify-center">
                <Icon name="Flag" size={18} className="text-white" />
              </div>
              <span className="text-center">{slide.roadmapFooter}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoadmapSlide;
