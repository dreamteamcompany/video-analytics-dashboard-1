const V1 = '#c4b5fd';
const V2 = '#a78bfa';
const V3 = '#8b5cf6';
const GLASS = '#ede9fe';

const ChartArt = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none">
    <rect x="26" y="18" width="136" height="150" rx="18" fill="white" opacity="0.85" />
    <rect x="26" y="18" width="136" height="150" rx="18" fill={GLASS} opacity="0.75" />
    <rect x="42" y="34" width="60" height="9" rx="4.5" fill={V1} opacity="0.75" />
    <rect x="42" y="50" width="96" height="9" rx="4.5" fill={V1} opacity="0.45" />
    <rect x="46" y="106" width="20" height="44" rx="7" fill={V1} opacity="0.85" />
    <rect x="76" y="88" width="20" height="62" rx="7" fill={V2} opacity="0.8" />
    <rect x="106" y="70" width="20" height="80" rx="7" fill={V3} opacity="0.7" />
    <path d="M50 128 L80 108 L108 118 L142 78" stroke={V3} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="80" cy="108" r="7" fill="white" stroke={V3} strokeWidth="5" />
    <circle cx="142" cy="78" r="8" fill={V3} />
    <rect x="128" y="120" width="52" height="52" rx="16" fill="white" opacity="0.9" />
    <rect x="128" y="120" width="52" height="52" rx="16" fill={V2} opacity="0.35" />
    <path d="M144 158 L166 136" stroke={V3} strokeWidth="6" strokeLinecap="round" />
    <path d="M152 134 H168 V150" stroke={V3} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ProfileArt = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none">
    <rect x="30" y="16" width="140" height="158" rx="20" fill="white" opacity="0.85" />
    <rect x="30" y="16" width="140" height="158" rx="20" fill={GLASS} opacity="0.7" />
    <circle cx="66" cy="54" r="18" fill={V2} opacity="0.85" />
    <rect x="94" y="42" width="60" height="10" rx="5" fill={V1} opacity="0.8" />
    <rect x="94" y="60" width="42" height="10" rx="5" fill={V1} opacity="0.5" />
    <rect x="48" y="88" width="106" height="9" rx="4.5" fill={V1} opacity="0.45" />
    <rect x="48" y="105" width="82" height="9" rx="4.5" fill={V1} opacity="0.35" />
    <rect x="48" y="122" width="60" height="9" rx="4.5" fill={V1} opacity="0.3" />
    <circle cx="140" cy="138" r="34" fill="white" opacity="0.95" />
    <circle cx="140" cy="138" r="28" stroke={V1} strokeWidth="14" opacity="0.55" />
    <path
      d="M140 110 a28 28 0 0 1 24 42"
      stroke={V3}
      strokeWidth="14"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);

const FlowArt = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none">
    <rect x="20" y="30" width="72" height="52" rx="16" fill="white" opacity="0.9" />
    <rect x="20" y="30" width="72" height="52" rx="16" fill={GLASS} opacity="0.8" />
    <rect x="34" y="46" width="44" height="8" rx="4" fill={V2} opacity="0.8" />
    <rect x="34" y="60" width="28" height="8" rx="4" fill={V1} opacity="0.6" />
    <rect x="108" y="30" width="72" height="52" rx="16" fill="white" opacity="0.9" />
    <rect x="108" y="30" width="72" height="52" rx="16" fill={GLASS} opacity="0.8" />
    <rect x="122" y="46" width="44" height="8" rx="4" fill={V2} opacity="0.6" />
    <rect x="122" y="60" width="34" height="8" rx="4" fill={V1} opacity="0.5" />
    <rect x="60" y="118" width="80" height="58" rx="18" fill="white" opacity="0.95" />
    <rect x="60" y="118" width="80" height="58" rx="18" fill={V2} opacity="0.28" />
    <path d="M84 148 l12 12 22 -26" stroke={V3} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M56 82 L92 118" stroke={V1} strokeWidth="5" strokeLinecap="round" />
    <path d="M144 82 L108 118" stroke={V1} strokeWidth="5" strokeLinecap="round" />
    <circle cx="100" cy="100" r="6" fill={V3} opacity="0.5" />
  </svg>
);

const ShieldArt = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none">
    <path
      d="M100 24 L162 50 V102 C162 140 132 166 100 178 C68 166 38 140 38 102 V50 Z"
      fill="white"
      opacity="0.9"
    />
    <path
      d="M100 24 L162 50 V102 C162 140 132 166 100 178 C68 166 38 140 38 102 V50 Z"
      fill={V2}
      opacity="0.3"
    />
    <path d="M76 100 l18 20 34 -42" stroke={V3} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const TileChart = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none">
    <rect x="22" y="52" width="13" height="30" rx="5" fill={V1} />
    <rect x="43" y="38" width="13" height="44" rx="5" fill={V2} />
    <rect x="64" y="24" width="13" height="58" rx="5" fill={V3} opacity="0.85" />
    <path d="M26 42 L46 26 L64 34 L82 16" stroke={V3} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="82" cy="16" r="7" fill={V3} />
  </svg>
);

