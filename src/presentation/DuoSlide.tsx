import { Slide } from './slides';
import Icon from '@/components/ui/icon';

const HEADER_GRADIENT = 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 60%, #5b21b6 100%)';

type DuoCard = NonNullable<Slide['duoCards']>[number];

const Card = ({ card, index }: { card: DuoCard; index: number }) => (
  <div
    className="relative md:min-h-0 flex flex-col rounded-[24px] md:rounded-[28px] bg-white/70 border border-white px-4 sm:px-5 pt-4 pb-4 sm:pt-5 sm:pb-5 org-drop"
    style={{ boxShadow: '0 18px 50px rgba(124,58,237,0.10)', animationDelay: `${140 + index * 120}ms` }}
  >
    <span
      className="absolute -top-3 right-5 sm:right-8 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-white text-[12px] font-black"
      style={{ background: HEADER_GRADIENT, boxShadow: '0 8px 18px rgba(124,58,237,0.35)' }}
    >
      {card.num}
    </span>

    <div className="flex items-start gap-3 sm:gap-4 flex-shrink-0 pr-8 sm:pr-10">
      <div
        className="flex-shrink-0 w-[48px] h-[48px] sm:w-[62px] sm:h-[62px] md:w-[74px] md:h-[74px] rounded-xl sm:rounded-2xl flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg,#f5f3ff,#ede9fe)' }}
      >
        <Icon name={card.icon ?? 'ClipboardCheck'} size={28} className="text-violet-500 sm:hidden" />
        <Icon name={card.icon ?? 'ClipboardCheck'} size={34} className="text-violet-500 hidden sm:block" />
      </div>
      <div className="min-w-0 pt-1 max-w-[420px]">
        <p className="text-[15px] sm:text-[17px] md:text-[clamp(17px,2.6vh,24px)] font-black text-[#1e1b4b] leading-snug">
          {card.title}
        </p>
        <span className="block mt-2 sm:mt-2.5 w-9 sm:w-11 h-[3px] rounded-full bg-violet-400" />
      </div>
    </div>

    {card.text && (
      <p className="flex-shrink-0 mt-3 sm:mt-4 text-[12px] sm:text-[12.5px] md:text-[clamp(12.5px,1.85vh,16px)] text-slate-500 leading-relaxed">
        {card.text}
      </p>
    )}

    <div className="md:flex-1 md:min-h-0 mt-3 sm:mt-4 grid grid-cols-[minmax(0,1fr)_auto] gap-2 sm:gap-3 items-end">
      <div
        className="rounded-xl sm:rounded-2xl px-3 py-3 sm:px-3.5 sm:py-3.5 flex flex-col justify-center gap-2.5 sm:gap-3"
        style={{ background: 'linear-gradient(135deg,#faf9ff,#f4f1fe)' }}
      >
        {card.points.map((p, i) => (
          <div key={p} className="flex items-center gap-2.5 org-in" style={{ animationDelay: `${320 + i * 70}ms` }}>
            <span className="flex-shrink-0 w-[18px] h-[18px] rounded-full border-[1.5px] border-violet-300 flex items-center justify-center">
              <Icon name="Check" size={11} className="text-violet-500" />
            </span>
            <p className="min-w-0 text-[11px] sm:text-[11.5px] md:text-[clamp(11.5px,1.7vh,14.5px)] text-slate-600 leading-snug">
              {p}
            </p>
          </div>
        ))}
      </div>

      {card.image && (
        <img
          src={card.image}
          alt=""
          className="w-[74px] sm:w-[110px] md:w-[clamp(110px,17vh,175px)] object-contain mix-blend-multiply select-none pointer-events-none"
        />
      )}
    </div>
  </div>
);

