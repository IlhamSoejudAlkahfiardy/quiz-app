import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'
import { QuizProvider } from './context/QuizContext'
import { LoginPage } from './pages/LoginPage'
import { QuizPage } from './pages/QuizPage'
import { ResultPage } from './pages/ResultPage'
import { SetupPage } from './pages/SetupPage'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<QuizProvider />}>
              <Route path="/setup" element={<SetupPage />} />
              <Route path="/quiz" element={<QuizPage />} />
              <Route path="/result" element={<ResultPage />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