const TileFlame = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none">
    <path
      d="M50 12 C64 30 78 40 78 58 a28 28 0 0 1 -56 0 C22 42 34 36 40 22 C44 34 48 38 50 12 Z"
      fill={V2}
    />
    <path d="M50 46 C58 56 62 60 62 66 a12 12 0 0 1 -24 0 C38 58 44 54 50 46 Z" fill="white" opacity="0.7" />
  </svg>
);

const TilePeople = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none">
    <circle cx="38" cy="34" r="14" fill={V2} />
    <path d="M14 78 a24 24 0 0 1 48 0 Z" fill={V2} opacity="0.75" />
    <circle cx="70" cy="40" r="11" fill={V3} opacity="0.65" />
    <path d="M52 78 a19 19 0 0 1 36 0 Z" fill={V3} opacity="0.5" />
  </svg>
);


const TileShield = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none">
    <path d="M50 12 L82 26 V52 c0 20 -14 32 -32 38 C32 84 18 72 18 52 V26 Z" fill={V2} />
    <path d="M38 52 l9 10 17 -22" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const TileDoc = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none">
    <rect x="24" y="14" width="52" height="72" rx="10" fill={V1} />
    <rect x="34" y="30" width="32" height="7" rx="3.5" fill="white" opacity="0.9" />
    <rect x="34" y="44" width="32" height="7" rx="3.5" fill="white" opacity="0.7" />
    <rect x="34" y="58" width="20" height="7" rx="3.5" fill="white" opacity="0.55" />
    <circle cx="72" cy="70" r="16" fill={V3} />
    <path d="M66 70 l5 5 9 -10" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const TileClock = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none">
    <circle cx="50" cy="50" r="34" fill={V1} />
    <circle cx="50" cy="50" r="24" fill="white" opacity="0.55" />
    <path d="M50 32 V52 l14 9" stroke={V3} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const TileBrain = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none">
    <rect x="24" y="24" width="52" height="52" rx="16" fill={V2} />
    <circle cx="40" cy="42" r="6" fill="white" />
    <circle cx="62" cy="42" r="6" fill="white" />
    <circle cx="50" cy="62" r="6" fill="white" opacity="0.85" />
    <path d="M40 42 L50 62 L62 42" stroke="white" strokeWidth="4" opacity="0.7" />
    <path d="M14 50 h10 M76 50 h10 M50 10 v10" stroke={V3} strokeWidth="6" strokeLinecap="round" />
  </svg>
);

const TileMoney = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none">
    <rect x="14" y="28" width="72" height="46" rx="12" fill={V1} />
    <circle cx="50" cy="51" r="14" fill="white" opacity="0.8" />
    <path d="M50 42 v18 M45 47 h10 M45 55 h10" stroke={V3} strokeWidth="4.5" strokeLinecap="round" />
  </svg>
);

const TileGear = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none">
    <path d="M50 14 l8 8 h11 v11 l8 8 -8 8 v11 h-11 l-8 8 -8 -8 h-11 v-11 l-8 -8 8 -8 v-11 h11 z" fill={V2} />
    <circle cx="50" cy="49" r="12" fill="white" opacity="0.85" />
  </svg>
);

const TILE_FAMILIES: [RegExp, (typeof TileChart)[]][] = [
  [/выгор|стресс|перегруз|нагруз|конфликт/i, [TileFlame]],
  [/безопас|защит|доступ|конфиденц|соглас|этик|контрол|риск/i, [TileShield]],
  [/документ|отч[её]т|протокол|заключ|бумаг|запис|карт|подпис|договор/i, [TileDoc]],
  [/врем|расписан|график|смен|срок|дедлайн|задержк|отпуск|окн[оа]/i, [TileClock]],
  [/ии|ai|модел|агент|алгоритм|прогноз|нейро|анализ|бот/i, [TileBrain]],
  [/деньг|финанс|бюджет|стоим|оплат|выручк|экономи|прайс|счет|счёт/i, [TileMoney]],
  [/интеграц|настрой|процесс|автомат|систем|сценар|этап|правил/i, [TileGear]],
  [/сотрудник|команд|персонал|пациент|клиент|hr|люд|врач|кадр/i, [TilePeople]],
  [/метрик|показател|статист|динамик|рост|kpi|график|план|цел/i, [TileChart]],
];

const ALL_TILES = [TileChart, TileFlame, TilePeople, TileShield, TileDoc, TileClock, TileBrain, TileMoney, TileGear];

const tileHash = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i += 1) h = (h * 33 + s.charCodeAt(i)) >>> 0;
  return h;
};

const tileCandidates = (text: string) => {
  const list: (typeof TileChart)[] = [];
  TILE_FAMILIES.forEach(([re, arr]) => {
    if (re.test(text)) arr.forEach((t) => !list.includes(t) && list.push(t));
  });
  return list;
};

