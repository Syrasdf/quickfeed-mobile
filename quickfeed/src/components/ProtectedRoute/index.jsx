import { Navigate, useLocation } from 'react-router-dom'
import useUserStore from '../../store/userStore'

const ProtectedRoute = ({ children }) => {
  const { isLogin } = useUserStore()
  const location = useLocation()

  if (!isLogin) {
    // 保存当前路径，登录后可以返回
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  return children
}

export default ProtectedRoute
