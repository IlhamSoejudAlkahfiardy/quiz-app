import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import { btnOutline, btnPrimary, pageCard } from '../styles/classes'
import type { QuizAnswer, Question } from '../types'
import { loadQuizResult } from '../utils/storage'
import { cn } from '../lib/cn'

function AnswerDetail({
  question,
  answer,
}: {
  question: Question
  answer?: QuizAnswer
}) {
  const isAnswered = Boolean(answer)
  const isCorrect = answer?.isCorrect

  const statusLabel = !isAnswered
    ? 'Tidak Terjawab'
    : isCorrect
      ? 'Benar'
      : 'Salah'

  return (
    <div
      className={cn(
        'border-[3px] border-ink bg-white p-4',
        isAnswered
          ? isCorrect
            ? 'border-l-8 border-l-success'
            : 'border-l-8 border-l-danger'
          : 'border-l-8 border-l-neutral-400',
      )}
    >
      <div className="mb-2 flex items-start justify-between gap-3">
        <p className="font-bold">{question.question}</p>
        <span
          className={cn(
            'shrink-0 border-2 border-ink px-2.5 py-1 text-xs font-bold uppercase',
            !isAnswered && 'bg-neutral-300 text-ink',
            isAnswered && isCorrect && 'bg-success text-ink',
            isAnswered && !isCorrect && 'bg-danger text-white',
          )}
        >
          {statusLabel}
        </span>
      </div>
      {isAnswered ? (
        <>
          <p>
            Jawaban Anda: <strong>{answer?.selectedAnswer}</strong>
          </p>
          {isCorrect ? (
            <p className="font-semibold text-success-dark">
              Jawaban Anda sudah benar.
            </p>
          ) : (
            <p>
              Jawaban benar: <strong>{question.correctAnswer}</strong>
            </p>
          )}
        </>
      ) : (
        <p>
          Jawaban benar: <strong>{question.correctAnswer}</strong>
        </p>
      )}
    </div>
  )
}

export function ResultPage() {
  const { username } = useAuth()
  const [showDetails, setShowDetails] = useState(true)
  const result = username ? loadQuizResult(username) : null

  if (!result) {
    return <Navigate to="/setup" replace />
  }

  const answerMap = new Map(result.answers.map((a) => [a.questionId, a]))

  const statBox =
    'flex flex-col items-center border-[3px] border-ink bg-white p-4 shadow-brutal-sm'

  return (
    <Layout>
      <section className={cn(pageCard, 'max-w-[640px]')}>
        <h1 className="mb-2 text-2xl font-bold tracking-tight">Hasil Kuis</h1>
        <p className="mb-6 leading-relaxed text-neutral-700">
          Ringkasan pengerjaan kuis Anda.
        </p>

        <div
          className={cn(
            'mb-6 flex flex-col items-center border-4 border-ink bg-yellow p-6 shadow-brutal-sm',
          )}
        >
          <span className="font-mono text-6xl font-bold leading-none">
            {result.scorePercent}%
          </span>
          <span className="mt-1 text-sm font-bold uppercase tracking-widest">
            Skor
          </span>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-3 min-[480px]:grid-cols-4">
          <div className={cn(statBox, 'bg-success-light')}>
            <span className="font-mono text-3xl font-bold">{result.correct}</span>
            <span className="text-xs font-bold uppercase">Benar</span>
          </div>
          <div className={cn(statBox, 'bg-danger-light')}>
            <span className="font-mono text-3xl font-bold">{result.wrong}</span>
            <span className="text-xs font-bold uppercase">Salah</span>
          </div>
          <div className={cn(statBox, 'bg-neutral-100')}>
            <span className="font-mono text-3xl font-bold">
              {result.unanswered}
            </span>
            <span className="text-xs font-bold uppercase">Tidak Terjawab</span>
          </div>
          <div className={statBox}>
            <span className="font-mono text-3xl font-bold">{result.total}</span>
            <span className="text-xs font-bold uppercase">Total Soal</span>
          </div>
        </div>

        <p className="mb-6">
          Terjawab: <strong>{result.answered}</strong> dari{' '}
          <strong>{result.total}</strong> soal
        </p>

        <h2 className="mb-4 mt-6 text-lg font-bold">Detail Jawaban</h2>

        <div className="flex flex-wrap gap-3">
          <Link to="/setup" className={btnPrimary}>
            Ulang Kuis
          </Link>
          <button
            type="button"
            className={btnOutline}
            onClick={() => setShowDetails((prev) => !prev)}
          >
            {showDetails ? 'Sembunyikan Detail' : 'Lihat Detail Jawaban'}
          </button>
        </div>

        {showDetails && (
          <div className="mt-6 flex flex-col gap-3">
            {result.questions.map((question) => (
              <AnswerDetail
                key={question.id}
                question={question}
                answer={answerMap.get(question.id)}
              />
            ))}
          </div>
        )}
      </section>
    </Layout>
  )
}