export const CardTileArt = ({
  index,
  text = '',
  avoid = '',
  className = '',
}: {
  index: number;
  text?: string;
  avoid?: string;
  className?: string;
}) => {
  const mineList = tileCandidates(text);
  const otherList = avoid ? tileCandidates(avoid) : [];
  const otherPick = otherList.length ? otherList[tileHash(avoid) % otherList.length] : undefined;
  const free = mineList.filter((t) => t !== otherPick);
  const pool = free.length ? free : mineList.length ? mineList : ALL_TILES.filter((t) => t !== otherPick);
  const Tile = pool[(tileHash(text) + index) % pool.length];
  return <Tile className={className} />;
};

const DocArt = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none">
    <rect x="40" y="14" width="112" height="146" rx="18" fill="white" opacity="0.9" />
    <rect x="40" y="14" width="112" height="146" rx="18" fill={GLASS} opacity="0.75" />
    <rect x="58" y="36" width="70" height="10" rx="5" fill={V1} opacity="0.8" />
    <rect x="58" y="56" width="86" height="9" rx="4.5" fill={V1} opacity="0.5" />
    <rect x="58" y="74" width="60" height="9" rx="4.5" fill={V1} opacity="0.4" />
    <rect x="58" y="92" width="76" height="9" rx="4.5" fill={V1} opacity="0.35" />
    <circle cx="136" cy="140" r="38" fill="white" opacity="0.95" />
    <circle cx="136" cy="140" r="38" fill={V2} opacity="0.28" />
    <path d="M120 140 l12 13 22 -26" stroke={V3} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const MoneyArt = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none">
    <rect x="22" y="46" width="150" height="92" rx="20" fill="white" opacity="0.9" />
    <rect x="22" y="46" width="150" height="92" rx="20" fill={GLASS} opacity="0.8" />
    <circle cx="97" cy="92" r="30" fill={V2} opacity="0.55" />
    <path d="M97 74 v36 M85 84 h24 M85 100 h24" stroke="white" strokeWidth="8" strokeLinecap="round" />
    <rect x="36" y="60" width="26" height="12" rx="6" fill={V1} opacity="0.7" />
    <rect x="132" y="112" width="26" height="12" rx="6" fill={V1} opacity="0.7" />
    <path d="M140 44 L164 20" stroke={V3} strokeWidth="7" strokeLinecap="round" />
    <path d="M148 18 H166 V36" stroke={V3} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ClockArt = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none">
    <circle cx="100" cy="100" r="72" fill="white" opacity="0.9" />
    <circle cx="100" cy="100" r="72" fill={GLASS} opacity="0.8" />
    <circle cx="100" cy="100" r="54" fill="white" opacity="0.85" />
    <path d="M100 62 V102 l28 18" stroke={V3} strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="100" cy="28" r="7" fill={V2} opacity="0.7" />
    <circle cx="172" cy="100" r="7" fill={V2} opacity="0.5" />
    <circle cx="100" cy="172" r="7" fill={V2} opacity="0.4" />
    <circle cx="28" cy="100" r="7" fill={V2} opacity="0.5" />
  </svg>
);

const ShieldBigArt = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none">
    <path d="M100 18 L166 46 V104 C166 144 134 172 100 184 C66 172 34 144 34 104 V46 Z" fill="white" opacity="0.9" />
    <path d="M100 18 L166 46 V104 C166 144 134 172 100 184 C66 172 34 144 34 104 V46 Z" fill={V2} opacity="0.3" />
    <path d="M74 102 l19 21 35 -44" stroke={V3} strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="100" cy="100" r="76" stroke={V1} strokeWidth="4" opacity="0.35" />
  </svg>
);

const AlertArt = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none">
    <path d="M100 26 L176 162 H24 Z" fill="white" opacity="0.9" />
    <path d="M100 26 L176 162 H24 Z" fill={V2} opacity="0.32" />
    <rect x="92" y="76" width="16" height="46" rx="8" fill={V3} />
    <circle cx="100" cy="138" r="10" fill={V3} />
    <circle cx="164" cy="42" r="12" fill={V1} opacity="0.6" />
    <circle cx="34" cy="60" r="8" fill={V1} opacity="0.5" />
  </svg>
);

const BoxArt = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none">
    <path d="M100 22 L172 60 V138 L100 176 L28 138 V60 Z" fill="white" opacity="0.9" />
    <path d="M100 22 L172 60 V138 L100 176 L28 138 V60 Z" fill={GLASS} opacity="0.8" />
    <path d="M28 60 L100 98 L172 60" stroke={V2} strokeWidth="8" strokeLinejoin="round" />
    <path d="M100 98 V176" stroke={V2} strokeWidth="8" opacity="0.7" />
    <rect x="76" y="34" width="48" height="20" rx="10" fill={V3} opacity="0.55" />
  </svg>
);

const ChatArt = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none">
    <rect x="20" y="30" width="118" height="82" rx="22" fill="white" opacity="0.92" />
    <rect x="20" y="30" width="118" height="82" rx="22" fill={GLASS} opacity="0.8" />
    <path d="M50 112 L48 140 L78 112 Z" fill={GLASS} />
    <rect x="42" y="54" width="70" height="10" rx="5" fill={V1} opacity="0.8" />
    <rect x="42" y="74" width="46" height="10" rx="5" fill={V1} opacity="0.5" />
    <rect x="88" y="94" width="92" height="72" rx="22" fill="white" opacity="0.95" />
    <rect x="88" y="94" width="92" height="72" rx="22" fill={V2} opacity="0.3" />
    <rect x="106" y="116" width="56" height="10" rx="5" fill={V3} opacity="0.6" />
    <rect x="106" y="136" width="36" height="10" rx="5" fill={V3} opacity="0.4" />
  </svg>
);

