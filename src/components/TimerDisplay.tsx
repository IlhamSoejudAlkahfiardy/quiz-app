import { cn } from '../lib/cn'

interface TimerDisplayProps {
  time: string
  isWarning?: boolean
}

export function TimerDisplay({ time, isWarning }: TimerDisplayProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between border-4 border-ink p-4 shadow-brutal-sm',
        isWarning
          ? 'animate-timer-warning bg-warning-light'
          : 'bg-yellow',
      )}
    >
      <span className="text-sm font-bold uppercase tracking-wider">
        Sisa Waktu
      </span>
      <span className="font-mono text-3xl font-bold">{time}</span>
    </div>
  )
}
