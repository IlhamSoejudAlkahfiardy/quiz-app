import type { Question, QuizAnswer, QuizResult } from '../types'

export function calculateQuizResult(
  questions: Question[],
  answers: QuizAnswer[],
): QuizResult {
  const answerMap = new Map(answers.map((a) => [a.questionId, a]))
  const total = questions.length
  let correct = 0
  let wrong = 0

  for (const question of questions) {
    const answer = answerMap.get(question.id)
    if (!answer) continue
    if (answer.isCorrect) correct += 1
    else wrong += 1
  }

  const answered = answers.length
  const unanswered = total - answered
  const scorePercent = total > 0 ? Math.round((correct / total) * 100) : 0

  return {
    total,
    correct,
    wrong,
    unanswered,
    answered,
    scorePercent,
    answers,
    questions,
    completedAt: Date.now(),
  }
}
