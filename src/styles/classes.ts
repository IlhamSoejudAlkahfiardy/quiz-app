import { cn } from '../lib/cn'

export const brutalBorder = 'border-[3px] border-ink'
export const brutalBorderLg = 'border-4 border-ink'

const brutalPressable = cn(
  'transition-all duration-100',
  'hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-brutal-xs',
  'active:translate-x-1 active:translate-y-1 active:shadow-none',
)

export const btnBase = cn(
  'inline-flex items-center justify-center gap-2 font-bold cursor-pointer',
  brutalBorder,
  'shadow-brutal-sm',
  brutalPressable,
  'disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-brutal-sm',
)

export const btnPrimary = cn(btnBase, 'bg-cyan text-ink px-6 py-3.5 text-base')
export const btnOutline = cn(btnBase, 'bg-white text-ink px-6 py-3.5 text-base')
export const btnSmall = cn(btnOutline, 'px-4 py-2 text-sm')

export const inputBase = cn(
  'w-full px-4 py-3 font-sans font-medium text-base bg-white outline-none',
  brutalBorder,
  'shadow-brutal-sm',
  'focus:translate-x-0.5 focus:translate-y-0.5 focus:shadow-brutal-xs',
)

export const pageCard = cn(
  'w-full bg-white p-8 max-sm:p-5',
  brutalBorderLg,
  'shadow-brutal',
)

export const cardBase = cn('bg-white', brutalBorderLg, 'shadow-brutal')