const SearchArt = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none">
    <rect x="26" y="26" width="120" height="120" rx="26" fill="white" opacity="0.9" />
    <rect x="26" y="26" width="120" height="120" rx="26" fill={GLASS} opacity="0.75" />
    <rect x="48" y="52" width="60" height="9" rx="4.5" fill={V1} opacity="0.6" />
    <rect x="48" y="70" width="76" height="9" rx="4.5" fill={V1} opacity="0.4" />
    <circle cx="112" cy="112" r="38" fill="white" opacity="0.95" />
    <circle cx="112" cy="112" r="30" stroke={V3} strokeWidth="11" />
    <path d="M136 136 L170 170" stroke={V3} strokeWidth="14" strokeLinecap="round" />
  </svg>
);

const MedArt = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none">
    <rect x="28" y="42" width="144" height="116" rx="26" fill="white" opacity="0.9" />
    <rect x="28" y="42" width="144" height="116" rx="26" fill={GLASS} opacity="0.8" />
    <path d="M44 104 h30 l14 -30 l20 60 l14 -30 h34" stroke={V3} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="86" y="20" width="28" height="30" rx="10" fill={V2} opacity="0.7" />
  </svg>
);

const NetworkArt = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none">
    <circle cx="100" cy="100" r="30" fill="white" opacity="0.95" />
    <circle cx="100" cy="100" r="30" fill={V2} opacity="0.4" />
    <circle cx="38" cy="46" r="20" fill={V1} opacity="0.85" />
    <circle cx="164" cy="52" r="18" fill={V2} opacity="0.7" />
    <circle cx="46" cy="158" r="18" fill={V2} opacity="0.6" />
    <circle cx="158" cy="152" r="22" fill={V1} opacity="0.75" />
    <path d="M56 60 L82 86 M148 66 L120 88 M62 146 L84 118 M142 138 L118 116" stroke={V3} strokeWidth="6" strokeLinecap="round" opacity="0.6" />
  </svg>
);

const DocStackArt = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none">
    <rect x="24" y="40" width="100" height="130" rx="16" fill="white" opacity="0.8" />
    <rect x="24" y="40" width="100" height="130" rx="16" fill={GLASS} opacity="0.6" />
    <rect x="50" y="24" width="106" height="140" rx="16" fill="white" opacity="0.95" />
    <rect x="50" y="24" width="106" height="140" rx="16" fill={GLASS} opacity="0.75" />
    <rect x="68" y="48" width="66" height="10" rx="5" fill={V1} opacity="0.8" />
    <rect x="68" y="70" width="50" height="9" rx="4.5" fill={V1} opacity="0.5" />
    <rect x="68" y="88" width="72" height="9" rx="4.5" fill={V1} opacity="0.4" />
    <rect x="68" y="120" width="40" height="18" rx="9" fill={V3} opacity="0.6" />
  </svg>
);

const SignArt = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none">
    <rect x="30" y="30" width="132" height="120" rx="20" fill="white" opacity="0.92" />
    <rect x="30" y="30" width="132" height="120" rx="20" fill={GLASS} opacity="0.75" />
    <rect x="50" y="52" width="60" height="9" rx="4.5" fill={V1} opacity="0.6" />
    <path d="M52 118 C74 88 84 132 104 104 C118 86 128 116 150 96" stroke={V3} strokeWidth="9" strokeLinecap="round" fill="none" />
    <path d="M140 152 L170 122" stroke={V2} strokeWidth="12" strokeLinecap="round" />
    <path d="M164 116 L178 130 L170 140 L154 126 Z" fill={V3} />
  </svg>
);

const CoinsArt = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none">
    <ellipse cx="100" cy="150" rx="56" ry="20" fill={V1} opacity="0.8" />
    <rect x="44" y="118" width="112" height="32" fill={V1} opacity="0.8" />
    <ellipse cx="100" cy="118" rx="56" ry="20" fill={V2} opacity="0.85" />
    <ellipse cx="100" cy="88" rx="46" ry="17" fill={V2} opacity="0.6" />
    <ellipse cx="100" cy="58" rx="36" ry="14" fill={V3} opacity="0.5" />
    <path d="M100 30 v14" stroke={V3} strokeWidth="8" strokeLinecap="round" />
  </svg>
);

