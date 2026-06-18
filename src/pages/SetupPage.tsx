import { type FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { ResumeModal } from '../components/ResumeModal'
import { useAuth } from '../context/AuthContext'
import { useQuizContext } from '../context/QuizContext'
import { fetchQuestions } from '../services/opentdb'
import { btnPrimary, inputBase, pageCard } from '../styles/classes'
import type { Difficulty, QuestionType } from '../types'
import { clearQuizResult, loadQuizProgress } from '../utils/storage'
import { cn } from '../lib/cn'

const DIFFICULTIES: { value: Difficulty | ''; label: string }[] = [
  { value: '', label: 'Semua' },
  { value: 'easy', label: 'Mudah' },
  { value: 'medium', label: 'Sedang' },
  { value: 'hard', label: 'Sulit' },
]

const TYPES: { value: QuestionType | ''; label: string }[] = [
  { value: '', label: 'Semua' },
  { value: 'multiple', label: 'Pilihan Ganda' },
  { value: 'boolean', label: 'True / False' },
]

export function SetupPage() {
  const navigate = useNavigate()
  const { username } = useAuth()
  const { startQuiz, resumeQuiz, discardProgress } = useQuizContext()
  const [amount, setAmount] = useState(10)
  const [durationMinutes, setDurationMinutes] = useState(5)
  const [difficulty, setDifficulty] = useState<Difficulty | ''>('')
  const [type, setType] = useState<QuestionType | ''>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showResume, setShowResume] = useState(() =>
    username ? Boolean(loadQuizProgress(username)) : false,
  )

  const handleStart = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (!username) {
        navigate('/login')
        return
      }

      clearQuizResult(username)
      discardProgress()

      const questions = await fetchQuestions({
        amount,
        durationMinutes,
        ...(difficulty ? { difficulty } : {}),
        ...(type ? { type } : {}),
      })

      startQuiz(
        {
          amount,
          durationMinutes,
          ...(difficulty ? { difficulty } : {}),
          ...(type ? { type } : {}),
        },
        questions,
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan.')
    } finally {
      setLoading(false)
    }
  }

  const handleResume = () => {
    setShowResume(false)
    resumeQuiz()
  }

  const handleDiscard = () => {
    discardProgress()
    setShowResume(false)
  }

  return (
    <Layout>
      {showResume && (
        <ResumeModal onResume={handleResume} onDiscard={handleDiscard} />
      )}

      <section className={cn(pageCard, 'max-w-[520px]')}>
        <h1 className="mb-2 text-2xl font-bold tracking-tight">Setup Kuis</h1>
        <p className="mb-6 leading-relaxed text-neutral-700">
          Atur jumlah soal dan durasi sebelum memulai.
        </p>

        <form onSubmit={handleStart} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="amount" className="text-[0.95rem] font-bold">
              Jumlah Soal
            </label>
            <input
              id="amount"
              type="number"
              min={1}
              max={50}
              className={inputBase}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="duration" className="text-[0.95rem] font-bold">
              Durasi (menit): <strong>{durationMinutes}</strong>
            </label>
            <input
              id="duration"
              type="range"
              min={1}
              max={30}
              className="w-full accent-accent"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="difficulty" className="text-[0.95rem] font-bold">
              Tingkat Kesulitan
            </label>
            <select
              id="difficulty"
              className={inputBase}
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty | '')}
            >
              {DIFFICULTIES.map((item) => (
                <option key={item.label} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="type" className="text-[0.95rem] font-bold">
              Tipe Soal
            </label>
            <select
              id="type"
              className={inputBase}
              value={type}
              onChange={(e) => setType(e.target.value as QuestionType | '')}
            >
              {TYPES.map((item) => (
                <option key={item.label} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <p className="border-[3px] border-ink bg-danger-light px-4 py-3 font-semibold text-danger">
              {error}
            </p>
          )}

          <button
            type="submit"
            className={cn(btnPrimary, 'w-full')}
            disabled={loading}
          >
            {loading ? 'Memuat Soal...' : 'Mulai Kuis'}
          </button>
        </form>
      </section>
    </Layout>
  )
}
