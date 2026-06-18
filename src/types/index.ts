export type QuestionType = 'multiple' | 'boolean'
export type Difficulty = 'easy' | 'medium' | 'hard'

export interface OpenTDBQuestion {
  type: QuestionType
  difficulty: string
  category: string
  question: string
  correct_answer: string
  incorrect_answers: string[]
}

export interface OpenTDBResponse {
  response_code: number
  results: OpenTDBQuestion[]
}

export interface Question {
  id: string
  type: QuestionType
  difficulty: string
  category: string
  question: string
  correctAnswer: string
  options: string[]
}

export interface QuizConfig {
  amount: number
  durationMinutes: number
  category?: number
  difficulty?: Difficulty
  type?: QuestionType
}

export interface QuizAnswer {
  questionId: string
  selectedAnswer: string
  isCorrect: boolean
}

export interface QuizProgress {
  username: string
  config: QuizConfig
  questions: Question[]
  currentIndex: number
  answers: QuizAnswer[]
  startedAt: number
  durationMs: number
  status: 'in_progress'
}

export interface QuizResult {
  total: number
  correct: number
  wrong: number
  unanswered: number
  answered: number
  scorePercent: number
  answers: QuizAnswer[]
  questions: Question[]
  completedAt: number
}