const CalendarArt = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none">
    <rect x="26" y="38" width="148" height="128" rx="22" fill="white" opacity="0.92" />
    <rect x="26" y="38" width="148" height="128" rx="22" fill={GLASS} opacity="0.7" />
    <rect x="26" y="38" width="148" height="34" rx="16" fill={V2} opacity="0.65" />
    <rect x="58" y="22" width="14" height="30" rx="7" fill={V3} />
    <rect x="128" y="22" width="14" height="30" rx="7" fill={V3} />
    <rect x="48" y="90" width="26" height="22" rx="8" fill={V1} opacity="0.7" />
    <rect x="88" y="90" width="26" height="22" rx="8" fill={V1} opacity="0.5" />
    <rect x="128" y="90" width="26" height="22" rx="8" fill={V3} opacity="0.55" />
    <rect x="48" y="124" width="26" height="22" rx="8" fill={V1} opacity="0.4" />
    <rect x="88" y="124" width="26" height="22" rx="8" fill={V1} opacity="0.55" />
    <rect x="128" y="124" width="26" height="22" rx="8" fill={V1} opacity="0.35" />
  </svg>
);

const LockArt = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none">
    <path d="M66 92 V66 a34 34 0 0 1 68 0 V92" stroke={V2} strokeWidth="16" strokeLinecap="round" fill="none" />
    <rect x="42" y="88" width="116" height="90" rx="24" fill="white" opacity="0.95" />
    <rect x="42" y="88" width="116" height="90" rx="24" fill={V2} opacity="0.35" />
    <circle cx="100" cy="126" r="14" fill={V3} />
    <rect x="93" y="132" width="14" height="26" rx="7" fill={V3} />
  </svg>
);

const ScaleArt = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none">
    <rect x="94" y="36" width="12" height="126" rx="6" fill={V2} />
    <rect x="60" y="162" width="80" height="14" rx="7" fill={V2} opacity="0.8" />
    <path d="M36 56 H164" stroke={V3} strokeWidth="10" strokeLinecap="round" />
    <circle cx="100" cy="34" r="12" fill={V3} />
    <path d="M36 56 L16 106 h40 Z" fill={V1} opacity="0.85" />
    <path d="M164 56 L144 106 h40 Z" fill={V1} opacity="0.6" />
  </svg>
);

const InventoryArt = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none">
    <rect x="24" y="30" width="152" height="18" rx="8" fill={V2} opacity="0.6" />
    <rect x="24" y="100" width="152" height="18" rx="8" fill={V2} opacity="0.6" />
    <rect x="24" y="164" width="152" height="16" rx="8" fill={V2} opacity="0.5" />
    <rect x="40" y="54" width="40" height="44" rx="10" fill={V1} opacity="0.85" />
    <rect x="92" y="62" width="34" height="36" rx="10" fill={V3} opacity="0.5" />
    <rect x="136" y="50" width="34" height="48" rx="10" fill={V1} opacity="0.6" />
    <rect x="44" y="126" width="46" height="36" rx="10" fill={V3} opacity="0.45" />
    <rect x="104" y="118" width="60" height="44" rx="10" fill={V1} opacity="0.75" />
  </svg>
);

const TruckArt = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none">
    <rect x="18" y="62" width="94" height="66" rx="14" fill="white" opacity="0.95" />
    <rect x="18" y="62" width="94" height="66" rx="14" fill={V2} opacity="0.4" />
    <path d="M112 82 h34 l26 30 v16 h-60 Z" fill={V1} opacity="0.85" />
    <rect x="18" y="128" width="154" height="12" rx="6" fill={V2} opacity="0.5" />
    <circle cx="60" cy="152" r="18" fill={V3} opacity="0.75" />
    <circle cx="60" cy="152" r="7" fill="white" />
    <circle cx="142" cy="152" r="18" fill={V3} opacity="0.75" />
    <circle cx="142" cy="152" r="7" fill="white" />
  </svg>
);

const FilterArt = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none">
    <path d="M28 38 H172 L118 102 V162 L82 138 V102 Z" fill="white" opacity="0.92" />
    <path d="M28 38 H172 L118 102 V162 L82 138 V102 Z" fill={V2} opacity="0.35" />
    <circle cx="150" cy="146" r="30" fill="white" opacity="0.95" />
    <circle cx="150" cy="146" r="30" fill={V1} opacity="0.5" />
    <path d="M138 146 l9 10 17 -20" stroke={V3} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const InboxArt = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none">
    <rect x="24" y="52" width="152" height="104" rx="22" fill="white" opacity="0.95" />
    <rect x="24" y="52" width="152" height="104" rx="22" fill={GLASS} opacity="0.8" />
    <path d="M24 70 L100 122 L176 70" stroke={V2} strokeWidth="10" strokeLinejoin="round" fill="none" />
    <circle cx="160" cy="56" r="22" fill={V3} opacity="0.85" />
    <path d="M154 56 h12 M160 50 v12" stroke="white" strokeWidth="6" strokeLinecap="round" />
  </svg>
);

const PhoneArt = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none">
    <rect x="62" y="16" width="76" height="168" rx="22" fill="white" opacity="0.95" />
    <rect x="62" y="16" width="76" height="168" rx="22" fill={GLASS} opacity="0.75" />
    <rect x="86" y="26" width="28" height="7" rx="3.5" fill={V1} />
    <rect x="76" y="52" width="48" height="10" rx="5" fill={V1} opacity="0.7" />
    <rect x="76" y="74" width="36" height="10" rx="5" fill={V1} opacity="0.45" />
    <circle cx="100" cy="130" r="26" fill={V3} opacity="0.55" />
    <path d="M90 122 a24 24 0 0 0 18 18 l6 -8 -10 -6 -4 4 -8 -8 4 -4 -6 -10 Z" fill="white" />
  </svg>
);

