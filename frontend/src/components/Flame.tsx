type FlameProps = {
  level: number
  className?: string
}

// Animated flame that scales with streak level
export function Flame({ level, className }: FlameProps) {
  const size = Math.min(20 + level * 2, 48) // grow up to 48px
  const glow = Math.min(0.2 + level * 0.02, 0.6)
  return (
    <span
      className={`inline-flex items-center justify-center ${className ?? ''}`}
      style={{ width: size, height: size }}
      aria-label={`Streak ${level} days`}
      title={`Streak ${level} days`}
    >
      <svg
        viewBox="0 0 64 64"
        width={size}
        height={size}
        className="flame-svg"
        style={{ filter: `drop-shadow(0 0 ${Math.round(size * glow)}px rgba(255,140,0,0.6))` }}
      >
        <defs>
          <linearGradient id="flameGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#ffd166" />
            <stop offset="60%" stopColor="#ff7a00" />
            <stop offset="100%" stopColor="#e85d04" />
          </linearGradient>
        </defs>
        <path
          className="flame-flicker"
          fill="url(#flameGrad)"
          d="M32 4c6 10 2 12 2 12s9-1 14 9c4 9-1 22-16 27-15-5-20-18-16-27 5-10 14-9 14-9s-4-2 2-12z"
        />
        <path
          fill="#fff8e1"
          opacity="0.8"
          d="M33 25c3 5-1 6-1 6s5 0 7 5c2 5-1 11-8 13-7-2-10-8-8-13 2-5 7-5 7-5s-3-1 0-6z"
        />
      </svg>
    </span>
  )
}


