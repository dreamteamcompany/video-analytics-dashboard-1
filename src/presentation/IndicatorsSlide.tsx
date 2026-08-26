import { Slide, IndicatorItem } from './slides';
import Icon from '@/components/ui/icon';

const HEADER_GRADIENT = 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 60%, #5b21b6 100%)';
const VALUE_GRADIENT = 'linear-gradient(120deg, #7c3aed 0%, #6366f1 45%, #ec4899 100%)';

const DANGER_HEADER = 'linear-gradient(135deg, #ef4444 0%, #dc2626 55%, #b91c1c 100%)';
const DANGER_VALUE = 'linear-gradient(120deg, #dc2626 0%, #ef4444 45%, #f97316 100%)';

const IndicatorCard = ({ item, index, danger }: { item: IndicatorItem; index: number; danger?: boolean }) => {
  const long = (item.title ?? '').length > 46;
  const titleSize = long
    ? 'text-[13px] md:text-[clamp(13px,1.9vh,19px)]'
    : 'text-[14.5px] md:text-[clamp(14.5px,2.2vh,23px)]';

  const metricLong = (item.metric ?? '').length > 5;
  const metricSize = danger
    ? metricLong
      ? 'text-[22px] md:text-[clamp(22px,3.4vh,38px)]'
      : 'text-[26px] md:text-[clamp(26px,4vh,46px)]'
    : metricLong
      ? 'text-[17px] md:text-[clamp(17px,2.5vh,26px)]'
      : 'text-[20px] md:text-[clamp(20px,3.1vh,33px)]';

  return (
    <div
      className={`relative min-h-0 flex flex-col justify-center gap-2 rounded-xl px-3.5 py-3 org-in transition-shadow hover:shadow-lg ${
        danger ? 'bg-white border-2 border-red-200 overflow-hidden' : 'bg-white/95 border border-violet-100'
      }`}
      style={{
        boxShadow: danger ? '0 6px 20px rgba(220,38,38,0.16)' : '0 4px 14px rgba(124,58,237,0.08)',
        animationDelay: `${120 + index * 55}ms`,
      }}
    >
      {danger && (
        <>
          <span className="absolute left-0 top-0 bottom-0 w-[5px]" style={{ background: DANGER_HEADER }} />
          <Icon
            name="Zap"
            size={104}
            className="absolute -right-4 -bottom-6 text-red-500/[0.07] pointer-events-none"
          />
        </>
      )}

      <div className="flex items-center gap-3">
        <div
          className="flex-shrink-0 w-10 h-10 md:w-[52px] md:h-[52px] rounded-xl flex items-center justify-center"
          style={{
            background: danger ? DANGER_HEADER : HEADER_GRADIENT,
            boxShadow: danger ? '0 5px 14px rgba(220,38,38,0.35)' : '0 5px 14px rgba(124,58,237,0.3)',
          }}
        >
          <Icon name={item.icon ?? 'Target'} size={23} className="text-white" />
        </div>

        <p className={`min-w-0 flex-1 font-bold leading-tight ${titleSize} ${danger ? 'text-red-950' : 'text-slate-800'}`}>
          {item.title}
        </p>

        <div className={`flex-shrink-0 text-right ${danger ? 'w-[104px] md:w-[136px]' : 'w-[82px] md:w-[108px]'}`}>
          <p
            className={`font-black leading-none tracking-tight ${metricSize}`}
            style={{
              background: danger ? DANGER_VALUE : VALUE_GRADIENT,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {item.metric}
          </p>
          {item.metricNote && (
            <p
              className={`text-[9.5px] md:text-[clamp(9.5px,1.3vh,13px)] font-bold leading-tight mt-1 ${
                danger ? 'text-red-500' : 'text-slate-400 font-semibold'
              }`}
            >
              {item.metricNote}
            </p>
          )}
        </div>
      </div>

      {item.note && (
        <p
          className={`text-[12.5px] md:text-[clamp(12.5px,1.8vh,17.5px)] leading-snug relative ${
            danger ? 'text-red-900/70 font-medium' : 'text-slate-500'
          }`}
        >
          {item.note}
        </p>
      )}
    </div>
  );
};

const IndicatorsSlide = ({ slide }: { slide: Slide }) => {
  const items = slide.indicators ?? [];
  const danger = slide.indicatorsTone === 'danger';

  return (
    <div
      className="h-full flex flex-col overflow-hidden relative"
      style={{
        background: danger
          ? 'linear-gradient(135deg, #ffffff 0%, #fff5f5 45%, #ffe8e8 75%, #fff1eb 100%)'
          : 'linear-gradient(135deg, #ffffff 0%, #faf8ff 45%, #f3edfd 75%, #fdf0f7 100%)',
      }}
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              danger
                ? 'linear-gradient(rgba(220,38,38,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(220,38,38,0.05) 1px, transparent 1px)'
                : 'linear-gradient(rgba(124,58,237,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.05) 1px, transparent 1px)',
            backgroundSize: '46px 46px',
            maskImage: 'radial-gradient(ellipse at 50% 45%, #000 20%, transparent 76%)',
            WebkitMaskImage: 'radial-gradient(ellipse at 50% 45%, #000 20%, transparent 76%)',
          }}
        />
        <div
          className="aurora-a absolute -bottom-32 -left-24 w-[32rem] h-[32rem] rounded-full"
          style={{
            background: danger
              ? 'radial-gradient(circle, rgba(248,113,113,0.24) 0%, transparent 68%)'
              : 'radial-gradient(circle, rgba(167,139,250,0.2) 0%, transparent 68%)',
          }}
        />
        <div
          className="aurora-b absolute -top-32 right-[4%] w-[30rem] h-[30rem] rounded-full"
          style={{
            background: danger
              ? 'radial-gradient(circle, rgba(249,115,22,0.16) 0%, transparent 68%)'
              : 'radial-gradient(circle, rgba(236,72,153,0.14) 0%, transparent 68%)',
          }}
        />
      </div>

      <div className="relative z-10 flex-1 flex flex-col px-3 sm:px-6 lg:px-8 pt-3 pb-3 min-h-0 overflow-y-auto md:overflow-hidden">
        <div className="w-full max-w-[1400px] mx-auto flex flex-col flex-1 min-h-0">
          <div className="flex-shrink-0 flex flex-col items-center gap-2 mb-3">
            {slide.badge && (
              <span
                className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-white text-[12px] md:text-[14px] font-semibold"
                style={{
                  background: danger ? DANGER_HEADER : HEADER_GRADIENT,
                  boxShadow: danger ? '0 6px 18px rgba(220,38,38,0.34)' : '0 6px 18px rgba(124,58,237,0.32)',
                }}
              >
                <Icon name={slide.badgeIcon ?? 'Gauge'} size={16} className="flex-shrink-0" />
                {slide.badge}
              </span>
            )}
            <h2 className={`text-2xl md:text-[38px] font-black leading-tight tracking-tight text-center ${danger ? 'text-[#4c0519]' : 'text-[#1e1b4b]'}`}>
              {slide.title}
            </h2>
            {slide.subtitle && (
              <p
                className={`text-[14px] md:text-[19px] font-bold leading-snug max-w-[900px] text-center rounded-xl px-4 py-1.5 border ${
                  danger
                    ? 'bg-red-50 border-red-200 text-red-700'
                    : 'bg-emerald-50/80 border-emerald-100 text-emerald-700'
                }`}
              >
                {slide.subtitle}
              </p>
            )}
          </div>

          <div className="flex-1 min-h-0 grid gap-2 md:gap-2.5 sm:grid-cols-2 auto-rows-fr">
            {items.map((it, i) => (
              <IndicatorCard key={it.title} item={it} index={i} danger={danger} />
            ))}
          </div>

          {slide.indicatorsPhases && (
            <div className="flex-shrink-0 mt-2.5 grid gap-2 sm:grid-cols-2">
              {slide.indicatorsPhases.map((p, i) => (
                <div
                  key={p.year}
                  className={`org-in rounded-xl px-3.5 py-2 flex items-center gap-2.5 border ${
                    i === 0
                      ? 'bg-white/95 border-violet-100'
                      : 'bg-violet-50/90 border-violet-200'
                  }`}
                  style={{ animationDelay: `${560 + i * 80}ms` }}
                >
                  <span
                    className="flex-shrink-0 rounded-lg px-2.5 py-1 text-[12px] md:text-[15px] font-black text-white"
                    style={{ background: HEADER_GRADIENT }}
                  >
                    {p.year}
                  </span>
                  <span className="min-w-0 text-[11.5px] md:text-[14px] font-bold text-slate-700 leading-snug">
                    {p.label}
                  </span>
                </div>
              ))}
            </div>
          )}

          {slide.indicatorsFooter && (
            <div
              className="flex-shrink-0 mt-2.5 rounded-xl px-4 py-2.5 flex items-center justify-center gap-2 text-center text-white text-[12px] md:text-[15px] font-bold org-in"
              style={{
                background: danger ? DANGER_HEADER : HEADER_GRADIENT,
                boxShadow: danger ? '0 8px 22px rgba(220,38,38,0.3)' : '0 8px 22px rgba(124,58,237,0.28)',
                animationDelay: '600ms',
              }}
            >
              {danger && <Icon name="Zap" size={17} className="flex-shrink-0" />}
              {slide.indicatorsFooter}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IndicatorsSlide;