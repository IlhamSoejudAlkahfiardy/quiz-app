import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { btnSmall } from '../styles/classes'

interface LayoutProps {
  children: React.ReactNode
  showLogout?: boolean
}

export function Layout({ children, showLogout = true }: LayoutProps) {
  const { username, logout } = useAuth()

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between gap-4 border-b-4 border-ink bg-yellow px-4 py-3 max-sm:px-4 max-sm:py-3 sm:px-6">
        <Link
          to="/setup"
          className="font-mono text-xl font-bold tracking-tight"
        >
          QUIZ<span className="text-accent">APP</span>
        </Link>
        {showLogout && username && (
          <div className="flex flex-wrap items-center gap-3">
            <span className="border-[3px] border-ink bg-white px-3 py-1.5 text-sm font-medium">
              Halo, {username}
            </span>
            <button
              type="button"
              className={btnSmall}
              onClick={logout}
            >
              Logout
            </button>
          </div>
        )}
      </header>
      <main className="flex flex-1 items-center justify-center p-6">
        {children}
      </main>
    </div>
  )
}
