import Icon from '@/components/ui/icon';
import { CARD_SHADOW, PILL_GRADIENT, useDutiesToggle } from './orgShared';
import { DutiesOverlay, RisksOverlay } from './OrgOverlays';

const PersonCard = ({ role, name, note, tag, salary, vacancy, photo, lead, logo, big, replace, duties, cut, cutLabel, cutTone, risks, compact, delay = 0 }: {
  role: string; name?: string; note?: string; tag?: string; salary: string; vacancy?: boolean; photo?: string; lead?: boolean; logo?: string; big?: boolean; replace?: boolean; duties?: string[]; cut?: boolean; cutLabel?: string; cutTone?: 'red' | 'amber'; risks?: string[]; compact?: boolean; delay?: number;
}) => {
  const { open, ref, handlers } = useDutiesToggle(!!duties?.length || !!risks?.length);
  const showRisks = cut && !!risks?.length;
  const amber = cutTone === 'amber';
  const strokeColor = amber ? '#f59e0b' : '#ef4444';
  const strokeGrad = `linear-gradient(90deg, ${amber ? 'rgba(245,158,11,0)' : 'rgba(239,68,68,0)'} 0%, ${strokeColor} 12%, ${amber ? '#d97706' : '#dc2626'} 50%, ${strokeColor} 88%, ${amber ? 'rgba(245,158,11,0)' : 'rgba(239,68,68,0)'} 100%)`;
  return (
  <div
    ref={ref}
    {...handlers}
    className={`group relative flex min-w-0 rounded-2xl backdrop-blur-sm px-3 md:px-4 py-3 org-in ${compact ? 'flex-row flex-wrap items-center gap-x-2.5 gap-y-1' : 'flex-row items-center gap-3 md:gap-4'} transition-transform duration-300 md:hover:scale-[1.02] min-h-[72px] md:min-h-[var(--mh)] ${duties?.length || risks?.length ? 'cursor-pointer' : ''} ${
      cut
        ? `bg-slate-100/85 ring-2 ${amber ? 'ring-amber-500' : 'ring-red-500'} [&_img]:grayscale [&_p]:text-slate-400`
        : replace
          ? 'bg-rose-50/90 ring-1 ring-rose-200'
          : 'bg-white/90'
    }`}
    style={{
      boxShadow: CARD_SHADOW,
      animationDelay: `${delay}ms`,
      ['--mh' as string]: big ? 'clamp(120px, 16vh, 240px)' : compact ? 'clamp(66px, 9vh, 128px)' : 'clamp(80px, 10.5vh, 160px)',
    }}
  >
    <div className="relative flex-shrink-0">
      {logo ? (
        <div className={`${big ? 'w-20 h-14 md:w-32 md:h-20' : 'w-14 h-10 md:w-20 md:h-14'} rounded-xl bg-white flex items-center justify-center px-2 ring-1 ring-slate-200`}>
          <img src={logo} alt={role} className="max-w-full max-h-full object-contain" />
        </div>
      ) : photo ? (
        <img
          src={photo}
          alt={name || role}
          className={`${big ? 'w-14 h-14 md:w-24 md:h-24' : compact ? 'w-10 h-10 md:w-12 md:h-12 xl:w-14 xl:h-14' : 'w-11 h-11 md:w-14 md:h-14'} rounded-full object-cover ring-2 ${lead ? 'ring-amber-300' : replace ? 'ring-rose-300' : 'ring-violet-200'}`}
        />
      ) : (
        <div className={`${big ? 'w-14 h-14 md:w-24 md:h-24' : compact ? 'w-10 h-10 md:w-12 md:h-12' : 'w-11 h-11 md:w-14 md:h-14'} rounded-full flex items-center justify-center ${replace ? 'bg-rose-100' : 'bg-violet-50'} ${lead ? 'ring-2 ring-amber-300' : ''}`}>
          <Icon name={replace ? 'UserMinus' : vacancy ? 'UserPlus' : 'User'} size={big ? 28 : 22} className={`${replace ? 'text-rose-500' : 'text-violet-500'} md:hidden`} />
          <Icon name={replace ? 'UserMinus' : vacancy ? 'UserPlus' : 'User'} size={big ? 44 : 26} className={`${replace ? 'text-rose-500' : 'text-violet-500'} hidden md:block`} />
        </div>
      )}
      {lead && (
        <div
          className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-white flex items-center justify-center"
          style={{ boxShadow: '0 3px 10px rgba(124,58,237,0.25)' }}
        >
          <Icon name="Crown" size={15} className="text-amber-500" />
        </div>
      )}
    </div>

    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 flex-wrap">
        <p className={`${big ? 'text-sm md:text-2xl' : compact ? 'text-[12.5px] md:text-[14px] xl:text-[16px]' : 'text-[13px] md:text-base'} font-semibold text-slate-800 leading-snug`}>
          {role}
        </p>
        {tag && (
          <span
            className="text-[10px] md:text-xs font-semibold text-white px-2 md:px-2.5 py-0.5 rounded-full whitespace-nowrap"
            style={{ background: PILL_GRADIENT }}
          >
            {tag}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2 flex-wrap mt-0.5">
        {name && (
          replace ? (
            <span className={`${big ? 'text-xs md:text-xl' : 'text-xs md:text-base'} leading-snug font-medium text-rose-700`}>{name}</span>
          ) : vacancy ? (
            <span className="text-[10px] md:text-xs font-semibold text-white px-2 md:px-2.5 py-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 whitespace-nowrap">
              {name}
            </span>
          ) : (
            <span className={`${big ? 'text-xs md:text-xl' : 'text-xs md:text-base'} leading-snug text-slate-500`}>{name}</span>
          )
        )}
        {note && (
          <span className={`${big ? 'text-[10px] px-2 py-0.5 md:text-base md:px-4 md:py-1' : 'text-[10px] px-2 py-0.5 md:text-xs md:px-2.5'} font-semibold text-white rounded-full leading-snug bg-gradient-to-r ${replace ? 'from-rose-500 to-red-500' : 'from-emerald-500 to-teal-500 whitespace-nowrap'}`}>
            {note}
          </span>
        )}
      </div>
    </div>

    <div
      className={`rounded-full text-white font-semibold whitespace-nowrap flex-shrink-0 ${big ? 'px-2.5 py-1 text-[11px] md:px-5 md:py-2.5 md:text-xl' : compact ? 'w-full text-center px-2.5 py-0.5 text-[11px] md:px-3 md:py-1 md:text-[13px] xl:text-[15px] xl:py-1.5' : 'px-2.5 py-1 text-[11px] md:px-3.5 md:py-1.5 md:text-sm'}`}
      style={{ background: PILL_GRADIENT }}
    >
      {salary}
    </div>

    {cut && (
      <>
        <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
          <span
            className="absolute left-[3%] right-[3%] top-1/2 h-[3px] rounded-full origin-center rotate-[3.2deg]"
            style={{ background: strokeGrad }}
          />
          <span
            className="absolute left-[3%] right-[3%] top-1/2 h-[3px] rounded-full origin-center -rotate-[3.2deg]"
            style={{ background: strokeGrad }}
          />
        </span>
        <span className={`absolute -top-2 left-3 z-10 text-[9px] md:text-[11px] font-black uppercase tracking-wider text-white px-2 py-0.5 rounded-full shadow-md flex items-center gap-1 ${amber ? 'bg-amber-500' : 'bg-red-600'}`}>
          <Icon name={amber ? 'Clock' : 'Ban'} size={11} />
          {cutLabel || 'Сокращено'}
        </span>
      </>
    )}

    {(duties?.length || risks?.length) ? (
      <>
        <span className={`absolute top-1.5 right-1.5 ${showRisks ? 'opacity-90 alarm-pulse' : 'opacity-40'}`}>
          <Icon name={showRisks ? 'TriangleAlert' : 'Info'} size={13} className={showRisks ? (amber ? 'text-amber-500' : 'text-red-500') : 'text-violet-400'} />
        </span>
        {open && (showRisks
          ? <RisksOverlay title={role} risks={risks!} />
          : duties?.length ? <DutiesOverlay title={role} duties={duties} /> : null)}
      </>
    ) : null}
  </div>
  );
};

const StatCard = ({ icon, value, label, delay, compact }: {
  icon: string; value: string; label: string; delay: number; compact?: boolean;
}) => (
  <div
    className={`flex-1 min-w-0 rounded-2xl bg-white/90 py-2 flex items-center org-drop min-h-[52px] ${compact ? 'px-2 md:px-3 xl:px-4 gap-1.5 xl:gap-2.5' : 'px-3 md:px-5 gap-2 md:gap-3'} ${compact ? 'md:min-h-[clamp(50px,7vh,90px)]' : 'md:min-h-[clamp(58px,8vh,110px)]'}`}
    style={{
      boxShadow: CARD_SHADOW,
      animationDelay: `${delay}ms`,
    }}
  >
    <Icon name={icon} size={20} className="text-violet-500 flex-shrink-0 md:hidden" />
    <Icon name={icon} size={compact ? 20 : 26} className="text-violet-500 flex-shrink-0 hidden md:block" />
    <div className="min-w-0">
      <p className={`font-bold text-violet-600 leading-none ${compact ? 'text-base md:text-xl xl:text-2xl' : 'text-lg md:text-2xl'}`}>{value}</p>
      <p className={`text-slate-500 leading-tight mt-0.5 ${compact ? 'text-[10px] md:text-[12px] xl:text-[14px]' : 'text-[11px] md:text-sm'}`}>{label}</p>
    </div>
  </div>
);

export { PersonCard, StatCard };
