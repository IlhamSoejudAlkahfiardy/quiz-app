/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react'
import { REGISTERED_USERS } from '../data/user'
import {
  clearSessionUser,
  getSessionUser,
  setSessionUser,
} from '../utils/storage'

interface AuthContextValue {
  username: string | null
  isAuthenticated: boolean
  login: (name: string) => string | null
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [username, setUsername] = useState<string | null>(() => getSessionUser())

  const login = useCallback((name: string): string | null => {
    const trimmed = name.trim()
    if (!trimmed) {
      return 'Nama tidak boleh kosong.'
    }

    const matched = REGISTERED_USERS.find(
      (user) => user.toLowerCase() === trimmed.toLowerCase(),
    )

    if (!matched) {
      return 'Nama tidak terdaftar, silakan cek kembali atau hubungi panitia.'
    }

    setSessionUser(matched)
    setUsername(matched)
    return null
  }, [])

  // Logout hanya menghapus sesi yang aktif progres kuis tetap tersimpan
  // agar peserta bisa resume saat login kembali dengan nama yang sama.
  const logout = useCallback(() => {
    clearSessionUser()
    setUsername(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        username,
        isAuthenticated: Boolean(username),
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth harus dipakai di dalam AuthProvider')
  }
  return context
}
