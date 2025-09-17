import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { NavBar } from './components/NavBar'
import { Home } from './pages/Home'
import { Lessons } from './pages/Lessons.tsx'
import { Practice } from './pages/Practice.tsx'
import { Progress } from './pages/Progress.tsx'
import { ProgressProvider } from './context/ProgressContext'
import { VocabProvider } from './context/VocabContext'
import { MyVocab } from './pages/MyVocab'

function App() {
  return (
    <ProgressProvider>
      <VocabProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-app-default text-gray-900">
            <NavBar />
            <main className="container-app section">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/lessons" element={<Lessons />} />
                <Route path="/practice" element={<Practice />} />
                <Route path="/my-vocab" element={<MyVocab />} />
                <Route path="/progress" element={<Progress />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </VocabProvider>
    </ProgressProvider>
  )
}

export default App
