import { Tabbar } from 'react-vant'
import { useNavigate, useLocation } from 'react-router-dom'
import useUserStore from '../../store/userStore'
import './index.css'

const TabBarComponent = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { isLogin } = useUserStore()

  const getActiveKey = () => {
    const path = location.pathname
    if (path === '/' || path === '/feed') return 'feed'
    if (path === '/discover') return 'discover'
    if (path === '/message') return 'message'
    if (path === '/profile') return 'profile'
    return 'feed'
  }

  const handleChange = (key) => {
    // 只有消息页面需要登录
    if (key === 'message' && !isLogin) {
      // 未登录时跳转到登录页
      navigate('/login', { 
        state: { 
          from: '/message',
          message: '请先登录查看消息' 
        } 
      })
      return
    }
    
    if (key === 'publish') {
      // 处理发布按钮点击，直接导航到发布页面
      navigate('/publish')
      return
    }
    
    // 其他页面直接导航
    navigate(`/${key === 'feed' ? '' : key}`)
  }

  return (
    <Tabbar 
      value={getActiveKey()} 
      onChange={handleChange}
      fixed
      placeholder
      safeAreaInsetBottom
    >
      <Tabbar.Item name="feed">
        首页
      </Tabbar.Item>
      <Tabbar.Item name="discover">
        朋友
      </Tabbar.Item>
      <Tabbar.Item 
        name="publish" 
        icon={
          <div className="publish-btn">
            <span style={{fontSize: 24}}>+</span>
          </div>
        }
      >
        {/* 发布按钮不显示文字 */}
      </Tabbar.Item>
      <Tabbar.Item name="message">
        消息
      </Tabbar.Item>
      <Tabbar.Item name="profile">
        我
      </Tabbar.Item>
    </Tabbar>
  )
}

export default TabBarComponent
