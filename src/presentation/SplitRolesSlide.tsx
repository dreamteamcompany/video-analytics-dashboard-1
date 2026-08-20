import { Slide } from './slides';
import Icon from '@/components/ui/icon';
import LightBackdrop from './LightBackdrop';

const HEADER_GRADIENT = 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 60%, #5b21b6 100%)';
const DANGER_GRADIENT = 'linear-gradient(135deg, #ef4444 0%, #dc2626 55%, #b91c1c 100%)';

const SplitRolesSlide = ({ slide }: { slide: Slide }) => {
  const facts = slide.splitFacts ?? [];
  const left = slide.splitLeft;
  const right = slide.splitRight;

  return (
    <div
      className="h-full flex flex-col overflow-hidden relative"
      style={{ background: 'linear-gradient(135deg, #ffffff 0%, #fdf6f6 40%, #f6f0fd 75%, #fdf0f7 100%)' }}
    >
      <LightBackdrop />

      <div className="relative z-10 flex-1 flex flex-col px-3 sm:px-6 lg:px-8 pt-3 md:pt-4 pb-12 md:pb-4 min-h-0 overflow-y-auto md:overflow-hidden">
        <div className="w-full max-w-[1280px] mx-auto flex flex-col flex-1 min-h-0 md:justify-center gap-1.5 md:gap-1.5">
          <div className="flex-shrink-0 flex flex-col items-center gap-1 md:gap-1 text-center">
            {slide.badge && (
              <span
                className="org-drop inline-flex items-center gap-1.5 md:gap-2 rounded-full px-3 py-1 md:px-4 md:py-1.5 text-white text-[11px] md:text-[14px] font-semibold"
                style={{ background: HEADER_GRADIENT, boxShadow: '0 6px 18px rgba(124,58,237,0.32)' }}
              >
                <Icon name={slide.badgeIcon ?? 'GitFork'} size={14} className="flex-shrink-0" />
                {slide.badge}
              </span>
            )}

            <h2 className="text-[18px] sm:text-[22px] md:text-[23px] font-black leading-tight tracking-tight text-[#1e1b4b]">
              {slide.title}
            </h2>

            {slide.subtitle && (
              <p className="text-[11.5px] sm:text-[12px] md:text-[12.5px] text-slate-500 leading-snug max-w-[900px]">
                {slide.subtitle}
              </p>
            )}
          </div>

          {facts.length > 0 && (
            <div
              className="org-in flex-shrink-0 rounded-2xl md:rounded-3xl px-3 py-2 md:px-4 md:py-2 border border-rose-200 bg-rose-50/80"
              style={{ boxShadow: '0 8px 26px rgba(220,38,38,0.12)', animationDelay: '140ms' }}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 md:px-3 md:py-0.5 text-white text-[10.5px] md:text-[12.5px] font-black uppercase tracking-wider"
                  style={{ background: DANGER_GRADIENT }}
                >
                  <Icon name="TriangleAlert" size={14} className="flex-shrink-0" />
                  {slide.splitFactsTitle ?? 'Что имеем сейчас'}
                </span>
                {slide.splitFactsNote && (
                  <p className="text-[11px] md:text-[12.5px] text-rose-700/80 font-semibold leading-snug">
                    {slide.splitFactsNote}
                  </p>
                )}
              </div>

              <div className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
                {facts.map((f, i) => (
                  <div
                    key={f.title}
                    className="org-in rounded-lg md:rounded-xl bg-white border border-rose-100 px-2.5 py-1.5 flex items-start gap-2"
                    style={{ boxShadow: '0 3px 12px rgba(220,38,38,0.08)', animationDelay: `${200 + i * 60}ms` }}
                  >
                    <div className="flex-shrink-0 w-6 h-6 md:w-8 md:h-8 rounded-md md:rounded-lg flex items-center justify-center bg-rose-100">
                      <Icon name={f.icon ?? 'X'} size={18} className="text-rose-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[12px] md:text-[13px] font-black text-slate-800 leading-tight">
                        {f.title}
                      </p>
                      {f.note && (
                        <p className="text-[10px] md:text-[11px] text-slate-500 leading-snug mt-0.5">
                          {f.note}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(left || right) && (
            <div className="flex-shrink-0 relative grid gap-2.5 md:gap-4 lg:grid-cols-2">
              {[left, right].filter(Boolean).map((side, si) => (
                <div
                  key={side!.role}
                  className="org-in relative rounded-2xl md:rounded-3xl bg-white/95 border border-violet-100 px-3 py-1.5 md:px-4 md:py-2 overflow-hidden"
                  style={{ boxShadow: '0 8px 26px rgba(124,58,237,0.12)', animationDelay: `${420 + si * 120}ms` }}
                >
                  <div className="flex items-center gap-2.5 md:gap-3">
                    {side!.photo ? (
                      <img
                        src={side!.photo}
                        alt={side!.name || side!.role}
                        className="w-9 h-9 md:w-10 md:h-10 rounded-full object-cover ring-2 ring-violet-200 flex-shrink-0"
                      />
                    ) : (
                      <div
                        className="flex-shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center"
                        style={{ background: HEADER_GRADIENT }}
                      >
                        <Icon name={side!.icon ?? 'User'} size={22} className="text-white" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-[14px] md:text-[16px] font-black text-slate-900 leading-tight">
                        {side!.role}
                      </p>
                      {side!.name && (
                        <p className="text-[11px] md:text-[14px] text-slate-500 leading-tight">
                          {side!.name}
                        </p>
                      )}
                    </div>
                  </div>

                  {side!.strong && side!.strong.length > 0 && (
                    <div className="mt-1 md:mt-1.5">
                      <p className="text-[9px] md:text-[11px] font-black uppercase tracking-wider text-emerald-600 mb-1">
                        {side!.strongTitle ?? 'Силён в этом'}
                      </p>
                      <div className="flex flex-wrap gap-1 md:gap-1.5">
                        {side!.strong.map((t) => (
                          <span
                            key={t}
                            className="text-[9.5px] md:text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {side!.cant && side!.cant.length > 0 && (
                    <div className="mt-1 md:mt-1.5">
                      <p className="text-[9px] md:text-[11px] font-black uppercase tracking-wider text-rose-600 mb-1">
                        {side!.cantTitle ?? 'Не может закрыть'}
                      </p>
                      <div className="space-y-0.5 md:space-y-1">
                        {side!.cant.map((t) => (
                          <div key={t} className="flex items-start gap-1.5">
                            <Icon name="X" size={13} className="text-rose-500 flex-shrink-0 mt-[2px]" />
                            <p className="text-[10.5px] md:text-[11.5px] text-slate-700 leading-snug">
                              {t}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              <div
                className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full items-center justify-center border-4 border-white"
                style={{ background: DANGER_GRADIENT, boxShadow: '0 8px 22px rgba(220,38,38,0.4)' }}
              >
                <Icon name="X" size={24} className="text-white" />
              </div>
            </div>
          )}

          {slide.splitAnalogy && (
            <div
              className="org-in flex-shrink-0 rounded-2xl md:rounded-3xl px-3 py-1.5 md:px-3.5 md:py-1.5 border border-violet-200"
              style={{
                background: 'linear-gradient(120deg, #f5f3ff 0%, #ede9fe 100%)',
                boxShadow: '0 8px 24px rgba(124,58,237,0.12)',
                animationDelay: '640ms',
              }}
            >
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span
                  className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 md:px-3 md:py-1 text-white text-[10px] md:text-[12.5px] font-black uppercase tracking-wider"
                  style={{ background: HEADER_GRADIENT }}
                >
                  <Icon name="Repeat" size={13} className="flex-shrink-0" />
                  {slide.splitAnalogy.label ?? 'Та же логика'}
                </span>
                <p className="text-[11px] md:text-[14px] font-black text-[#1e1b4b] leading-snug min-w-0">
                  {slide.splitAnalogy.title}
                </p>
              </div>

              <div className="relative grid gap-2 lg:grid-cols-2">
                {slide.splitAnalogy.items.map((it) => (
                  <div
                    key={it.role}
                    className="relative rounded-xl md:rounded-2xl bg-white/95 border border-violet-100 px-2.5 py-1.5 md:px-3 md:py-1.5 overflow-hidden"
                    style={{ boxShadow: '0 6px 20px rgba(124,58,237,0.1)' }}
                  >
                    <div className="flex items-center gap-2.5">
                      {it.photo ? (
                        <img
                          src={it.photo}
                          alt={it.name || it.role}
                          className="w-9 h-9 md:w-10 md:h-10 rounded-full object-cover ring-2 ring-violet-200 flex-shrink-0"
                        />
                      ) : (
                        <div
                          className="w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ background: HEADER_GRADIENT }}
                        >
                          <Icon name={it.icon ?? 'User'} size={20} className="text-white" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-[12px] md:text-[15px] font-black text-slate-900 leading-tight">
                          {it.role}
                        </p>
                        {it.name && (
                          <p className="text-[10px] md:text-[12.5px] text-slate-500 leading-tight">{it.name}</p>
                        )}
                      </div>
                    </div>

                    {it.strong && it.strong.length > 0 && (
                      <div className="mt-1">
                        <p className="text-[9px] md:text-[10.5px] font-black uppercase tracking-wider text-emerald-600 mb-1">
                          {it.strongTitle ?? 'Его зона'}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {it.strong.map((t) => (
                            <span
                              key={t}
                              className="text-[9.5px] md:text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {it.cant && it.cant.length > 0 && (
                      <div className="mt-1">
                        <p className="text-[9px] md:text-[10.5px] font-black uppercase tracking-wider text-rose-600 mb-0.5">
                          {it.cantTitle ?? 'Не может закрыть'}
                        </p>
                        <div className="space-y-0.5">
                          {it.cant.map((t) => (
                            <div key={t} className="flex items-start gap-1.5">
                              <Icon name="X" size={12} className="text-rose-500 flex-shrink-0 mt-[2px]" />
                              <p className="text-[10px] md:text-[11.5px] text-slate-700 leading-snug">{t}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {it.note && (
                      <p className="text-[10px] md:text-[11px] text-slate-600 leading-snug mt-1">{it.note}</p>
                    )}
                  </div>
                ))}

                <div
                  className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full items-center justify-center border-4 border-white"
                  style={{ background: HEADER_GRADIENT, boxShadow: '0 6px 18px rgba(124,58,237,0.4)' }}
                >
                  <Icon name="ArrowLeftRight" size={16} className="text-white" />
                </div>
              </div>

              {slide.splitAnalogy.note && (
                <p className="text-[10px] md:text-[11.5px] text-violet-700/80 font-semibold leading-snug mt-1">
                  {slide.splitAnalogy.note}
                </p>
              )}
            </div>
          )}

          {slide.splitResult && (
            <div
              className="org-in flex-shrink-0 rounded-2xl md:rounded-3xl px-3.5 py-1.5 md:px-5 md:py-2 text-center"
              style={{ background: HEADER_GRADIENT, boxShadow: '0 10px 30px rgba(124,58,237,0.35)', animationDelay: '700ms' }}
            >
              <p className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.16em] text-white/70">
                {slide.splitResultLabel ?? 'Вывод'}
              </p>
              <p className="text-[13px] sm:text-[15px] md:text-[16.5px] font-black text-white leading-snug">
                {slide.splitResult}
              </p>
              {slide.splitResultNote && (
                <p className="text-[10.5px] md:text-[13px] text-white/80 leading-snug mt-0.5">
                  {slide.splitResultNote}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SplitRolesSlide;