const HeartArt = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none">
    <path d="M100 172 C40 132 22 104 22 76 a40 40 0 0 1 78 -14 a40 40 0 0 1 78 14 c0 28 -18 56 -78 96 Z" fill={V2} opacity="0.45" />
    <path d="M100 172 C40 132 22 104 22 76 a40 40 0 0 1 78 -14 a40 40 0 0 1 78 14 c0 28 -18 56 -78 96 Z" stroke={V3} strokeWidth="6" opacity="0.5" />
    <path d="M44 106 h30 l14 -26 l20 52 l14 -26 h34" stroke={V3} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

const ToothArt = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none">
    <path d="M64 26 C36 26 26 52 32 84 c6 30 12 44 18 68 c6 22 26 22 30 0 l8 -38 c3 -14 21 -14 24 0 l8 38 c4 22 24 22 30 0 c6 -24 12 -38 18 -68 c6 -32 -4 -58 -32 -58 c-16 0 -22 8 -36 8 c-14 0 -20 -8 -36 -8 Z" fill="white" opacity="0.95" />
    <path d="M64 26 C36 26 26 52 32 84 c6 30 12 44 18 68 c6 22 26 22 30 0 l8 -38 c3 -14 21 -14 24 0 l8 38 c4 22 24 22 30 0 c6 -24 12 -38 18 -68 c6 -32 -4 -58 -32 -58 c-16 0 -22 8 -36 8 c-14 0 -20 -8 -36 -8 Z" fill={V2} opacity="0.4" />
    <path d="M62 60 c14 -10 30 -8 40 2" stroke={V3} strokeWidth="8" strokeLinecap="round" fill="none" />
  </svg>
);

const XrayArt = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none">
    <rect x="26" y="34" width="148" height="132" rx="20" fill={V3} opacity="0.25" />
    <rect x="26" y="34" width="148" height="132" rx="20" fill="white" opacity="0.65" />
    <rect x="46" y="60" width="24" height="46" rx="10" fill={V2} opacity="0.7" />
    <rect x="80" y="52" width="24" height="54" rx="10" fill={V2} opacity="0.55" />
    <rect x="114" y="62" width="24" height="44" rx="10" fill={V2} opacity="0.65" />
    <rect x="40" y="120" width="120" height="10" rx="5" fill={V1} opacity="0.6" />
    <circle cx="140" cy="150" r="18" stroke={V3} strokeWidth="7" />
    <path d="M152 162 L172 182" stroke={V3} strokeWidth="9" strokeLinecap="round" />
  </svg>
);

const ServerArt = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none">
    <rect x="34" y="24" width="132" height="44" rx="14" fill="white" opacity="0.95" />
    <rect x="34" y="24" width="132" height="44" rx="14" fill={GLASS} opacity="0.8" />
    <rect x="34" y="78" width="132" height="44" rx="14" fill="white" opacity="0.95" />
    <rect x="34" y="78" width="132" height="44" rx="14" fill={GLASS} opacity="0.8" />
    <rect x="34" y="132" width="132" height="44" rx="14" fill="white" opacity="0.95" />
    <rect x="34" y="132" width="132" height="44" rx="14" fill={V2} opacity="0.3" />
    <circle cx="56" cy="46" r="7" fill={V3} />
    <circle cx="56" cy="100" r="7" fill={V3} opacity="0.7" />
    <circle cx="56" cy="154" r="7" fill={V3} opacity="0.5" />
    <rect x="78" y="41" width="60" height="10" rx="5" fill={V1} opacity="0.6" />
    <rect x="78" y="95" width="46" height="10" rx="5" fill={V1} opacity="0.5" />
    <rect x="78" y="149" width="54" height="10" rx="5" fill={V1} opacity="0.45" />
  </svg>
);

const CloudArt = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none">
    <path d="M60 138 a34 34 0 0 1 2 -68 a40 40 0 0 1 76 -8 a30 30 0 0 1 4 76 Z" fill="white" opacity="0.95" />
    <path d="M60 138 a34 34 0 0 1 2 -68 a40 40 0 0 1 76 -8 a30 30 0 0 1 4 76 Z" fill={V2} opacity="0.35" />
    <path d="M100 118 v50 M84 152 l16 18 l16 -18" stroke={V3} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

const BellArt = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none">
    <path d="M100 24 a48 48 0 0 1 48 48 v34 l16 24 H36 l16 -24 V72 a48 48 0 0 1 48 -48 Z" fill="white" opacity="0.95" />
    <path d="M100 24 a48 48 0 0 1 48 48 v34 l16 24 H36 l16 -24 V72 a48 48 0 0 1 48 -48 Z" fill={V2} opacity="0.4" />
    <path d="M82 146 a18 18 0 0 0 36 0" stroke={V3} strokeWidth="10" strokeLinecap="round" fill="none" />
    <circle cx="148" cy="46" r="18" fill={V3} />
  </svg>
);

