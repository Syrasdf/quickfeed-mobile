import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'

// 直接导入（暂时禁用懒加载）
import Login from './pages/Login'
import Register from './pages/Register'
import Feed from './pages/Feed'
import Discover from './pages/Discover'
import Message from './pages/Message'
import Profile from './pages/Profile'
import Publish from './pages/Publish'

function App() {
  return (
    <Router>
      <Routes>
          {/* 公开路由 */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* 使用Layout的路由 */}
          <Route element={<Layout />}>
            {/* 公开页面 */}
            <Route path="/" element={<Feed />} />
            <Route path="/feed" element={<Navigate to="/" replace />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/message" element={<Message />} />
            
            {/* 需要登录的页面 */}
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/publish" element={
              <ProtectedRoute>
                <Publish />
              </ProtectedRoute>
            } />
          </Route>
          
          {/* 404 页面 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    </Router>
  )
}

export default App
