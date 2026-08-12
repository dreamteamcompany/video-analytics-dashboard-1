import { Slide, EcoItem } from './slides';
import Icon from '@/components/ui/icon';

const HEADER_GRADIENT = 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 60%, #5b21b6 100%)';
const VALUE_GRADIENT = 'linear-gradient(120deg, #7c3aed 0%, #6366f1 45%, #ec4899 100%)';

const Card = ({
  item,
  num,
  side,
  delay,
}: {
  item: EcoItem;
  num: number;
  side: 'left' | 'right';
  delay: number;
}) => (
  <div
    className={`flex items-center gap-3 org-in ${side === 'left' ? 'flex-row' : 'flex-row-reverse'}`}
    style={{ animationDelay: `${delay}ms` }}
  >
    <div
      className="flex-1 min-w-0 rounded-2xl bg-white border border-violet-100 px-3.5 py-3 flex items-center gap-3 transition-shadow hover:shadow-lg"
      style={{ boxShadow: '0 6px 20px rgba(124,58,237,0.1)' }}
    >
      <div
        className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg,#ede9fe,#fae8ff)' }}
      >
        <Icon name={item.icon ?? 'Sparkles'} size={22} className="text-violet-600" />
      </div>
      <div className="min-w-0">
        <p className="text-[13.5px] lg:text-[15px] font-bold text-[#1e1b4b] leading-tight">{item.title}</p>
        {item.note && (
          <p className="text-[11px] lg:text-[12.5px] text-slate-500 leading-tight mt-0.5">{item.note}</p>
        )}
      </div>
    </div>

    <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
      {side === 'right' && (
        <span className="w-8 border-t border-dashed border-violet-300" />
      )}
      <span
        className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-black text-white"
        style={{ background: HEADER_GRADIENT, boxShadow: '0 4px 12px rgba(124,58,237,0.3)' }}
      >
        {String(num).padStart(2, '0')}
      </span>
      {side === 'left' && <span className="w-8 border-t border-dashed border-violet-300" />}
    </div>
  </div>
);

const EcosystemSlide = ({ slide }: { slide: Slide }) => {
  const items = slide.ecoItems ?? [];
  const benefits = slide.ecoBenefits ?? [];
  const half = Math.ceil(items.length / 2);
  const left = items.slice(0, half);
  const right = items.slice(half);
  const titleParts = (slide.subtitle ?? '').split(/(ИИ-ядро компании)/);

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

      <div className="relative z-10 flex-1 flex flex-col px-3 sm:px-6 lg:px-10 pt-4 pb-3 min-h-0 overflow-y-auto md:overflow-hidden">
        <div className="w-full max-w-[1500px] mx-auto flex flex-col flex-1 min-h-0">
          {/* Шапка */}
          <div className="flex-shrink-0 flex flex-col items-center gap-2 mb-3">
            {slide.badge && (
              <span
                className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-white text-[12px] md:text-[14px] font-semibold"
                style={{ background: HEADER_GRADIENT, boxShadow: '0 6px 18px rgba(124,58,237,0.32)' }}
              >
                <Icon name={slide.badgeIcon ?? 'Sparkles'} size={16} className="flex-shrink-0" />
                {slide.badge}
              </span>
            )}
            <h2 className="text-3xl md:text-[44px] font-black leading-none tracking-tight text-center text-[#1e1b4b]">
              {slide.title}
            </h2>
            {slide.subtitle && (
              <p className="text-[12.5px] md:text-[15px] text-slate-500 leading-snug max-w-[720px] text-center">
                {titleParts.map((part, i) =>
                  part === 'ИИ-ядро компании' ? (
                    <span
                      key={i}
                      className="font-bold"
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
              </p>
            )}
          </div>

          {/* Схема */}
          <div className="flex-1 min-h-0 grid gap-3 md:gap-4 md:grid-cols-[1fr_auto_1fr] items-center">
            <div className="flex flex-col gap-2.5 md:gap-3">
              {left.map((it, i) => (
                <Card key={it.title} item={it} num={i + 1} side="left" delay={140 + i * 70} />
              ))}
            </div>

            {/* Ядро */}
            <div className="relative flex items-center justify-center py-2">
              <div
                className="absolute rounded-full"
                style={{
                  width: 'min(42vh, 340px)',
                  height: 'min(42vh, 340px)',
                  border: '1px dashed rgba(124,58,237,0.25)',
                }}
              />
              <div
                className="absolute rounded-full"
                style={{
                  width: 'min(35vh, 285px)',
                  height: 'min(35vh, 285px)',
                  border: '1px solid rgba(124,58,237,0.18)',
                }}
              />
              <div
                className="relative rounded-full flex flex-col items-center justify-center text-center px-6 org-in"
                style={{
                  width: 'min(28vh, 230px)',
                  height: 'min(28vh, 230px)',
                  background: HEADER_GRADIENT,
                  boxShadow: '0 18px 50px rgba(124,58,237,0.38)',
                }}
              >
                <div
                  className="absolute inset-0 rounded-full pointer-events-none"
                  style={{
                    backgroundImage:
                      'radial-gradient(rgba(255,255,255,0.35) 1px, transparent 1px)',
                    backgroundSize: '9px 9px',
                    opacity: 0.35,
                  }}
                />
                <Icon name={slide.coreIcon ?? 'BrainCircuit'} size={34} className="text-white mb-2 relative" />
                <p className="relative text-white font-black text-[14px] lg:text-[17px] leading-tight">
                  {slide.coreTitle}
                </p>
                {slide.coreNote && (
                  <p className="relative text-white/75 text-[10.5px] lg:text-[12px] leading-tight mt-1">
                    {slide.coreNote}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2.5 md:gap-3">
              {right.map((it, i) => (
                <Card key={it.title} item={it} num={half + i + 1} side="right" delay={140 + i * 70} />
              ))}
            </div>
          </div>

          {/* Преимущества */}
          {benefits.length > 0 && (
            <div
              className="flex-shrink-0 mt-3 rounded-2xl bg-white/85 border border-violet-100 px-3 py-2.5 grid grid-cols-2 lg:grid-cols-4 gap-2.5"
              style={{ boxShadow: '0 6px 20px rgba(124,58,237,0.09)' }}
            >
              {benefits.map((b) => (
                <div key={b.title} className="flex items-center gap-2.5 min-w-0">
                  <div
                    className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg,#ede9fe,#fae8ff)' }}
                  >
                    <Icon name={b.icon ?? 'Sparkles'} size={19} className="text-violet-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[12.5px] lg:text-[13.5px] font-bold text-[#1e1b4b] leading-tight">
                      {b.title}
                    </p>
                    {b.note && (
                      <p className="text-[10.5px] lg:text-[11.5px] text-slate-500 leading-tight">{b.note}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EcosystemSlide;