const DuoSlide = ({ slide }: { slide: Slide }) => {
  const cards = slide.duoCards ?? [];
  const why = slide.duoWhy ?? [];

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

      <div className="relative z-10 flex-1 flex flex-col px-3 sm:px-8 lg:px-14 pt-3 pb-16 md:pb-3 min-h-0 overflow-y-auto md:overflow-hidden">
        <div className="w-full max-w-[1480px] mx-auto flex flex-col md:flex-1 md:min-h-0">
          <div className="flex-shrink-0 flex flex-col items-center gap-2 mb-4">
            {slide.badge && (
              <span
                className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-white text-[12px] md:text-[14px] font-bold"
                style={{ background: HEADER_GRADIENT, boxShadow: '0 8px 22px rgba(124,58,237,0.35)' }}
              >
                <Icon name={slide.badgeIcon ?? 'Box'} size={16} className="flex-shrink-0" />
                {slide.badge}
              </span>
            )}
            <h2 className="text-[26px] sm:text-3xl md:text-[46px] font-black leading-tight tracking-tight text-center text-[#1e1b4b]">
              {slide.title}
            </h2>
            {slide.subtitle && (
              <p className="text-[12.5px] md:text-[18px] font-medium leading-snug max-w-[720px] text-center text-slate-500 px-2">
                {slide.subtitle}
              </p>
            )}
          </div>

          <div className="relative md:flex-1 md:min-h-0 grid gap-5 lg:gap-[86px] lg:grid-cols-2">
            {cards.map((c, i) => (
              <Card key={c.title} card={c} index={i} />
            ))}

            <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 items-center justify-center">
              <span className="absolute w-[112px] h-[112px] rounded-full border border-dashed border-violet-200" />
              <span
                className="relative w-[78px] h-[78px] rounded-full bg-white flex items-center justify-center text-[21px] font-black text-violet-600"
                style={{ boxShadow: '0 10px 28px rgba(124,58,237,0.18)' }}
              >
                AI
              </span>
            </div>
          </div>

          {why.length > 0 && (
            <div
              className="flex-shrink-0 mt-4 rounded-[20px] sm:rounded-[24px] bg-white/60 border border-white px-3 sm:px-4 py-3 flex flex-col lg:flex-row items-center gap-3 org-in"
              style={{ boxShadow: '0 12px 32px rgba(124,58,237,0.08)', animationDelay: '520ms' }}
            >
              <div className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0 lg:pr-5 lg:border-r border-violet-100 self-start lg:self-auto">
                <div
                  className="w-[42px] h-[42px] sm:w-[52px] sm:h-[52px] rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg,#f5f3ff,#ede9fe)' }}
                >
                  <Icon name="Sparkles" size={24} className="text-violet-500" />
                </div>
                <p className="text-[15px] md:text-[19px] font-black text-violet-600 leading-tight whitespace-pre-line">
                  {slide.duoWhyTitle ?? 'Почему\nэто важно?'}
                </p>
              </div>

              <div className="w-full flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-2.5">
                {why.map((w, i) => (
                  <div
                    key={w.title}
                    className={`flex items-start gap-2.5 ${i > 0 ? 'lg:pl-4 lg:border-l border-violet-100' : ''}`}
                  >
                    <Icon name={w.icon ?? 'Target'} size={24} className="text-violet-500 flex-shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="text-[12px] md:text-[14.5px] font-bold text-slate-800 leading-tight">
                        {w.title}
                      </p>
                      {w.note && (
                        <p className="text-[10.5px] md:text-[12.5px] text-slate-500 leading-snug mt-0.5">
                          {w.note}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {slide.duoFooter && (
            <div className="flex-shrink-0 mt-3 flex justify-center">
              <span
                className="inline-flex items-center gap-2 rounded-full bg-white/80 border border-violet-100 px-4 sm:px-5 py-2 text-[11.5px] md:text-[15px] font-semibold text-slate-600 text-center org-in"
                style={{ boxShadow: '0 8px 22px rgba(124,58,237,0.08)', animationDelay: '640ms' }}
              >
                <Icon name="Star" size={16} className="text-violet-500 flex-shrink-0" />
                {slide.duoFooter}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DuoSlide;
