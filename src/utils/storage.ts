import type { QuizProgress, QuizResult } from '../types'

const SESSION_KEY = 'quiz_session'
const PROGRESS_PREFIX = 'quiz_progress_'
const RESULT_PREFIX = 'quiz_result_'

export function getSessionUser(): string | null {
  return localStorage.getItem(SESSION_KEY)
}

export function setSessionUser(username: string): void {
  localStorage.setItem(SESSION_KEY, username)
}

export function clearSessionUser(): void {
  localStorage.removeItem(SESSION_KEY)
}

export function getProgressKey(username: string): string {
  return `${PROGRESS_PREFIX}${username}`
}

export function saveQuizProgress(progress: QuizProgress): void {
  localStorage.setItem(
    getProgressKey(progress.username),
    JSON.stringify(progress),
  )
}

export function loadQuizProgress(username: string): QuizProgress | null {
  const raw = localStorage.getItem(getProgressKey(username))
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw) as QuizProgress
    if (parsed.status !== 'in_progress') return null
    return parsed
  } catch {
    return null
  }
}

export function clearQuizProgress(username: string): void {
  localStorage.removeItem(getProgressKey(username))
}

export function saveQuizResult(username: string, result: QuizResult): void {
  localStorage.setItem(`${RESULT_PREFIX}${username}`, JSON.stringify(result))
}

export function loadQuizResult(username: string): QuizResult | null {
  const raw = localStorage.getItem(`${RESULT_PREFIX}${username}`)
  if (!raw) return null

  try {
    return JSON.parse(raw) as QuizResult
  } catch {
    return null
  }
}

export function clearQuizResult(username: string): void {
  localStorage.removeItem(`${RESULT_PREFIX}${username}`)
}
