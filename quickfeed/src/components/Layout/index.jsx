import { Outlet, useLocation } from 'react-router-dom'
import TabBar from '../TabBar'
import './index.css'

const Layout = () => {
  const location = useLocation()

  // 不需要显示TabBar的页面
  const hideTabBarPaths = ['/publish', '/detail', '/login', '/register']
  const shouldHideTabBar = hideTabBarPaths.some(path => 
    location.pathname.startsWith(path)
  )

  return (
    <div className="layout-container">
      <main className="layout-content">
        <Outlet />
      </main>
      {!shouldHideTabBar && <TabBar />}
    </div>
  )
}

export default Layout
