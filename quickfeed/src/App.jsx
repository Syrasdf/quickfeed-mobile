import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Feed from './pages/Feed'
import Discover from './pages/Discover'
import Message from './pages/Message'
import Profile from './pages/Profile'
import TabBar from './components/TabBar'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app-container">
        <main className="app-content">
          <Routes>
            <Route path="/" element={<Feed />} />
            <Route path="/feed" element={<Navigate to="/" replace />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/message" element={<Message />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
        <TabBar />
      </div>
    </Router>
  )
}

export default App
