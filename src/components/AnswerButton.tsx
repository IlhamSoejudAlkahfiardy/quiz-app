import { brutalBorder } from '../styles/classes'
import { cn } from '../lib/cn'

interface AnswerButtonProps {
  label: string
  onSelect: (label: string) => void
  disabled?: boolean
  isSelected?: boolean
}

export function AnswerButton({
  label,
  onSelect,
  disabled,
  isSelected,
}: AnswerButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        'w-full cursor-pointer px-5 py-4 text-left text-base font-semibold shadow-brutal-sm transition-all duration-100',
        brutalBorder,
        isSelected ? 'bg-cyan' : 'bg-white',
        !disabled &&
          'hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-yellow hover:shadow-brutal-xs',
        !disabled && 'active:translate-x-1 active:translate-y-1 active:shadow-none',
        disabled && 'cursor-default',
      )}
      onClick={() => onSelect(label)}
      disabled={disabled}
    >
      {label}
    </button>
  )
}
