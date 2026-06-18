import type { OpenTDBResponse, Question, QuizConfig } from '../types'
import { decodeHtml } from '../utils/decodeHtml'
import { shuffleArray } from '../utils/shuffle'

const BASE_URL = 'https://opentdb.com/api.php'
const RESPONSE_MESSAGES: Record<number, string> = {
  1: 'Jumlah soal melebihi yang tersedia untuk kategori/difficulty yang dipilih. Kurangi jumlah soal atau ubah filter.',
  2: 'Parameter tidak valid. Periksa konfigurasi kuis.',
  3: 'Token sesi tidak ditemukan.',
  4: 'Token sesi sudah habis — semua soal sudah terpakai. Mulai kuis baru.',
  5: 'Terlalu banyak permintaan. Coba lagi beberapa saat.',
}

function buildUrl(config: QuizConfig): string {
  const params = new URLSearchParams()
  params.set('amount', String(config.amount))
  if (config.category) params.set('category', String(config.category))
  if (config.difficulty) params.set('difficulty', config.difficulty)
  if (config.type) params.set('type', config.type)
  return `${BASE_URL}?${params.toString()}`
}

function transformQuestion(raw: OpenTDBResponse['results'][number], index: number): Question {
  const correctAnswer = decodeHtml(raw.correct_answer)
  const incorrectAnswers = raw.incorrect_answers.map(decodeHtml)
  const options = shuffleArray([correctAnswer, ...incorrectAnswers])

  return {
    id: `q-${index}-${Date.now()}`,
    type: raw.type,
    difficulty: raw.difficulty,
    category: decodeHtml(raw.category),
    question: decodeHtml(raw.question),
    correctAnswer,
    options,
  }
}

export async function fetchQuestions(config: QuizConfig): Promise<Question[]> {
  const response = await fetch(buildUrl(config))

  if (!response.ok) {
    throw new Error('Gagal mengambil soal dari server. Periksa koneksi internet Anda.')
  }

  const data = (await response.json()) as OpenTDBResponse

  if (data.response_code !== 0) {
    throw new Error(
      RESPONSE_MESSAGES[data.response_code] ??
        `Gagal mengambil soal (kode: ${data.response_code}).`,
    )
  }

  if (!data.results?.length) {
    throw new Error('Tidak ada soal yang dikembalikan. Coba lagi.')
  }

  return data.results.map(transformQuestion)
}
