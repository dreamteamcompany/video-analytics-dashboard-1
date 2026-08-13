import { Slide } from './slides';
import Icon from '@/components/ui/icon';
import LightBackdrop from './LightBackdrop';

const HEADER_GRADIENT = 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 60%, #5b21b6 100%)';
const ACCENT_GRADIENT = 'linear-gradient(120deg, #7c3aed 0%, #6366f1 45%, #ec4899 100%)';

const ClosingSlide = ({ slide }: { slide: Slide }) => {
  const points = slide.closingPoints ?? [];

  return (
    <div
      className="h-full flex flex-col overflow-hidden relative"
      style={{ background: 'linear-gradient(135deg, #ffffff 0%, #faf8ff 45%, #f3edfd 75%, #fdf0f7 100%)' }}
    >
      <LightBackdrop />

      <div className="relative z-10 flex-1 flex flex-col px-3 sm:px-6 lg:px-8 pt-4 pb-4 min-h-0 overflow-y-auto md:overflow-hidden">
        <div className="w-full max-w-[1240px] mx-auto flex flex-col flex-1 min-h-0 justify-center gap-4 md:gap-5">
          <div className="flex-shrink-0 flex flex-col items-center gap-2.5 text-center">
            {slide.badge && (
              <span
                className="org-drop inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-white text-[12px] md:text-[14px] font-semibold"
                style={{ background: HEADER_GRADIENT, boxShadow: '0 6px 18px rgba(124,58,237,0.32)' }}
              >
                <Icon name={slide.badgeIcon ?? 'Flag'} size={16} className="flex-shrink-0" />
                {slide.badge}
              </span>
            )}

            <h2 className="text-[26px] md:text-[46px] font-black leading-tight tracking-tight text-[#1e1b4b]">
              {slide.title}
            </h2>

            {slide.subtitle && (
              <p className="text-[13px] md:text-[17px] text-slate-500 leading-snug max-w-[820px]">
                {slide.subtitle}
              </p>
            )}
          </div>

          {points.length > 0 && (
            <div className="flex-shrink-0 grid gap-2.5 md:gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {points.map((p, i) => (
                <div
                  key={p.title}
                  className="org-in rounded-2xl bg-white/95 border border-violet-100 px-4 py-3.5 flex flex-col gap-2"
                  style={{ boxShadow: '0 6px 20px rgba(124,58,237,0.1)', animationDelay: `${140 + i * 80}ms` }}
                >
                  <div
                    className="w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center"
                    style={{ background: HEADER_GRADIENT, boxShadow: '0 5px 14px rgba(124,58,237,0.3)' }}
                  >
                    <Icon name={p.icon ?? 'Check'} size={21} className="text-white" />
                  </div>

                  {p.metric && (
                    <p
                      className="text-[20px] md:text-[26px] font-black leading-none tracking-tight"
                      style={{
                        background: ACCENT_GRADIENT,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}
                    >
                      {p.metric}
                    </p>
                  )}

                  <p className="text-[13px] md:text-[15px] font-bold text-slate-800 leading-snug">
                    {p.title}
                  </p>

                  {p.note && (
                    <p className="text-[11.5px] md:text-[13px] text-slate-500 leading-snug">{p.note}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {slide.closingResult && (
            <div
              className="org-in flex-shrink-0 rounded-2xl px-5 py-4 md:px-7 md:py-5 text-center relative overflow-hidden"
              style={{ background: HEADER_GRADIENT, boxShadow: '0 12px 32px rgba(124,58,237,0.32)', animationDelay: '520ms' }}
            >
              <div className="relative flex flex-col items-center gap-1.5">
                <span className="inline-flex items-center gap-2 text-[10.5px] md:text-[12px] font-black uppercase tracking-[0.18em] text-violet-200">
                  <Icon name="Gem" size={15} className="flex-shrink-0" />
                  Главный итог
                </span>
                <p className="text-[15px] md:text-[22px] font-black text-white leading-snug max-w-[900px]">
                  {slide.closingResult}
                </p>
                {slide.closingResultNote && (
                  <p className="text-[12px] md:text-[15px] text-white/75 leading-snug max-w-[820px]">
                    {slide.closingResultNote}
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="flex-shrink-0 flex flex-col items-center gap-2.5">
            {slide.closingCta && (
              <p className="text-[14px] md:text-[19px] font-bold text-[#1e1b4b] text-center leading-snug">
                {slide.closingCta}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-center gap-2">
              {slide.author && (
                <span className="inline-flex items-center gap-2 rounded-full bg-white border border-violet-100 px-4 py-2 text-[12.5px] md:text-[15px] font-semibold text-slate-700">
                  <Icon name="User" size={16} className="text-violet-500 flex-shrink-0" />
                  {slide.author}
                </span>
              )}
              {slide.year && (
                <span className="inline-flex items-center gap-2 rounded-full bg-white border border-violet-100 px-4 py-2 text-[12.5px] md:text-[15px] font-semibold text-slate-700">
                  <Icon name="Calendar" size={16} className="text-violet-500 flex-shrink-0" />
                  {slide.year}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClosingSlide;
