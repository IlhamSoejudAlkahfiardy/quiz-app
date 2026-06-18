interface ProgressBarProps {
  currentIndex: number
  answeredCount: number
  total: number
}

export function ProgressBar({
  currentIndex,
  answeredCount,
  total,
}: ProgressBarProps) {
  const percent = total > 0 ? Math.round((answeredCount / total) * 100) : 0

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between text-sm font-bold">
        <span>
          Soal {Math.min(currentIndex + 1, total)} dari {total}
        </span>
        <span>{percent}%</span>
      </div>
      <div
        className="h-4 border-[3px] border-ink bg-white"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full bg-cyan transition-[width] duration-300 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
