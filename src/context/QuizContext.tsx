/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext } from 'react'
import { Outlet } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { useQuiz } from '../hooks/useQuiz'

type QuizContextValue = ReturnType<typeof useQuiz>

const QuizContext = createContext<QuizContextValue | null>(null)

export function QuizProvider() {
  const { username } = useAuth()
  const quiz = useQuiz({ username: username! })

  return (
    <QuizContext.Provider value={quiz}>
      <Outlet />
    </QuizContext.Provider>
  )
}

export function useQuizContext() {
  const context = useContext(QuizContext)
  if (!context) {
    throw new Error('useQuizContext harus dipakai di dalam QuizProvider')
  }
  return context
}
