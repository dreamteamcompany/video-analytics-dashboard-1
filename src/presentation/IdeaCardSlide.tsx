import { Slide } from './slides';
import Icon from '@/components/ui/icon';

const HEADER_GRADIENT = 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 60%, #5b21b6 100%)';

const IdeaCardSlide = ({ slide }: { slide: Slide }) => {
  const points = slide.ideaPoints ?? [];
  const flow = slide.ideaFlow ?? [];
  const groups = slide.ideaColumns ?? [];
  const cards = groups.map((g) => ({ title: g.title, icon: g.icon, points: g.points }));
  const single = cards.length === 0;

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
          className="absolute -top-24 -right-24 w-[30rem] h-[30rem] rounded-full"
          style={{
            background:
              'repeating-radial-gradient(circle, rgba(236,72,153,0.16) 0 1.4px, transparent 1.4px 18px)',
            maskImage: 'radial-gradient(circle, #000 10%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(circle, #000 10%, transparent 70%)',
          }}
        />
        <div
          className="aurora-a absolute -bottom-40 left-1/4 w-[34rem] h-[34rem] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.16) 0%, transparent 68%)' }}
        />
      </div>

      <div className="relative z-10 flex-1 flex flex-col px-3 sm:px-8 lg:px-14 pt-3 pb-16 md:pb-4 min-h-0 overflow-y-auto md:overflow-hidden">
        <div className="w-full max-w-[1480px] mx-auto flex flex-col md:flex-1 md:min-h-0">
          <div className="flex-shrink-0 flex flex-col items-center gap-2 mb-4">
            <div className="flex items-center gap-2 flex-wrap justify-center">
              {slide.badge && (
                <span
                  className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-white text-[12px] md:text-[14px] font-bold"
                  style={{ background: HEADER_GRADIENT, boxShadow: '0 8px 22px rgba(124,58,237,0.35)' }}
                >
                  <Icon name={slide.badgeIcon ?? 'Sparkles'} size={16} className="flex-shrink-0" />
                  {slide.badge}
                </span>
              )}
              {slide.ideaTag && (
                <span className="inline-flex items-center rounded-full bg-white/80 border border-violet-100 px-4 py-2 text-[11px] md:text-[13px] font-bold text-violet-600">
                  {slide.ideaTag}
                </span>
              )}
            </div>

            <div className="flex items-start gap-3">
              {slide.ideaNum && (
                <span
                  className="flex-shrink-0 mt-1.5 px-3 h-8 md:h-11 rounded-xl flex items-center justify-center text-white text-[14px] md:text-[19px] font-black"
                  style={{ background: HEADER_GRADIENT, boxShadow: '0 8px 20px rgba(124,58,237,0.3)' }}
                >
                  {slide.ideaNum}
                </span>
              )}
              <h2 className="text-[26px] sm:text-3xl md:text-[46px] font-black leading-tight tracking-tight text-center text-[#1e1b4b]">
                {slide.title}
              </h2>
            </div>

            {slide.subtitle && (
              <p className="text-[12.5px] md:text-[18px] font-medium leading-snug max-w-[820px] text-center text-slate-500 px-2">
                {slide.subtitle}
              </p>
            )}
          </div>

          {flow.length > 0 && (
            <div className="flex-shrink-0 flex flex-wrap items-center justify-center gap-1.5 mb-4">
              {flow.map((f, i) => (
                <span key={f} className="flex items-center gap-1.5">
                  <span
                    className="rounded-lg px-3 py-1.5 text-[11px] md:text-[13px] font-semibold text-violet-700"
                    style={{ background: 'linear-gradient(135deg,#f5f3ff,#ede9fe)' }}
                  >
                    {f}
                  </span>
                  {i < flow.length - 1 && (
                    <Icon name="ChevronRight" size={14} className="text-violet-300 flex-shrink-0" />
                  )}
                </span>
              ))}
            </div>
          )}

          {single && (
            <div className="md:flex-1 md:min-h-0 flex flex-col justify-center">
            <div
              className="relative flex flex-col rounded-[24px] md:rounded-[28px] bg-white/70 border border-white px-4 sm:px-7 pt-6 pb-6 org-drop"
              style={{ boxShadow: '0 18px 50px rgba(124,58,237,0.10)', animationDelay: '140ms' }}
            >
              <div
                className="rounded-xl sm:rounded-2xl px-3.5 py-4 sm:px-5 sm:py-5 grid gap-2.5 sm:gap-x-6 sm:gap-y-3 content-center sm:grid-cols-2"
                style={{ background: 'linear-gradient(135deg,#faf9ff,#f4f1fe)' }}
              >
                {points.map((pt, i) => (
                  <div
                    key={pt.text}
                    className="flex items-start gap-3 org-in"
                    style={{ animationDelay: `${260 + i * 55}ms` }}
                  >
                    <span
                      className="flex-shrink-0 mt-[1px] min-w-[24px] h-[24px] px-1 rounded-lg flex items-center justify-center text-white text-[11px] font-black"
                      style={{ background: HEADER_GRADIENT }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <p className="min-w-0 text-[12px] sm:text-[13px] md:text-[clamp(13px,1.95vh,17px)] font-medium text-slate-600 leading-snug">
                      {pt.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            </div>
          )}

          <div className={`relative md:flex-1 md:min-h-0 grid gap-5 lg:gap-[86px] lg:grid-cols-2 ${single ? 'hidden' : ''}`}>
            {cards.map((card, ci) => (
              <div
                key={ci}
                className="relative md:min-h-0 flex flex-col rounded-[24px] md:rounded-[28px] bg-white/70 border border-white px-4 sm:px-6 pt-5 pb-5 org-drop"
                style={{
                  boxShadow: '0 18px 50px rgba(124,58,237,0.10)',
                  animationDelay: `${140 + ci * 120}ms`,
                }}
              >
                <span
                  className="absolute -top-3 right-5 sm:right-8 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-white text-[12px] font-black"
                  style={{ background: HEADER_GRADIENT, boxShadow: '0 8px 18px rgba(124,58,237,0.35)' }}
                >
                  {`0${ci + 1}`}
                </span>

                {card.title && (
                  <div className="flex items-start gap-3 sm:gap-4 flex-shrink-0 pr-8 sm:pr-10 mb-4">
                    <div
                      className="flex-shrink-0 w-[48px] h-[48px] sm:w-[62px] sm:h-[62px] rounded-xl sm:rounded-2xl flex items-center justify-center"
                      style={{ background: 'linear-gradient(135deg,#f5f3ff,#ede9fe)' }}
                    >
                      <Icon name={card.icon ?? 'ListChecks'} size={30} className="text-violet-500" />
                    </div>
                    <div className="min-w-0 pt-1">
                      <p className="text-[15px] sm:text-[17px] md:text-[clamp(17px,2.6vh,23px)] font-black text-[#1e1b4b] leading-snug">
                        {card.title}
                      </p>
                      <span className="block mt-2 w-9 sm:w-11 h-[3px] rounded-full bg-violet-400" />
                    </div>
                  </div>
                )}

                <div
                  className="md:flex-1 md:min-h-0 rounded-xl sm:rounded-2xl px-3.5 py-3.5 sm:px-4 sm:py-4 flex flex-col justify-center gap-2.5 sm:gap-3"
                  style={{ background: 'linear-gradient(135deg,#faf9ff,#f4f1fe)' }}
                >
                  {card.points.map((t, i) => (
                    <div
                      key={t}
                      className="flex items-start gap-2.5 org-in"
                      style={{ animationDelay: `${300 + i * 60}ms` }}
                    >
                      <span className="flex-shrink-0 mt-[1px] w-[20px] h-[20px] rounded-full bg-white border-[1.5px] border-violet-300 flex items-center justify-center">
                        <Icon name="Check" size={11} className="text-violet-500" />
                      </span>
                      <p className="min-w-0 text-[11.5px] sm:text-[12.5px] md:text-[clamp(12.5px,1.85vh,16px)] font-medium text-slate-600 leading-snug">
                        {t}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 items-center justify-center">
              <span className="absolute w-[112px] h-[112px] rounded-full border border-dashed border-violet-200" />
              <span
                className="relative w-[78px] h-[78px] rounded-full bg-white flex items-center justify-center text-[21px] font-black text-violet-600"
                style={{ boxShadow: '0 12px 30px rgba(124,58,237,0.16)' }}
              >
                AI
              </span>
            </div>
          </div>

          {slide.ideaText && (
            <div className="flex-shrink-0 mt-4 flex items-center justify-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/80 border border-violet-100 px-5 py-2.5 text-[11.5px] md:text-[15px] font-semibold text-slate-600 text-center">
                <Icon name="Sparkles" size={16} className="text-violet-500 flex-shrink-0" />
                {slide.ideaText}
              </span>
            </div>
          )}

          {slide.ideaNote && (
            <div className="flex-shrink-0 mt-3 flex items-center justify-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-violet-50/80 border border-violet-100 px-5 py-2.5 text-[11px] md:text-[14px] font-semibold text-violet-700 text-center">
                <Icon name="Info" size={15} className="text-violet-500 flex-shrink-0" />
                {slide.ideaNote}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IdeaCardSlide;