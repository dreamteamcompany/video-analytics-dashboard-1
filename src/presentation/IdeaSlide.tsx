import { Slide } from './slides';
import Icon from '@/components/ui/icon';

const HEADER_GRADIENT = 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 60%, #5b21b6 100%)';

const IdeaSlide = ({ slide }: { slide: Slide }) => {
  const points = slide.ideaPoints ?? [];
  const flow = slide.ideaFlow ?? [];
  const numbered = points.some((p) => p.num);
  const cols = points.length > 5 ? 2 : 1;
  const groups = slide.ideaColumns ?? [];

  return (
    <div
      className="h-full flex flex-col overflow-hidden relative"
      style={{ background: 'linear-gradient(135deg, #ffffff 0%, #fbfaff 40%, #f4f0fd 72%, #fdf1f8 100%)' }}
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-10 -left-10 w-[26rem] h-[26rem] opacity-70"
          style={{
            backgroundImage: 'radial-gradient(rgba(139,92,246,0.32) 1.4px, transparent 1.4px)',
            backgroundSize: '15px 15px',
            maskImage: 'radial-gradient(circle at 30% 30%, #000 0%, transparent 68%)',
            WebkitMaskImage: 'radial-gradient(circle at 30% 30%, #000 0%, transparent 68%)',
          }}
        />
        <div
          className="absolute -bottom-28 -right-24 w-[30rem] h-[30rem] rounded-full"
          style={{
            background: 'repeating-radial-gradient(circle, rgba(236,72,153,0.16) 0 1.4px, transparent 1.4px 18px)',
            maskImage: 'radial-gradient(circle, #000 10%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(circle, #000 10%, transparent 70%)',
          }}
        />
      </div>

      <div className="relative z-10 flex-1 flex flex-col px-3 sm:px-8 lg:px-14 pt-3 pb-16 md:pb-4 min-h-0 overflow-y-auto md:overflow-hidden">
        <div className="w-full max-w-[1180px] mx-auto flex flex-col md:flex-1 md:min-h-0">
          <div className="flex-shrink-0 flex flex-col items-center gap-2 mb-3">
            <div className="flex items-center gap-2 flex-wrap justify-center">
              {slide.badge && (
                <span
                  className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-white text-[11.5px] md:text-[13.5px] font-bold"
                  style={{ background: HEADER_GRADIENT, boxShadow: '0 8px 22px rgba(124,58,237,0.35)' }}
                >
                  <Icon name={slide.badgeIcon ?? 'Sparkles'} size={15} className="flex-shrink-0" />
                  {slide.badge}
                </span>
              )}
              {slide.ideaTag && (
                <span className="inline-flex items-center rounded-full bg-white/80 border border-violet-100 px-3.5 py-1.5 text-[11px] md:text-[13px] font-bold text-violet-600">
                  {slide.ideaTag}
                </span>
              )}
            </div>

            <div className="flex items-start gap-3 mt-1">
              {slide.ideaNum && (
                <span
                  className="flex-shrink-0 mt-1 px-3 h-8 md:h-10 rounded-xl flex items-center justify-center text-white text-[14px] md:text-[18px] font-black"
                  style={{ background: HEADER_GRADIENT, boxShadow: '0 8px 20px rgba(124,58,237,0.3)' }}
                >
                  {slide.ideaNum}
                </span>
              )}
              <h2 className="text-[22px] sm:text-[30px] md:text-[clamp(28px,4.6vh,44px)] font-black leading-tight tracking-tight text-center text-[#1e1b4b]">
                {slide.title}
              </h2>
            </div>

            {slide.subtitle && (
              <p className="text-[12.5px] md:text-[17px] font-medium leading-snug max-w-[880px] text-center text-slate-500 px-2">
                {slide.subtitle}
              </p>
            )}
          </div>

          <div className="md:flex-1 md:min-h-0 flex flex-col justify-center">
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] items-center">
            <div
              className="rounded-[24px] bg-white/70 border border-white px-4 sm:px-6 py-4 sm:py-5 flex flex-col org-drop"
              style={{ boxShadow: '0 18px 50px rgba(124,58,237,0.10)', animationDelay: '120ms' }}
            >
              {slide.ideaText && (
                <p className="flex-shrink-0 text-[12.5px] md:text-[16px] text-slate-600 leading-relaxed mb-3">
                  {slide.ideaText}
                </p>
              )}

              {flow.length > 0 && (
                <div className="flex-shrink-0 flex flex-wrap items-center gap-1.5 mb-3">
                  {flow.map((f, i) => (
                    <span key={f} className="flex items-center gap-1.5">
                      <span
                        className="rounded-lg px-2.5 py-1 text-[10.5px] md:text-[12.5px] font-semibold text-violet-700"
                        style={{ background: 'linear-gradient(135deg,#f5f3ff,#ede9fe)' }}
                      >
                        {f}
                      </span>
                      {i < flow.length - 1 && (
                        <Icon name="ChevronRight" size={13} className="text-violet-300 flex-shrink-0" />
                      )}
                    </span>
                  ))}
                </div>
              )}

              <div
                className={`grid gap-2 sm:gap-2.5 ${cols === 2 ? 'sm:grid-cols-2' : 'grid-cols-1'}`}
              >
                {points.map((pt, i) => (
                  <div
                    key={pt.text}
                    className="flex items-start gap-2.5 rounded-2xl px-3 py-2.5 sm:px-3.5 sm:py-3 org-in"
                    style={{
                      background: 'linear-gradient(135deg,#faf9ff,#f4f1fe)',
                      animationDelay: `${240 + i * 55}ms`,
                    }}
                  >
                    {numbered ? (
                      <span
                        className="flex-shrink-0 min-w-[24px] h-[24px] px-1 rounded-lg flex items-center justify-center text-white text-[11px] font-black"
                        style={{ background: HEADER_GRADIENT }}
                      >
                        {pt.num}
                      </span>
                    ) : (
                      <span className="flex-shrink-0 mt-[1px] w-[21px] h-[21px] rounded-full bg-white border border-violet-200 flex items-center justify-center">
                        <Icon name="Check" size={12} className="text-violet-500" />
                      </span>
                    )}
                    <p className="min-w-0 text-[11.5px] md:text-[15px] font-medium text-slate-600 leading-snug">
                      {pt.text}
                    </p>
                  </div>
                ))}
              </div>

              {groups.length > 0 && (
                <div className="grid gap-3 sm:gap-4 lg:grid-cols-2">
                  {groups.map((g, gi) => (
                    <div
                      key={g.title}
                      className="rounded-2xl px-3.5 py-3.5 sm:px-4 sm:py-4 org-in"
                      style={{
                        background: 'linear-gradient(135deg,#faf9ff,#f4f1fe)',
                        animationDelay: `${200 + gi * 100}ms`,
                      }}
                    >
                      <div className="flex items-center gap-2.5 mb-3">
                        <span className="flex-shrink-0 w-8 h-8 rounded-xl bg-white flex items-center justify-center">
                          <Icon name={g.icon ?? 'ListChecks'} size={17} className="text-violet-500" />
                        </span>
                        <p className="min-w-0 text-[13px] md:text-[16px] font-black text-[#1e1b4b] leading-snug">
                          {g.title}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        {g.points.map((t) => (
                          <div key={t} className="flex items-start gap-2.5">
                            <span className="flex-shrink-0 mt-[1px] w-[19px] h-[19px] rounded-full bg-white border border-violet-200 flex items-center justify-center">
                              <Icon name="Check" size={11} className="text-violet-500" />
                            </span>
                            <p className="min-w-0 text-[11.5px] md:text-[14.5px] font-medium text-slate-600 leading-snug">
                              {t}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {slide.ideaNote && (
                <div className="flex-shrink-0 mt-3 flex items-start gap-2 rounded-xl bg-violet-50/70 border border-violet-100 px-3 py-2">
                  <Icon name="Info" size={15} className="text-violet-500 flex-shrink-0 mt-[2px]" />
                  <p className="min-w-0 text-[11px] md:text-[13.5px] font-medium text-slate-600 leading-snug">
                    {slide.ideaNote}
                  </p>
                </div>
              )}
            </div>

            {slide.ideaImage && (
              <div className="hidden lg:flex items-center justify-center">
                <img
                  src={slide.ideaImage}
                  alt=""
                  className="w-[clamp(140px,26vh,260px)] object-contain mix-blend-multiply select-none pointer-events-none"
                />
              </div>
            )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdeaSlide;
