import type { Question } from '../types'
import { cardBase } from '../styles/classes'
import { cn } from '../lib/cn'

interface QuestionCardProps {
  question: Question
}

export function QuestionCard({ question }: QuestionCardProps) {
  return (
    <article className={cn(cardBase, 'p-6')}>
      <p className="mb-3 text-xs font-bold uppercase tracking-wide text-neutral-600">
        {question.category}
      </p>
      <h2 className="mb-4 text-xl font-bold leading-snug max-sm:text-lg">
        {question.question}
      </h2>
      <div className="flex flex-wrap gap-2">
        <span className="border-2 border-ink bg-cream px-2.5 py-1 text-xs font-bold uppercase">
          {question.type === 'boolean' ? 'True/False' : 'Pilihan Ganda'}
        </span>
        <span className="border-2 border-ink bg-accent px-2.5 py-1 text-xs font-bold uppercase text-white">
          {question.difficulty}
        </span>
      </div>
    </article>
  )
}
