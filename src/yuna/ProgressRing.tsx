interface ProgressRingProps {
  value: number; // 0-100
  size?: number;
  stroke?: number;
  from?: string;
  to?: string;
  label?: string;
  suffix?: string;
  displayValue?: string;
  gradientId: string;
}

const ProgressRing = ({
  value,
  size = 96,
  stroke = 9,
  from = '#2563eb',
  to = '#4f46e5',
  label,
  suffix = '%',
  displayValue,
  gradientId,
}: ProgressRingProps) => {
  const clamped = Math.max(0, Math.min(100, value));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (clamped / 100) * c;
  const glowId = `${gradientId}-glow`;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={from} />
              <stop offset="100%" stopColor={to} />
            </linearGradient>
            <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#eef2ff" strokeWidth={stroke} />
          <circle
            className="ring-anim"
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={c}
            filter={`url(#${glowId})`}
            style={{
              ['--ring-circ' as string]: `${c}`,
              ['--ring-offset' as string]: `${offset}`,
              strokeDashoffset: offset,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center count-pop">
          <span className="font-extrabold text-gray-800" style={{ fontSize: size * 0.26 }}>
            {displayValue ?? Math.round(clamped)}
            <span className="text-gray-400" style={{ fontSize: size * 0.14 }}>{suffix}</span>
          </span>
        </div>
      </div>
      {label && <span className="text-sm text-gray-500 mt-2 text-center leading-tight font-medium">{label}</span>}
    </div>
  );
};

export default ProgressRing;