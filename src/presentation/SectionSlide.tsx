import { Slide } from './slides';
import Icon from '@/components/ui/icon';

const HEADER_GRADIENT = 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 60%, #5b21b6 100%)';

const SectionSlide = ({ slide }: { slide: Slide }) => {
  const items = slide.sectionItems ?? [];

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
          className="absolute -bottom-24 -right-24 w-[30rem] h-[30rem] rounded-full"
          style={{
            background: 'repeating-radial-gradient(circle, rgba(236,72,153,0.16) 0 1.4px, transparent 1.4px 18px)',
            maskImage: 'radial-gradient(circle, #000 10%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(circle, #000 10%, transparent 70%)',
          }}
        />
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-10 py-8 md:py-6 overflow-y-auto md:overflow-hidden">
        <div className="w-full max-w-[1100px] flex flex-col items-center text-center">
          {slide.badge && (
            <span
              className="org-drop inline-flex items-center gap-2 rounded-full px-5 py-2 text-white text-[12px] md:text-[14px] font-bold"
              style={{ background: HEADER_GRADIENT, boxShadow: '0 8px 22px rgba(124,58,237,0.35)' }}
            >
              <Icon name={slide.badgeIcon ?? 'Sparkles'} size={16} className="flex-shrink-0" />
              {slide.badge}
            </span>
          )}

          <h2 className="org-drop mt-6 text-[30px] sm:text-[42px] md:text-[58px] font-black leading-[1.05] tracking-tight text-[#1e1b4b]">
            {slide.title}
          </h2>

          <span className="mt-4 w-24 h-[5px] rounded-full" style={{ background: HEADER_GRADIENT }} />

          {slide.subtitle && (
            <p className="mt-4 text-[13px] md:text-[19px] font-medium text-slate-500 max-w-[760px] leading-snug">
              {slide.subtitle}
            </p>
          )}

          {items.length > 0 && (
            <div className="mt-7 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {items.map((it, i) => (
                <div
                  key={it.title}
                  className="org-in flex items-center gap-3 rounded-2xl bg-white/70 border border-white px-4 py-3 text-left"
                  style={{ boxShadow: '0 10px 26px rgba(124,58,237,0.08)', animationDelay: `${220 + i * 70}ms` }}
                >
                  <span
                    className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg,#f5f3ff,#ede9fe)' }}
                  >
                    <Icon name={it.icon ?? 'Sparkles'} size={20} className="text-violet-500" />
                  </span>
                  <p className="min-w-0 text-[12.5px] md:text-[15px] font-semibold text-slate-700 leading-snug">
                    {it.title}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SectionSlide;