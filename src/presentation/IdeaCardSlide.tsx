import { Slide } from './slides';
import Icon from '@/components/ui/icon';

const HEADER_GRADIENT = 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 60%, #5b21b6 100%)';

const ROW_ICONS = [
  'Activity',
  'CalendarClock',
  'Clock',
  'Puzzle',
  'FileText',
  'MessagesSquare',
  'ShieldCheck',
  'Layers',
  'Target',
];

const IdeaCardSlide = ({ slide }: { slide: Slide }) => {
  const points = slide.ideaPoints ?? [];
  const flow = slide.ideaFlow ?? [];
  const groups = slide.ideaColumns ?? [];
  const half = Math.ceil(points.length / 2);
  const cards = groups.length
    ? groups.map((g) => ({ title: g.title, icon: g.icon, points: g.points }))
    : [
        { title: '', icon: slide.badgeIcon, points: points.slice(0, half).map((p) => p.text) },
        { title: '', icon: slide.badgeIcon, points: points.slice(half).map((p) => p.text) },
      ];

  return (
    <div
      className="h-full flex flex-col overflow-hidden relative"
      style={{ background: 'linear-gradient(135deg, #ffffff 0%, #fbfaff 42%, #f5f2fd 74%, #fdf2f9 100%)' }}
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-0 left-0 w-[22rem] h-[22rem] opacity-70"
          style={{
            backgroundImage: 'radial-gradient(rgba(139,92,246,0.30) 1.3px, transparent 1.3px)',
            backgroundSize: '15px 15px',
            maskImage: 'radial-gradient(circle at 25% 25%, #000 0%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(circle at 25% 25%, #000 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute -top-24 -right-24 w-[30rem] h-[30rem] rounded-full"
          style={{
            background:
              'repeating-radial-gradient(circle, rgba(196,181,253,0.30) 0 1.4px, transparent 1.4px 20px)',
            maskImage: 'radial-gradient(circle, #000 10%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(circle, #000 10%, transparent 70%)',
          }}
        />
        <div
          className="absolute -bottom-24 -right-16 w-[24rem] h-[24rem] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(244,114,182,0.10) 0%, transparent 70%)' }}
        />
      </div>

      <div className="relative z-10 flex-1 flex flex-col px-3 sm:px-8 lg:px-12 pt-3 pb-16 md:pb-5 min-h-0 overflow-y-auto md:overflow-hidden">
        <div className="w-full max-w-[1520px] mx-auto flex flex-col md:flex-1 md:min-h-0">
          <div className="flex-shrink-0 flex flex-col items-center gap-1.5 mb-3 md:mb-4">
            <div className="flex items-center gap-2 flex-wrap justify-center">
              {slide.badge && (
                <span
                  className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-white text-[12px] md:text-[14px] font-bold"
                  style={{ background: HEADER_GRADIENT, boxShadow: '0 10px 24px rgba(124,58,237,0.32)' }}
                >
                  <Icon name={slide.badgeIcon ?? 'Sparkles'} size={16} className="flex-shrink-0" />
                  {slide.badge}
                </span>
              )}
              {slide.ideaTag && (
                <span
                  className="inline-flex items-center rounded-full bg-white px-4 py-2 text-[11px] md:text-[13px] font-bold text-violet-600"
                  style={{ boxShadow: '0 6px 18px rgba(124,58,237,0.10)' }}
                >
                  {slide.ideaTag}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 mt-0.5">
              {slide.ideaNum && (
                <span
                  className="flex-shrink-0 px-3 h-9 md:h-12 rounded-2xl flex items-center justify-center text-white text-[15px] md:text-[21px] font-black"
                  style={{ background: HEADER_GRADIENT, boxShadow: '0 10px 22px rgba(124,58,237,0.30)' }}
                >
                  {slide.ideaNum}
                </span>
              )}
              <h2 className="text-[24px] sm:text-[32px] md:text-[clamp(30px,5vh,48px)] font-black leading-tight tracking-tight text-center text-[#221a4d]">
                {slide.title}
              </h2>
            </div>

            {slide.subtitle && (
              <p className="text-[12.5px] md:text-[clamp(14px,2.2vh,19px)] font-medium leading-snug max-w-[900px] text-center text-slate-500 px-2">
                {slide.subtitle}
              </p>
            )}
          </div>

          {flow.length > 0 && (
            <div className="flex-shrink-0 flex flex-wrap items-center justify-center gap-1.5 mb-3">
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

          <div className="md:flex-1 md:min-h-0 flex flex-col justify-center">
          <div className="relative flex items-stretch">
            <div className="relative w-full grid gap-4 lg:gap-[76px] lg:grid-cols-2 items-stretch">
              {cards.map((card, ci) => (
                <div
                  key={ci}
                  className={`relative flex flex-col rounded-[26px] md:rounded-[30px] bg-white px-4 sm:px-6 pb-5 org-drop ${card.title ? 'pt-5' : 'pt-[62px]'}`}
                  style={{
                    boxShadow: '0 22px 60px rgba(109,40,217,0.10), 0 2px 6px rgba(109,40,217,0.05)',
                    animationDelay: `${140 + ci * 120}ms`,
                  }}
                >
                  <span
                    className="absolute top-4 right-4 sm:top-5 sm:right-5 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white text-[12px] sm:text-[13px] font-black z-10"
                    style={{ background: HEADER_GRADIENT, boxShadow: '0 10px 20px rgba(124,58,237,0.32)' }}
                  >
                    {`0${ci + 1}`}
                  </span>

                  {card.title && (
                    <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0 pr-12 mb-3">
                      <div
                        className="flex-shrink-0 w-[46px] h-[46px] sm:w-[58px] sm:h-[58px] rounded-2xl flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg,#f3f0ff,#e9e4fe)' }}
                      >
                        <Icon name={card.icon ?? 'ListChecks'} size={27} className="text-violet-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[15px] sm:text-[17px] md:text-[clamp(16px,2.5vh,22px)] font-black text-[#221a4d] leading-snug">
                          {card.title}
                        </p>
                        <span className="block mt-2 w-10 h-[3px] rounded-full bg-violet-500" />
                      </div>
                    </div>
                  )}

                  <div className="flex-1 flex flex-col justify-center gap-1.5 sm:gap-2">
                    {card.points.map((t, i) => (
                      <div
                        key={t}
                        className="flex items-center gap-3 rounded-2xl px-2.5 py-2 sm:px-3 sm:py-2.5 org-in transition-colors"
                        style={{
                          background: 'linear-gradient(135deg,#fbfaff,#f6f3fe)',
                          animationDelay: `${300 + i * 60}ms`,
                        }}
                      >
                        <span
                          className="flex-shrink-0 w-[34px] h-[34px] sm:w-[38px] sm:h-[38px] rounded-xl flex items-center justify-center"
                          style={{ background: 'linear-gradient(135deg,#ede9fe,#ddd6fe)' }}
                        >
                          <Icon
                            name={ROW_ICONS[(ci * 5 + i) % ROW_ICONS.length]}
                            size={18}
                            className="text-violet-600"
                          />
                        </span>
                        <p className="min-w-0 text-[12px] sm:text-[13px] md:text-[clamp(13px,1.95vh,16.5px)] font-bold text-[#2b2359] leading-snug">
                          {t}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 items-center justify-center">
                <span className="absolute w-[76px] h-[2px] bg-violet-200" />
                <span className="absolute left-[-38px] w-2.5 h-2.5 rounded-full bg-violet-300" />
                <span className="absolute right-[-38px] w-2.5 h-2.5 rounded-full bg-violet-300" />
                <span className="absolute w-[118px] h-[118px] rounded-full border border-dashed border-violet-200" />
                <span
                  className="relative w-[80px] h-[80px] rounded-full bg-white flex items-center justify-center text-[22px] font-black text-violet-600"
                  style={{ boxShadow: '0 14px 34px rgba(124,58,237,0.18)' }}
                >
                  AI
                </span>
              </div>
            </div>
          </div>

          <div className="contents">
          {slide.ideaText && (
            <div className="flex-shrink-0 mt-3 flex justify-center">
              <div
                className="flex items-center gap-3 rounded-[22px] bg-white px-4 sm:px-6 py-3 max-w-[1100px]"
                style={{ boxShadow: '0 14px 40px rgba(109,40,217,0.08)' }}
              >
                <span
                  className="flex-shrink-0 w-[38px] h-[38px] rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg,#ede9fe,#ddd6fe)' }}
                >
                  <Icon name="Sparkles" size={19} className="text-violet-600" />
                </span>
                <p className="min-w-0 text-[11.5px] md:text-[15px] font-semibold text-slate-600 leading-snug">
                  {slide.ideaText}
                </p>
              </div>
            </div>
          )}

          {slide.ideaNote && (
            <div className="flex-shrink-0 mt-2.5 flex justify-center">
              <div
                className="flex items-center gap-3 sm:gap-4 rounded-[22px] bg-white px-4 sm:px-6 py-3 max-w-[1100px]"
                style={{ boxShadow: '0 14px 40px rgba(109,40,217,0.08)' }}
              >
                <span
                  className="flex-shrink-0 w-[38px] h-[38px] rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg,#ede9fe,#ddd6fe)' }}
                >
                  <Icon name="Lightbulb" size={19} className="text-violet-600" />
                </span>
                <span className="flex-shrink-0 text-[12px] md:text-[15px] font-black text-violet-700 pr-3 sm:pr-4 border-r border-violet-100">
                  Важно
                </span>
                <p className="min-w-0 text-[11.5px] md:text-[15px] font-semibold text-slate-600 leading-snug">
                  {slide.ideaNote}
                </p>
              </div>
            </div>
          )}
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdeaCardSlide;