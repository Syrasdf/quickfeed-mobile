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
import Detail from './pages/Detail'
import Search from './pages/Search'

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
            <Route path="/detail/:id" element={<Detail />} />
            <Route path="/search" element={<Search />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/publish" element={<Publish />} />
            
            {/* 需要登录的页面 - 只有消息页面 */}
            <Route path="/message" element={
              <ProtectedRoute>
                <Message />
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
