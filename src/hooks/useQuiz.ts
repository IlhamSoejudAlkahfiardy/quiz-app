import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Question, QuizAnswer, QuizConfig, QuizProgress } from '../types'
import { calculateQuizResult } from '../utils/scoring'
import {
  clearQuizProgress,
  loadQuizProgress,
  saveQuizProgress,
  saveQuizResult,
} from '../utils/storage'

const ANSWER_DELAY_MS = 600

interface UseQuizOptions {
  username: string
}

export function useQuiz({ username }: UseQuizOptions) {
  const navigate = useNavigate()
  const [progress, setProgress] = useState<QuizProgress | null>(() =>
    loadQuizProgress(username),
  )
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const isAnsweringRef = useRef(false)
  const isFinishingRef = useRef(false)
  const timeoutRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const persistProgress = useCallback((next: QuizProgress) => {
    setProgress(next)
    saveQuizProgress(next)
  }, [])

  const startQuiz = useCallback(
    (config: QuizConfig, questions: Question[]) => {
      isFinishingRef.current = false
      const next: QuizProgress = {
        username,
        config,
        questions,
        currentIndex: 0,
        answers: [],
        startedAt: Date.now(),
        durationMs: config.durationMinutes * 60 * 1000,
        status: 'in_progress',
      }
      persistProgress(next)
      navigate('/quiz')
    },
    [username, persistProgress, navigate],
  )

  const resumeQuiz = useCallback(() => {
    const saved = loadQuizProgress(username)
    if (!saved) return false
    setProgress(saved)
    navigate('/quiz')
    return true
  }, [username, navigate])

  const finishQuiz = useCallback(
    (current: QuizProgress, answers: QuizAnswer[]) => {
      if (isFinishingRef.current) return
      isFinishingRef.current = true

      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }

      const result = calculateQuizResult(current.questions, answers)
      saveQuizResult(username, result)
      clearQuizProgress(username)
      setProgress(null)
      setSelectedOption(null)
      isAnsweringRef.current = false
      navigate('/result')
    },
    [username, navigate],
  )

  const handleTimeUp = useCallback(() => {
    if (!progress) return
    finishQuiz(progress, progress.answers)
  }, [progress, finishQuiz])

  const selectAnswer = useCallback(
    (option: string) => {
      if (!progress || isAnsweringRef.current) return

      const currentQuestion = progress.questions[progress.currentIndex]
      if (!currentQuestion) return

      const alreadyAnswered = progress.answers.some(
        (a) => a.questionId === currentQuestion.id,
      )
      if (alreadyAnswered) return

      isAnsweringRef.current = true
      setSelectedOption(option)

      const newAnswer: QuizAnswer = {
        questionId: currentQuestion.id,
        selectedAnswer: option,
        isCorrect: option === currentQuestion.correctAnswer,
      }

      const updatedAnswers = [...progress.answers, newAnswer]
      const isLastQuestion =
        progress.currentIndex >= progress.questions.length - 1

      timeoutRef.current = window.setTimeout(() => {
        if (isLastQuestion) {
          finishQuiz(progress, updatedAnswers)
        } else {
          const next: QuizProgress = {
            ...progress,
            answers: updatedAnswers,
            currentIndex: progress.currentIndex + 1,
          }
          persistProgress(next)
          setSelectedOption(null)
          isAnsweringRef.current = false
        }
      }, ANSWER_DELAY_MS)
    },
    [progress, finishQuiz, persistProgress],
  )

  const discardProgress = useCallback(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    clearQuizProgress(username)
    setProgress(null)
    setSelectedOption(null)
    isAnsweringRef.current = false
  }, [username])

  const currentQuestion = progress?.questions[progress.currentIndex] ?? null
  const totalQuestions = progress?.questions.length ?? 0
  const answeredCount = progress?.answers.length ?? 0

  return {
    progress,
    currentQuestion,
    totalQuestions,
    answeredCount,
    selectedOption,
    startQuiz,
    resumeQuiz,
    selectAnswer,
    handleTimeUp,
    discardProgress,
  }
}
