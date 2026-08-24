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

const TILES = [TileChart, TileFlame, TilePeople];

const KEYWORDS: [RegExp, typeof TileChart][] = [
  [/выгор|стресс|перегруз|риск|нагруз|конфликт/i, TileFlame],
  [/безопас|защит|доступ|прав|конфиденц|соглас|этик|контрол/i, TileShield],
  [/документ|отч[её]т|протокол|заключ|бумаг|запис|карт/i, TileDoc],
  [/врем|расписан|график|смен|срок|дедлайн|задержк|отпуск/i, TileClock],
  [/ии|ai|модел|алгоритм|прогноз|нейро|анализ/i, TileBrain],
  [/деньг|финанс|бюджет|стоим|оплат|выручк|экономи/i, TileMoney],
  [/интеграц|настрой|процесс|автомат|систем|сценар|этап/i, TileGear],
  [/сотрудник|команд|персонал|пациент|клиент|hr|люд|врач/i, TilePeople],
  [/метрик|показател|статист|динамик|рост|kpi|график/i, TileChart],
];

const pickTile = (text: string) => KEYWORDS.find(([re]) => re.test(text))?.[1];

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
  const mine = pickTile(text);
  const other = avoid ? pickTile(avoid) : undefined;
  const Tile =
    mine && mine !== other
      ? mine
      : KEYWORDS.map(([, t]) => t).find((t) => t !== other && t !== mine) ?? TILES[index % TILES.length];
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

const ARTS = [ChartArt, ProfileArt, FlowArt];

const ART_KEYWORDS: [RegExp, typeof ChartArt][] = [
  [/безопас|защит|конфиденц|персональн|доступ|соглас|риск|наруш|юридич|претенз|суд|лиценз/i, ShieldBigArt],
  [/склад|остатк|материал|закуп|поставк|товар|расходник|запас|логист/i, BoxArt],
  [/поиск|найти|подбор|аудит|провер|сверк|реестр|база знан/i, SearchArt],
  [/звонок|чат|сообщен|переписк|обращен|отзыв|коммуникац|скрипт|оператор/i, ChatArt],
  [/диагноз|лечен|клинич|медицин|препарат|анамнез|зуб|снимок|осмотр|имплант/i, MedArt],
  [/ошибк|отклонен|несоответств|дефицит|инцидент|аномал|сбой|штраф|просроч/i, AlertArt],
  [/егисз|мис|интеграц|api|обмен|синхрониз|систем|сеть|инфраструктур/i, NetworkArt],
  [/деньг|финанс|бюджет|стоим|оплат|выручк|прайс|экономи|затрат|счет|счёт|маржинальн/i, MoneyArt],
  [/документ|отч[её]т|протокол|заключ|шаблон|бумаг|подпис|договор|акт|карт/i, DocArt],
  [/врем|расписан|график|смен|срок|дедлайн|задержк|опоздан|окн[оа]|отпуск/i, ClockArt],
  [/сотрудник|персонал|пациент|клиент|hr|врач|команд|профил|кадр|обучен/i, ProfileArt],
  [/процесс|этап|сценар|автомат|шаг|маршрут|поток|правил|алгоритм/i, FlowArt],
  [/метрик|показател|прогноз|статист|динамик|рост|нагруз|kpi|план/i, ChartArt],
];

const pickArt = (text: string) => ART_KEYWORDS.find(([re]) => re.test(text))?.[1];

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
  const mine = pickArt(text);
  const other = avoid ? pickArt(avoid) : undefined;
  const Art =
    mine && mine !== other
      ? mine
      : mine
        ? ART_KEYWORDS.map(([, a]) => a).find((a) => a !== other) ?? ARTS[index % ARTS.length]
        : ARTS[index % ARTS.length];
  return <Art className={className} />;
};

export { ShieldArt };
export default CardArt;