const GaugeArt = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none">
    <path d="M26 140 a74 74 0 0 1 148 0" stroke={V1} strokeWidth="22" strokeLinecap="round" fill="none" opacity="0.55" />
    <path d="M26 140 a74 74 0 0 1 52 -70" stroke={V3} strokeWidth="22" strokeLinecap="round" fill="none" />
    <path d="M100 140 L142 92" stroke={V3} strokeWidth="11" strokeLinecap="round" />
    <circle cx="100" cy="140" r="16" fill="white" />
    <circle cx="100" cy="140" r="16" stroke={V2} strokeWidth="7" />
  </svg>
);

const TargetArt = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none">
    <circle cx="98" cy="102" r="70" fill="white" opacity="0.9" />
    <circle cx="98" cy="102" r="70" fill={V1} opacity="0.35" />
    <circle cx="98" cy="102" r="46" fill="white" opacity="0.9" />
    <circle cx="98" cy="102" r="46" fill={V2} opacity="0.4" />
    <circle cx="98" cy="102" r="20" fill={V3} opacity="0.75" />
    <path d="M98 102 L172 30" stroke={V3} strokeWidth="10" strokeLinecap="round" />
    <path d="M148 26 H176 V54" stroke={V3} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

const RobotArt = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none">
    <rect x="36" y="52" width="128" height="106" rx="30" fill="white" opacity="0.95" />
    <rect x="36" y="52" width="128" height="106" rx="30" fill={V2} opacity="0.35" />
    <circle cx="74" cy="98" r="13" fill={V3} />
    <circle cx="126" cy="98" r="13" fill={V3} />
    <rect x="80" y="124" width="40" height="10" rx="5" fill={V3} opacity="0.6" />
    <path d="M100 24 v28" stroke={V3} strokeWidth="8" strokeLinecap="round" />
    <circle cx="100" cy="20" r="10" fill={V3} />
    <rect x="14" y="86" width="16" height="40" rx="8" fill={V1} />
    <rect x="170" y="86" width="16" height="40" rx="8" fill={V1} />
  </svg>
);

const GraduationArt = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none">
    <path d="M100 32 L182 72 L100 112 L18 72 Z" fill={V2} opacity="0.7" />
    <path d="M54 92 v40 c0 18 92 18 92 0 V92" stroke={V3} strokeWidth="10" strokeLinecap="round" fill="none" opacity="0.7" />
    <path d="M172 78 v46" stroke={V3} strokeWidth="8" strokeLinecap="round" />
    <circle cx="172" cy="134" r="12" fill={V3} opacity="0.8" />
  </svg>
);

const HistoryArt = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none">
    <circle cx="106" cy="102" r="66" fill="white" opacity="0.9" />
    <circle cx="106" cy="102" r="66" fill={GLASS} opacity="0.8" />
    <path d="M106 60 v44 l30 18" stroke={V3} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <path d="M40 66 V32 M40 66 H74" stroke={V2} strokeWidth="10" strokeLinecap="round" />
    <path d="M40 66 a66 66 0 0 1 40 -28" stroke={V2} strokeWidth="10" strokeLinecap="round" fill="none" />
  </svg>
);

const RouteArt = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none">
    <path d="M44 40 h50 a30 30 0 0 1 0 60 h-40 a30 30 0 0 0 0 60 h60" stroke={V1} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <circle cx="44" cy="40" r="18" fill={V2} />
    <circle cx="118" cy="160" r="22" fill={V3} opacity="0.8" />
    <path d="M108 160 l8 9 14 -17" stroke="white" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <circle cx="150" cy="70" r="14" fill={V1} opacity="0.8" />
  </svg>
);

const TableArt = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none">
    <rect x="22" y="34" width="156" height="132" rx="20" fill="white" opacity="0.95" />
    <rect x="22" y="34" width="156" height="132" rx="20" fill={GLASS} opacity="0.7" />
    <rect x="22" y="34" width="156" height="30" rx="15" fill={V2} opacity="0.6" />
    <path d="M22 94 H178 M22 130 H178 M78 64 V166 M130 64 V166" stroke={V1} strokeWidth="6" opacity="0.7" />
    <rect x="36" y="104" width="28" height="10" rx="5" fill={V3} opacity="0.5" />
    <rect x="92" y="140" width="26" height="10" rx="5" fill={V3} opacity="0.4" />
  </svg>
);

const ARTS = [ChartArt, ProfileArt, FlowArt];

