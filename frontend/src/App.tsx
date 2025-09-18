import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { NavBar } from './components/NavBar'
import { Home } from './pages/Home'
import { Lessons } from './pages/Lessons.tsx'
import { Practice } from './pages/Practice.tsx'
import { Progress } from './pages/Progress.tsx'
import { ProgressProvider } from './context/ProgressContext'
import { VocabProvider } from './context/VocabContext'
import { QueueProvider } from './context/QueueContext'
import { MyVocab } from './pages/MyVocab'
import { VideoPlayer } from './pages/VideoPlayer'
import { Playlist } from './pages/Playlist'
import { MyQueues } from './pages/MyQueues'
import { RecentlyAdded } from './pages/RecentlyAdded'

function App() {
  return (
    <ProgressProvider>
      <VocabProvider>
        <QueueProvider>
          <BrowserRouter>
          <div className="min-h-screen bg-app-default text-gray-900">
            <NavBar />
            <main className="container-app section">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/lessons" element={<Lessons />} />
                <Route path="/practice" element={<Practice />} />
                <Route path="/my-vocab" element={<MyVocab />} />
                <Route path="/my-queues" element={<MyQueues />} />
                <Route path="/progress" element={<Progress />} />
                <Route path="/watch/:id" element={<VideoPlayer />} />
                <Route path="/playlist/:id" element={<Playlist />} />
                <Route path="/recent" element={<RecentlyAdded />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
          </BrowserRouter>
        </QueueProvider>
      </VocabProvider>
    </ProgressProvider>
  )
}

export default App
