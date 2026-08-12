import { Slide } from './slides';
import Icon from '@/components/ui/icon';

const HEADER_GRADIENT = 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 60%, #5b21b6 100%)';
const VALUE_GRADIENT = 'linear-gradient(120deg, #7c3aed 0%, #6366f1 45%, #ec4899 100%)';

const EcosystemSlide = ({ slide }: { slide: Slide }) => {
  const items = slide.ecoItems ?? [];
  const n = items.length || 1;
  const titleParts = (slide.title ?? '').split(/(\d{4})/);

  const rx = 34;
  const ry = 33;
  const angle = (i: number) => (i / n) * 2 * Math.PI - Math.PI / 2;

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
            maskImage: 'radial-gradient(ellipse at 50% 50%, #000 25%, transparent 78%)',
            WebkitMaskImage: 'radial-gradient(ellipse at 50% 50%, #000 25%, transparent 78%)',
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
        <div className="w-full max-w-[1400px] mx-auto flex flex-col flex-1 min-h-0 md:relative">
          <div className="flex-shrink-0 flex flex-col items-center gap-2 mb-2 md:absolute md:inset-x-0 md:top-0 md:z-20 md:pointer-events-none">
            {slide.badge && (
              <span
                className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-white text-[12px] md:text-[14px] font-semibold"
                style={{ background: HEADER_GRADIENT, boxShadow: '0 6px 18px rgba(124,58,237,0.32)' }}
              >
                <Icon name={slide.badgeIcon ?? 'Sparkles'} size={16} className="flex-shrink-0" />
                {slide.badge}
              </span>
            )}
            <h2 className="text-3xl md:text-[38px] font-black leading-none tracking-tight text-center text-[#1e1b4b]">
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
              <p className="text-[12px] md:text-[14px] text-slate-500 leading-snug max-w-[620px] text-center">
                {slide.subtitle}
              </p>
            )}
          </div>

          {/* Круговая схема — десктоп */}
          <div className="hidden md:flex md:absolute md:inset-0 min-h-0 items-center justify-center">
            <div className="relative w-full h-full">
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="absolute inset-0 w-full h-full pointer-events-none"
              >
                {items.map((_, i) => {
                  const a = angle(i);
                  return (
                    <line
                      key={i}
                      x1={50 + Math.cos(a) * rx * 0.4}
                      y1={50 + Math.sin(a) * ry * 0.4}
                      x2={50 + Math.cos(a) * rx * 0.78}
                      y2={50 + Math.sin(a) * ry * 0.78}
                      stroke="rgba(124,58,237,0.28)"
                      strokeWidth="1.5"
                      strokeDasharray="5 5"
                      vectorEffect="non-scaling-stroke"
                    />
                  );
                })}
              </svg>

              <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full flex flex-col items-center justify-center text-center px-4 org-in"
                style={{
                  width: 'min(28vh, 210px)',
                  height: 'min(28vh, 210px)',
                  background: HEADER_GRADIENT,
                  boxShadow: '0 14px 40px rgba(124,58,237,0.4)',
                }}
              >
                <Icon name={slide.coreIcon ?? 'BrainCircuit'} size={28} className="text-white mb-1" />
                <p className="text-white font-black text-[13px] lg:text-[15px] leading-tight">{slide.coreTitle}</p>
                {slide.coreNote && (
                  <p className="text-white/75 text-[10px] lg:text-[11px] leading-tight mt-0.5">{slide.coreNote}</p>
                )}
              </div>

              {items.map((it, i) => {
                const a = angle(i);
                const x = 50 + Math.cos(a) * rx;
                const y = 50 + Math.sin(a) * ry;
                return (
                  <div
                    key={it.title}
                    className="absolute -translate-x-1/2 -translate-y-1/2 org-in"
                    style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${140 + i * 70}ms` }}
                  >
                    <div
                      className="w-[168px] lg:w-[186px] h-[104px] lg:h-[112px] rounded-2xl bg-white/95 border border-violet-100 px-2.5 py-2 flex flex-col items-center justify-center text-center transition-shadow hover:shadow-lg"
                      style={{ boxShadow: '0 6px 18px rgba(124,58,237,0.12)' }}
                    >
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center mb-1 flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg,#ede9fe,#fae8ff)' }}
                      >
                        <Icon name={it.icon ?? 'Sparkles'} size={17} className="text-violet-600" />
                      </div>
                      <p className="text-[11.5px] lg:text-[13px] font-bold text-slate-800 leading-tight line-clamp-2">
                        {it.title}
                      </p>
                      {it.note && (
                        <p className="text-[9.5px] lg:text-[10.5px] text-slate-500 leading-tight mt-0.5 line-clamp-2">
                          {it.note}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Мобильная версия */}
          <div className="md:hidden flex flex-col gap-2.5 mt-2">
            <div
              className="rounded-2xl px-4 py-3 flex items-center gap-3"
              style={{ background: HEADER_GRADIENT, boxShadow: '0 10px 26px rgba(124,58,237,0.3)' }}
            >
              <Icon name={slide.coreIcon ?? 'BrainCircuit'} size={26} className="text-white flex-shrink-0" />
              <div>
                <p className="text-white font-black text-[14px] leading-tight">{slide.coreTitle}</p>
                {slide.coreNote && <p className="text-white/75 text-[11px]">{slide.coreNote}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {items.map((it) => (
                <div key={it.title} className="rounded-xl bg-white/95 border border-violet-100 px-2.5 py-2 text-center">
                  <div
                    className="mx-auto w-8 h-8 rounded-lg flex items-center justify-center mb-1"
                    style={{ background: 'linear-gradient(135deg,#ede9fe,#fae8ff)' }}
                  >
                    <Icon name={it.icon ?? 'Sparkles'} size={17} className="text-violet-600" />
                  </div>
                  <p className="text-[11.5px] font-bold text-slate-800 leading-tight">{it.title}</p>
                  {it.note && <p className="text-[10px] text-slate-500 leading-tight mt-0.5">{it.note}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EcosystemSlide;