const ART_FAMILIES: [RegExp, (typeof ChartArt)[]][] = [
  [/зуб|имплант|коронк|пломб|ортодонт|прикус/i, [ToothArt, MedArt]],
  [/снимок|рентген|кт |мрт|скан|фото|изображен/i, [XrayArt, MedArt]],
  [/диагноз|лечен|клинич|медицин|препарат|анамнез|осмотр|здоров/i, [MedArt, HeartArt, ToothArt]],
  [/склад|остатк|расходник|запас|инвентар/i, [InventoryArt, BoxArt]],
  [/закуп|поставк|логист|доставк|товар|материал/i, [TruckArt, BoxArt, InventoryArt]],
  [/звонок|телефон|оператор|колл|входящ/i, [PhoneArt, ChatArt]],
  [/чат|сообщен|переписк|мессендж|отзыв|коммуникац|скрипт/i, [ChatArt, InboxArt]],
  [/обращен|заявк|жалоб|претенз|тикет|запрос/i, [InboxArt, ChatArt]],
  [/юридич|суд|спор|закон|правов|норматив|регулятор/i, [ScaleArt, ShieldBigArt]],
  [/персональн|конфиденц|доступ|шифр|пароль|защит данных/i, [LockArt, ShieldBigArt]],
  [/безопас|защит|соглас|риск|наруш|лиценз|контрол|комплаенс/i, [ShieldBigArt, LockArt, ScaleArt]],
  [/подпис|договор|акт|соглашен/i, [SignArt, DocArt]],
  [/шаблон|инструкц|регламент|архив|реестр|номенклатур/i, [DocStackArt, TableArt, DocArt]],
  [/документ|отч[её]т|протокол|заключ|бумаг|карт|запис/i, [DocArt, DocStackArt, TableArt]],
  [/поиск|найти|подбор|база знан/i, [SearchArt, FilterArt]],
  [/аудит|провер|сверк|валидац|ревиз|сортиров|фильтр/i, [FilterArt, SearchArt]],
  [/егисз|мис|интеграц|api|обмен|синхрониз|инфраструктур|сеть/i, [NetworkArt, ServerArt, CloudArt]],
  [/резервн|копи|бэкап|сервер|хранилищ|облач|восстановл/i, [CloudArt, ServerArt]],
  [/уведомлен|напоминан|оповещен|сигнал|алерт|эскалац/i, [BellArt, AlertArt]],
  [/ошибк|отклонен|несоответств|дефицит|инцидент|аномал|сбой|штраф|просроч/i, [AlertArt, BellArt]],
  [/выручк|маржинальн|прибыл|финанс|бюджет|деньг|касс/i, [CoinsArt, MoneyArt]],
  [/стоим|оплат|прайс|счет|счёт|затрат|экономи|тариф/i, [MoneyArt, CoinsArt]],
  [/расписан|график|смен|календар|запис на|слот|окн[оа]|отпуск/i, [CalendarArt, ClockArt]],
  [/врем|срок|дедлайн|задержк|опоздан|длительн|ожидан/i, [ClockArt, CalendarArt]],
  [/истор|верс|журнал|лог|след|измен|хронолог/i, [HistoryArt, TableArt]],
  [/обучен|онбординг|курс|знан|нав[ыи]к|адаптац|наставник/i, [GraduationArt, ProfileArt]],
  [/сотрудник|персонал|пациент|клиент|hr|врач|команд|профил|кадр/i, [ProfileArt, GraduationArt]],
  [/ии|ai|модел|агент|нейро|бот|ассистент|автоматич/i, [RobotArt, NetworkArt]],
  [/маршрут|поток|этап|шаг|последовательн|воронк/i, [RouteArt, FlowArt]],
  [/процесс|сценар|правил|алгоритм|настрой|механизм/i, [FlowArt, RouteArt, RobotArt]],
  [/загрузк|нагруз|заполняем|эффективн|kpi|норматив/i, [GaugeArt, ChartArt]],
  [/цел|план|результат|конверс|достижен/i, [TargetArt, ChartArt]],
  [/метрик|показател|прогноз|статист|динамик|рост|аналит|сводк|дашборд/i, [ChartArt, GaugeArt, TableArt]],
  [/таблиц|список|перечен|матриц|данн/i, [TableArt, DocStackArt]],
];

const ALL_ARTS = [
  ChartArt, ProfileArt, FlowArt, DocArt, MoneyArt, ClockArt, ShieldBigArt, AlertArt,
  BoxArt, ChatArt, SearchArt, MedArt, NetworkArt, DocStackArt, SignArt, CoinsArt,
  CalendarArt, LockArt, ScaleArt, InventoryArt, TruckArt, FilterArt, InboxArt, PhoneArt,
  HeartArt, ToothArt, XrayArt, ServerArt, CloudArt, BellArt, GaugeArt, TargetArt,
  RobotArt, GraduationArt, HistoryArt, RouteArt, TableArt,
];

const hash = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i += 1) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
};

const candidatesFor = (text: string) => {
  const list: (typeof ChartArt)[] = [];
  ART_FAMILIES.forEach(([re, arts]) => {
    if (re.test(text)) arts.forEach((a) => !list.includes(a) && list.push(a));
  });
  return list;
};

export const CardArt = ({
  index,
  text = '',
  avoid = '',
  className = '',
}: {
  index: number;
  text?: string;
  avoid?: string;
  className?: string;
}) => {
  const h = hash(text);
  const mineList = candidatesFor(text);
  const otherList = avoid ? candidatesFor(avoid) : [];
  const otherPick = otherList.length ? otherList[hash(avoid) % otherList.length] : undefined;

  const free = mineList.filter((a) => a !== otherPick);
  const pool = free.length ? free : mineList.length ? mineList : ALL_ARTS.filter((a) => a !== otherPick);
  const Art = pool[(h + index) % pool.length];
  return <Art className={className} />;
};

export { ShieldArt };
export default CardArt;
