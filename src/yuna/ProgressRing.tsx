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

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={from} />
              <stop offset="100%" stopColor={to} />
            </linearGradient>
          </defs>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#eef2ff" strokeWidth={stroke} />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.8s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-gray-800">
            {displayValue ?? Math.round(clamped)}
            <span className="text-xs text-gray-400">{suffix}</span>
          </span>
        </div>
      </div>
      {label && <span className="text-xs text-gray-500 mt-1.5 text-center leading-tight">{label}</span>}
    </div>
  );
};

export default ProgressRing;