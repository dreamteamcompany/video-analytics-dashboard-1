import { Slide } from './slides';
import Icon from '@/components/ui/icon';
import { useIsMobile } from '@/hooks/use-mobile';
import { CARD_SHADOW, HEADER_GRADIENT, LINE_COLOR, COLUMN_ICONS, parseMoney, formatMoney, useDutiesToggle } from './orgShared';
import { DutiesOverlay } from './OrgOverlays';
import { PersonCard, StatCard } from './OrgCards';
import OrgBackdrop from './OrgBackdrop';

const OrgSlide = ({ slide }: { slide: Slide }) => {
  const isMobile = useIsMobile();
  const headDuties = useDutiesToggle(!!slide.head?.duties?.length);
  const allPeople = slide.columns?.flatMap((c) => c.people) ?? [];
  const total = allPeople.filter((p) => !p.cut).length + (slide.head ? 1 : 0);
  const vacancies = allPeople.filter((p) => p.vacancy && !p.cut).length;
  const colCount = slide.columns?.length ?? 3;
  const statsIndex = isMobile ? colCount - 1 : colCount >= 4 ? 2 : colCount >= 3 ? 1 : 0;
  const statsWidth = isMobile ? 'w-full' : colCount >= 4 ? 'w-full' : colCount >= 3 ? 'md:w-[calc(160%+1.5rem)]' : 'w-full';
  const compactCols = !isMobile && colCount >= 4;
  const tightPayroll = compactCols || !!slide.workload;

  return (
  <div
    className="h-full flex flex-col overflow-hidden relative"
    style={{
      background: 'linear-gradient(135deg, #ffffff 0%, #fafaff 45%, #f3edfd 75%, #fdf0f7 100%)',
    }}
  >
    {/* Фоновые узоры */}
    <OrgBackdrop />
    <div className="relative z-10 flex-1 flex flex-col px-3 sm:px-10 pt-3 sm:pt-4 pb-6 md:pb-2 min-h-0 overflow-y-auto md:overflow-hidden">
      {/* Верхняя строка: бейдж + руководитель */}
      <div className="flex-shrink-0 relative flex flex-col md:block items-center md:items-start gap-3 md:gap-0 md:flex md:flex-row md:justify-center">
        {slide.badge && (
          <span
            className="md:absolute md:left-0 md:top-0 inline-flex items-center justify-center gap-2 md:gap-2.5 rounded-full px-4 py-2 md:px-6 md:py-3 text-white text-[13px] md:text-lg font-semibold w-full md:w-auto md:max-w-[30%] text-center"
            style={{
              background: HEADER_GRADIENT,
              boxShadow: '0 8px 24px rgba(124,58,237,0.35)',
            }}
          >
            <Icon name={slide.badgeIcon ?? 'Headphones'} size={16} className="flex-shrink-0 md:hidden" />
            <Icon name={slide.badgeIcon ?? 'Headphones'} size={20} className="flex-shrink-0 hidden md:block" />
            <span className="leading-snug">{slide.badge}</span>
          </span>
        )}

        {slide.head && (
          <div className="relative org-drop w-full md:w-auto z-0 hover:z-[60]">
            <div
              className="absolute left-1/2 -top-3.5 md:-top-4 -translate-x-1/2 w-9 h-9 md:w-11 md:h-11 rounded-full bg-white flex items-center justify-center z-10"
              style={{ boxShadow: '0 4px 14px rgba(124,58,237,0.22)' }}
            >
              <Icon name="Crown" size={18} className="text-violet-500 md:hidden" />
              <Icon name="Crown" size={22} className="text-violet-500 hidden md:block" />
            </div>
            <div
              ref={headDuties.ref}
              {...headDuties.handlers}
              className={`group relative rounded-3xl px-6 sm:px-20 pt-5 md:pt-4 pb-3 md:pb-2.5 text-center flex flex-col items-center ${slide.head.replace ? 'bg-rose-50 ring-1 ring-rose-200' : 'bg-white'} ${slide.head.duties?.length ? 'cursor-pointer' : ''}`}
              style={{ boxShadow: '0 8px 30px rgba(124,58,237,0.12), 0 2px 6px rgba(15,23,42,0.06)' }}
            >
              {slide.head.photo && (
                <img
                  src={slide.head.photo}
                  alt={slide.head.name || slide.head.role}
                  className={`w-12 h-12 md:w-14 md:h-14 rounded-full object-cover ring-2 mb-1.5 ${slide.head.replace ? 'ring-rose-300' : 'ring-violet-200'}`}
                />
              )}
              <p className="text-lg md:text-3xl font-bold text-slate-800 leading-tight">
                {slide.head.role}
              </p>
              {slide.head.name && (
                slide.head.vacancy ? (
                  <span className="text-[11px] md:text-sm font-semibold text-white px-2.5 md:px-3 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 whitespace-nowrap mt-1.5">
                    {slide.head.name}
                  </span>
                ) : (
                  <p className="text-sm md:text-xl text-slate-500 leading-tight mt-1">
                    {slide.head.name}
                  </p>
                )
              )}
              {slide.head.note && (
                <span
                  className={`text-[10px] md:text-sm font-semibold text-white px-2.5 md:px-3 py-0.5 md:py-1 rounded-full leading-snug mt-1.5 ${
                    slide.head.replace
                      ? 'bg-gradient-to-r from-rose-500 to-red-500'
                      : 'bg-gradient-to-r from-amber-500 to-orange-500'
                  }`}
                >
                  {slide.head.note}
                </span>
              )}
              {slide.head.salaryWas && (
                <span className="relative inline-flex items-center mt-1.5">
                  <span className="text-xs md:text-lg font-semibold text-slate-400">
                    {slide.head.salaryWas}
                  </span>
                  <span
                    className="pointer-events-none absolute left-[-4%] right-[-4%] top-1/2 h-[2px] rounded-full rotate-[-2deg]"
                    style={{ background: 'linear-gradient(90deg, rgba(239,68,68,0) 0%, #ef4444 12%, #dc2626 50%, #ef4444 88%, rgba(239,68,68,0) 100%)' }}
                  />
                </span>
              )}
              <p className={`text-base md:text-2xl font-bold leading-tight mt-1.5 flex items-center gap-2 ${slide.head.replace ? 'text-rose-600' : 'text-violet-600'}`}>
                {slide.head.salary}
                {slide.head.salaryWas && (
                  <span className="text-[10px] md:text-sm font-black uppercase tracking-wider text-white px-2 py-0.5 rounded-full bg-emerald-500">
                    −{formatMoney(parseMoney(slide.head.salaryWas) - parseMoney(slide.head.salary))} ₽
                  </span>
                )}
              </p>
              {slide.head.salaryNote && (
                <p className="text-[10px] md:text-xs text-slate-400 leading-tight mt-0.5">
                  {slide.head.salaryNote}
                </p>
              )}

              {slide.head.duties && slide.head.duties.length > 0 && (
                <>
                  <span className="absolute top-2 right-2 opacity-40">
                    <Icon name="Info" size={14} className="text-violet-400" />
                  </span>
                  {headDuties.open && (
                    <DutiesOverlay title={slide.head.role} duties={slide.head.duties} />
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Скруглённая разводка линий к колонкам */}
      <div className="flex-shrink-0 relative h-5 sm:h-8">
        <div
          className="absolute left-1/2 top-0 h-1/2 w-[2px] -translate-x-1/2"
          style={{ background: LINE_COLOR }}
        />
        {colCount > 1 && !isMobile && (
          <div
            className="absolute top-1/2 bottom-[11px] rounded-t-2xl border-l-2 border-r-2 border-t-2"
            style={{
              borderColor: LINE_COLOR,
              left: `${50 / colCount}%`,
              right: `${50 / colCount}%`,
            }}
          />
        )}
        {(isMobile || colCount % 2 === 1) && (
          <div
            className="absolute left-1/2 top-1/2 bottom-[11px] w-[2px] -translate-x-1/2"
            style={{ background: LINE_COLOR }}
          />
        )}
        <div
          className="absolute inset-0 grid"
          style={{ gridTemplateColumns: `repeat(${isMobile ? 1 : colCount}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: isMobile ? 1 : colCount }, (_, i) => i).map((i) => (
            <div key={i} className="relative flex justify-center">
              <div
                className="absolute bottom-0 w-0 h-0 border-x-[7px] border-x-transparent border-t-[11px]"
                style={{ borderTopColor: LINE_COLOR }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Колонки линий */}
      <div
        className="flex-1 grid grid-cols-1 gap-4 sm:gap-6 min-h-0"
        style={{ gridTemplateColumns: `repeat(${isMobile ? 1 : colCount}, minmax(0, 1fr))` }}
      >
        {slide.columns?.map((col, ci) => (
          <div key={`${col.title}-${ci}`} className="flex flex-col min-w-0">
            {/* Заголовок линии */}
            <div
              className="rounded-full py-2 md:py-2.5 px-4 md:px-6 flex items-center justify-center gap-2 md:gap-2.5 mb-2.5 org-drop"
              style={{
                background: HEADER_GRADIENT,
                boxShadow: '0 8px 22px rgba(99,102,241,0.28)',
                animationDelay: `${250 + ci * 110}ms`,
              }}
            >
              <Icon name={col.icon ?? COLUMN_ICONS[ci] ?? 'Circle'} size={16} className="text-white/90 md:hidden flex-shrink-0" />
              <Icon name={col.icon ?? COLUMN_ICONS[ci] ?? 'Circle'} size={20} className="text-white/90 hidden md:block flex-shrink-0" />
              <p className="text-[13px] md:text-xl font-semibold text-white text-center leading-snug">{col.title}</p>
            </div>

            {/* Карточки сотрудников */}
            <div className="space-y-2">
              {col.people.map((p, i) => (
                <PersonCard key={i} {...p} compact={compactCols} delay={500 + ci * 120 + i * 110} />
              ))}
            </div>

            {col.subBlocks && col.subBlocks.length > 0 && (
              <>
                <div className="relative h-5 sm:h-8 flex-shrink-0">
                  <div
                    className="absolute left-1/2 top-0 h-1/2 w-[2px] -translate-x-1/2"
                    style={{ background: LINE_COLOR }}
                  />
                  <div
                    className="absolute top-1/2 bottom-[11px] rounded-t-2xl border-l-2 border-r-2 border-t-2"
                    style={{
                      borderColor: LINE_COLOR,
                      left: `${50 / (isMobile ? 2 : col.subBlocks.length)}%`,
                      right: `${50 / (isMobile ? 2 : col.subBlocks.length)}%`,
                    }}
                  />
                  {!isMobile && col.subBlocks.length % 2 === 1 && (
                    <div
                      className="absolute left-1/2 top-1/2 bottom-[11px] w-[2px] -translate-x-1/2"
                      style={{ background: LINE_COLOR }}
                    />
                  )}
                  <div
                    className="absolute inset-0 grid"
                    style={{ gridTemplateColumns: `repeat(${isMobile ? 2 : col.subBlocks.length}, minmax(0, 1fr))` }}
                  >
                    {Array.from({ length: isMobile ? 2 : col.subBlocks.length }, (_, i) => i).map((i) => (
                      <div key={i} className="relative flex justify-center">
                        <div
                          className="absolute bottom-0 w-0 h-0 border-x-[7px] border-x-transparent border-t-[11px]"
                          style={{ borderTopColor: LINE_COLOR }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div
                  className="grid gap-2 md:gap-3"
                  style={{ gridTemplateColumns: `repeat(${isMobile ? 2 : col.subBlocks.length}, minmax(0, 1fr))` }}
                >
                  {col.subBlocks.map((sb, si) => (
                    <div
                      key={sb.title}
                      className="rounded-2xl bg-white/90 px-3 md:px-5 py-3 md:py-4 flex flex-col items-center justify-center text-center gap-2 md:gap-3 org-in min-h-[92px] md:min-h-[clamp(150px,20vh,300px)]"
                      style={{ boxShadow: CARD_SHADOW, animationDelay: `${800 + si * 110}ms` }}
                    >
                      <div className="w-10 h-10 md:w-14 md:h-14 rounded-2xl bg-violet-50 flex items-center justify-center flex-shrink-0">
                        <Icon name={sb.icon ?? 'Server'} size={20} className="text-violet-500 md:hidden" />
                        <Icon name={sb.icon ?? 'Server'} size={28} className="text-violet-500 hidden md:block" />
                      </div>
                      <p className="text-[11px] md:text-lg font-semibold text-slate-700 leading-snug">
                        {sb.title}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Нагрузка на службу */}
            {ci === statsIndex && slide.workload && (
              <div className={`mt-auto pt-1.5 ${statsWidth}`}>
                <div
                  className="rounded-2xl px-3 md:px-4 py-2 org-drop"
                  style={{
                    background: 'linear-gradient(120deg, #fff7ed 0%, #ffedd5 100%)',
                    boxShadow: CARD_SHADOW,
                    animationDelay: '1100ms',
                  }}
                >
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Icon name="Activity" size={17} className="text-orange-600 flex-shrink-0" />
                    <p className="text-[10px] md:text-[14px] font-black uppercase tracking-wider text-orange-700">
                      Фактическая нагрузка на службу
                    </p>
                    <span className="ml-auto text-[10px] md:text-[13px] font-bold text-orange-700/70 whitespace-nowrap">
                      {total} сотрудников · {slide.columns?.length} линии
                    </span>
                  </div>
                  <div className="grid gap-1.5 md:gap-2 grid-cols-2">
                    {slide.workload.map((w, wi) => (
                      <div
                        key={wi}
                        className="rounded-xl bg-white/85 px-3 py-1.5 flex items-start gap-2"
                      >
                        <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                          <Icon name={w.icon ?? 'Activity'} size={20} className="text-orange-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[16px] md:text-[18px] font-black text-orange-600 leading-none">{w.value}</p>
                          <p className="text-[11px] md:text-[12.5px] font-bold text-slate-700 leading-tight mt-0.5">{w.label}</p>
                          {w.note && (
                            <p className="text-[9.5px] md:text-[11px] text-slate-500 leading-snug mt-0.5">{w.note}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Итоги в цифрах + ФОТ */}
            {ci === statsIndex && slide.payroll && (
              <div className={`${slide.workload ? 'pt-1.5' : `mt-auto ${compactCols ? 'pt-2' : 'pt-3'}`} ${statsWidth}`}>
                {slide.columns && !slide.workload && (
                  <div className={`flex gap-2 md:gap-3 ${compactCols ? 'mb-1.5' : 'mb-2'}`}>
                    <StatCard icon="Users" value={String(total)} label="сотрудников" delay={1200} compact={compactCols || !!slide.workload} />
                    <StatCard icon="Layers" value={String(slide.columns.length)} label={slide.columnsLabel ?? 'линии поддержки'} delay={1320} compact={compactCols || !!slide.workload} />
                    {vacancies > 0 && (
                      <StatCard icon="Search" value={String(vacancies)} label={vacancies === 1 ? 'вакансия' : 'вакансии'} delay={1440} compact={compactCols || !!slide.workload} />
                    )}
                  </div>
                )}
                {slide.orgCallout && (
                  <div
                    className={`relative rounded-2xl overflow-hidden org-drop ${compactCols ? 'mb-1.5 px-3 md:px-4 py-1.5' : 'mb-1.5 px-3.5 md:px-5 py-2'} flex items-center gap-2.5`}
                    style={{
                      background: 'linear-gradient(135deg, #059669 0%, #0d9488 55%, #0f766e 100%)',
                      boxShadow: '0 10px 26px rgba(5,150,105,0.28)',
                      animationDelay: '1480ms',
                    }}
                  >
                    <div className="flex-shrink-0 w-8 h-8 md:w-9 md:h-9 rounded-lg bg-white/20 flex items-center justify-center">
                      <Icon name={slide.orgCallout.icon ?? 'Handshake'} size={19} className="text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-black leading-tight text-[13px] md:text-[17px]">
                        {slide.orgCallout.title}
                      </p>
                      {slide.orgCallout.note && (
                        <p className="text-white/80 font-semibold leading-snug text-[10.5px] md:text-[13px] mt-0.5">
                          {slide.orgCallout.note}
                        </p>
                      )}
                    </div>
                  </div>
                )}
                <div
                  className={`relative rounded-3xl bg-white flex items-center overflow-hidden org-drop ${tightPayroll ? 'pl-3 md:pl-5 pr-16 md:pr-28 py-1.5 md:py-2 min-h-[52px] md:min-h-[clamp(52px,6vh,74px)]' : 'pl-4 md:pl-8 pr-24 md:pr-40 py-3 md:py-4 min-h-[76px] md:min-h-[clamp(96px,13vh,165px)]'}`}
                  style={{
                    boxShadow: CARD_SHADOW,
                    animationDelay: '1550ms',
                  }}
                >
                  <div className="min-w-0">
                    {slide.payrollWas && (
                      <div className="relative inline-flex items-center mb-0.5">
                        <p className={`font-bold text-slate-400 whitespace-nowrap ${tightPayroll ? 'text-xs md:text-[15px] xl:text-[18px]' : 'text-sm md:text-2xl'}`}>
                          ФОТ: {slide.payrollWas}
                        </p>
                        <span
                          className="pointer-events-none absolute left-[-2%] right-[-2%] top-1/2 h-[2.5px] rounded-full rotate-[-2deg]"
                          style={{ background: 'linear-gradient(90deg, rgba(239,68,68,0) 0%, #ef4444 10%, #dc2626 50%, #ef4444 90%, rgba(239,68,68,0) 100%)' }}
                        />
                      </div>
                    )}
                    <p className={`font-extrabold text-slate-900 whitespace-nowrap ${tightPayroll ? 'text-base md:text-[17px] xl:text-[20px]' : slide.payrollWas ? 'text-lg md:text-3xl' : 'text-lg md:text-4xl'}`}>
                      ФОТ: {slide.payroll}
                      {slide.payrollWas && (
                        <span className={`align-middle font-black uppercase tracking-wider text-white rounded-full bg-emerald-500 ${compactCols ? 'ml-1.5 text-[9.5px] md:text-[11px] xl:text-[12.5px] px-1.5 py-0.5' : 'ml-2 md:ml-3 text-[10px] md:text-sm px-2 py-0.5'}`}>
                          −{formatMoney(parseMoney(slide.payrollWas) - parseMoney(slide.payroll))} ₽
                        </span>
                      )}
                    </p>
                    {slide.payrollNote && (
                      <p className={`text-slate-500 mt-1 ${tightPayroll ? 'text-[10px] md:text-[11.5px] xl:text-[13px] leading-snug' : 'text-[11px] md:text-sm'}`}>{slide.payrollNote}</p>
                    )}
                  </div>
                  {!tightPayroll && (
                    <img
                      src="/coins-3d.png"
                      alt=""
                      className="absolute right-3 md:right-8 top-1/2 -translate-y-1/2 w-16 md:w-32 object-contain pointer-events-none"
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
  );
};

export default OrgSlide;
