import { type FormEvent, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import { btnPrimary, inputBase, pageCard } from '../styles/classes'
import { cn } from '../lib/cn'

export function LoginPage() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)

  if (isAuthenticated) {
    return <Navigate to="/setup" replace />
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const loginError = login(name)
    if (loginError) {
      setError(loginError)
      return
    }
    setError(null)
    navigate('/setup')
  }

  return (
    <Layout showLogout={false}>
      <section className={cn(pageCard, 'max-w-[520px]')}>
        <h1 className="mb-2 text-2xl font-bold tracking-tight">Masuk Kuis</h1>
        <p className="mb-6 leading-relaxed text-neutral-700">
          Masukkan nama peserta yang terdaftar untuk memulai.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <label htmlFor="name" className="text-[0.95rem] font-bold">
            Nama Peserta
          </label>
          <input
            id="name"
            type="text"
            className={inputBase}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Contoh: Andi"
            autoComplete="name"
          />
          {error && (
            <p className="border-[3px] border-ink bg-danger-light px-4 py-3 font-semibold text-danger">
              {error}
            </p>
          )}
          <button type="submit" className={cn(btnPrimary, 'w-full')}>
            Masuk
          </button>
        </form>
      </section>
    </Layout>
  )
}
