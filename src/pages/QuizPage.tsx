import { useCallback } from 'react'
import { Navigate } from 'react-router-dom'
import { AnswerButton } from '../components/AnswerButton'
import { Layout } from '../components/Layout'
import { ProgressBar } from '../components/ProgressBar'
import { QuestionCard } from '../components/QuestionCard'
import { TimerDisplay } from '../components/TimerDisplay'
import { useAuth } from '../context/AuthContext'
import { useQuizContext } from '../context/QuizContext'
import { useTimer } from '../hooks/useTimer'
import { loadQuizResult } from '../utils/storage'

export function QuizPage() {
  const { username } = useAuth()
  const {
    progress,
    currentQuestion,
    totalQuestions,
    answeredCount,
    selectedOption,
    selectAnswer,
    handleTimeUp,
  } = useQuizContext()

  const onExpire = useCallback(() => {
    handleTimeUp()
  }, [handleTimeUp])

  const { formattedTime, remainingMs } = useTimer({
    startedAt: progress?.startedAt ?? 0,
    durationMs: progress?.durationMs ?? 0,
    onExpire,
    isActive: Boolean(progress),
  })

  if (!progress || !currentQuestion) {
    if (username && loadQuizResult(username)) {
      return <Navigate to="/result" replace />
    }
    return <Navigate to="/setup" replace />
  }

  const isAnswering = selectedOption !== null

  return (
    <Layout>
      <section className="flex w-full max-w-[720px] flex-col gap-6">
        <div className="flex flex-col gap-4">
          <TimerDisplay time={formattedTime} isWarning={remainingMs <= 60000} />
          <ProgressBar
            currentIndex={progress.currentIndex}
            answeredCount={answeredCount}
            total={totalQuestions}
          />
        </div>

        <QuestionCard question={currentQuestion} />

        <div className="grid gap-3 min-[480px]:grid-cols-2">
          {currentQuestion.options.map((option) => (
            <AnswerButton
              key={option}
              label={option}
              onSelect={selectAnswer}
              disabled={isAnswering}
              isSelected={selectedOption === option}
            />
          ))}
        </div>
      </section>
    </Layout>
  )
}
