export function FamiliarityBar({ value }: { value: number }) {
  const clamped = Math.max(0, Math.min(100, Math.round(value)))
  return (
    <div className="w-full">
      <div className="h-1.5 w-full rounded-full bg-gray-200">
        <div className="h-1.5 rounded-full bg-gray-500" style={{ width: `${clamped}%` }} />
      </div>
    </div>
  )
}


