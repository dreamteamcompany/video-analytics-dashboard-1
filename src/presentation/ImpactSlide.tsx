import { Slide } from './slides';
import Icon from '@/components/ui/icon';
import { useIsMobile } from '@/hooks/use-mobile';

const CARD_SHADOW = '0 4px 20px rgba(124,58,237,0.08), 0 1px 3px rgba(15,23,42,0.06)';
const HEADER_GRADIENT = 'linear-gradient(90deg, #6d28d9 0%, #7c3aed 50%, #6366f1 100%)';

const ImpactSlide = ({ slide }: { slide: Slide }) => {
  const isMobile = useIsMobile();
  const items = slide.impacts ?? [];
  const cols = items.length <= 2 ? items.length || 1 : items.length === 3 ? 3 : 2;

  return (
    <div
      className="h-full flex flex-col overflow-hidden relative"
      style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #fafaff 45%, #f3edfd 75%, #fdf0f7 100%)',
      }}
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-0 right-0 w-[34%] h-[42%]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(99,102,241,0.28) 1.7px, transparent 1.7px)',
            backgroundSize: '17px 17px',
            maskImage: 'linear-gradient(225deg, #000 5%, transparent 60%)',
            WebkitMaskImage: 'linear-gradient(225deg, #000 5%, transparent 60%)',
          }}
        />
        <div
          className="absolute -bottom-28 -left-20 w-[26rem] h-[26rem] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.16) 0%, transparent 70%)' }}
        />
        <div
          className="absolute -top-24 right-[10%] w-[24rem] h-[24rem] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.10) 0%, transparent 70%)' }}
        />
      </div>

      <div className="relative z-10 flex-1 flex flex-col px-3 sm:px-10 pt-3 sm:pt-6 pb-6 md:pb-4 min-h-0 overflow-y-auto md:overflow-hidden">
        {/* Заголовок */}
        <div className="flex-shrink-0 flex flex-col items-center gap-2 md:gap-3 mb-3 md:mb-5">
          {slide.badge && (
            <span
              className="inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 md:px-6 md:py-3 text-white text-[13px] md:text-lg font-semibold text-center"
              style={{ background: HEADER_GRADIENT, boxShadow: '0 8px 24px rgba(124,58,237,0.35)' }}
            >
              <Icon name={slide.badgeIcon ?? 'TrendingUp'} size={16} className="flex-shrink-0 md:hidden" />
              <Icon name={slide.badgeIcon ?? 'TrendingUp'} size={20} className="flex-shrink-0 hidden md:block" />
              <span className="leading-snug">{slide.badge}</span>
            </span>
          )}
          <h2 className="text-xl md:text-4xl font-extrabold text-slate-800 text-center leading-tight">
            {slide.title ?? 'Экономический эффект'}
          </h2>
        </div>

        {/* Главная цель */}
        {slide.impactGoal && (
          <div
            className="flex-shrink-0 relative rounded-2xl overflow-hidden px-4 py-3 md:px-7 md:py-4 mb-3 md:mb-5 org-drop"
            style={{ background: HEADER_GRADIENT, boxShadow: '0 10px 30px rgba(124,58,237,0.30)' }}
          >
            <div className="flex items-start gap-3 md:gap-4">
              <div className="w-9 h-9 md:w-11 md:h-11 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <Icon name="Target" size={20} className="text-white" />
              </div>
              <p className="text-[13px] md:text-xl font-semibold text-white leading-snug">
                {slide.impactGoal}
              </p>
            </div>
          </div>
        )}

        {/* Источники эффекта */}
        <div
          className="flex-none md:flex-1 grid gap-2.5 md:gap-4 md:min-h-0 auto-rows-max md:auto-rows-auto content-start md:content-stretch"
          style={{ gridTemplateColumns: `repeat(${isMobile ? 1 : cols}, minmax(0, 1fr))` }}
        >
          {items.map((it, i) => (
            <div
              key={it.label}
              className="relative rounded-2xl bg-white/90 backdrop-blur-sm p-3.5 md:p-5 flex flex-col gap-2 org-in overflow-hidden"
              style={{ boxShadow: CARD_SHADOW, animationDelay: `${250 + i * 130}ms` }}
            >
              <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ background: HEADER_GRADIENT }} />
              <div className="flex items-center gap-3 pl-1.5">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-violet-50 flex items-center justify-center flex-shrink-0">
                  <Icon name={it.icon ?? 'Coins'} size={22} className="text-violet-500" />
                </div>
                <p className="text-[13px] md:text-base font-bold text-slate-800 leading-snug">
                  {it.label}
                </p>
              </div>

              <div className="mt-auto flex items-start gap-2 rounded-xl bg-emerald-50 px-3 py-2">
                <Icon name="TrendingUp" size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                <p className="text-[13px] md:text-lg font-extrabold text-emerald-700 leading-snug">
                  {it.value}
                </p>
              </div>

              {it.note && (
                <p className="text-[11px] md:text-xs text-slate-500 italic leading-snug pl-1.5">
                  {it.note}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Итог */}
        {slide.conclusion && (
          <div
            className="flex-shrink-0 mt-3 md:mt-5 rounded-2xl bg-white/90 backdrop-blur-sm px-4 py-3 md:px-7 md:py-4 flex items-start gap-3 md:gap-4 org-drop"
            style={{ boxShadow: CARD_SHADOW, animationDelay: '900ms' }}
          >
            <div className="w-9 h-9 md:w-11 md:h-11 rounded-xl bg-violet-50 flex items-center justify-center flex-shrink-0">
              <Icon name="ShieldCheck" size={20} className="text-violet-500" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] md:text-xs font-bold text-violet-500 tracking-[0.2em] uppercase mb-0.5">
                Итог
              </p>
              <p className="text-[12px] md:text-base text-slate-700 leading-snug">
                {slide.conclusion}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImpactSlide;
