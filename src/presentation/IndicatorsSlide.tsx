import { Slide, IndicatorItem } from './slides';
import Icon from '@/components/ui/icon';

const HEADER_GRADIENT = 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 60%, #5b21b6 100%)';
const VALUE_GRADIENT = 'linear-gradient(120deg, #7c3aed 0%, #6366f1 45%, #ec4899 100%)';

const IndicatorCard = ({ item, index }: { item: IndicatorItem; index: number }) => (
  <div
    className="relative min-h-0 flex flex-col gap-1.5 rounded-xl bg-white/95 border border-violet-100 px-3 py-2.5 org-in transition-shadow hover:shadow-lg"
    style={{ boxShadow: '0 4px 14px rgba(124,58,237,0.08)', animationDelay: `${120 + index * 55}ms` }}
  >
    <div className="flex items-center gap-2.5">
      <div
        className="flex-shrink-0 w-9 h-9 md:w-11 md:h-11 rounded-xl flex items-center justify-center"
        style={{ background: HEADER_GRADIENT, boxShadow: '0 5px 14px rgba(124,58,237,0.3)' }}
      >
        <Icon name={item.icon ?? 'Target'} size={20} className="text-white" />
      </div>

      <p className="min-w-0 flex-1 text-[12.5px] md:text-[clamp(12.5px,1.7vh,17px)] font-bold text-slate-800 leading-tight">
        {item.title}
      </p>

      <div className="flex-shrink-0 text-right w-[74px] md:w-[92px]">
        <p
          className="text-[18px] md:text-[clamp(18px,2.7vh,28px)] font-black leading-none tracking-tight"
          style={{
            background: VALUE_GRADIENT,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {item.metric}
        </p>
        {item.metricNote && (
          <p className="text-[8.5px] md:text-[clamp(8.5px,1.1vh,11px)] font-semibold text-slate-400 leading-tight mt-1">
            {item.metricNote}
          </p>
        )}
      </div>
    </div>

    {item.note && (
      <p className="text-[11px] md:text-[clamp(11px,1.5vh,14px)] text-slate-500 leading-snug">
        {item.note}
      </p>
    )}
  </div>
);

const IndicatorsSlide = ({ slide }: { slide: Slide }) => {
  const items = slide.indicators ?? [];

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
                <Icon name={slide.badgeIcon ?? 'Gauge'} size={16} className="flex-shrink-0" />
                {slide.badge}
              </span>
            )}
            <h2 className="text-2xl md:text-[38px] font-black leading-tight tracking-tight text-center text-[#1e1b4b]">
              {slide.title}
            </h2>
            {slide.subtitle && (
              <p className="text-[14px] md:text-[19px] font-medium text-slate-600 leading-snug max-w-[900px] text-center">
                {slide.subtitle}
              </p>
            )}
          </div>

          <div className="flex-1 min-h-0 grid gap-2 md:gap-2.5 sm:grid-cols-2 auto-rows-fr">
            {items.map((it, i) => (
              <IndicatorCard key={it.title} item={it} index={i} />
            ))}
          </div>

          {slide.indicatorsFooter && (
            <div
              className="flex-shrink-0 mt-3 rounded-xl px-4 py-2.5 text-center text-white text-[12px] md:text-[15px] font-semibold org-in"
              style={{ background: HEADER_GRADIENT, boxShadow: '0 8px 22px rgba(124,58,237,0.28)', animationDelay: '600ms' }}
            >
              {slide.indicatorsFooter}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IndicatorsSlide;