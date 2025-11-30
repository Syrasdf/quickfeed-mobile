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
    // 需要登录的页面
    const authRequiredPages = ['publish', 'profile']
    
    if (authRequiredPages.includes(key) && !isLogin) {
      // 未登录时跳转到登录页
      navigate('/login', { 
        state: { 
          from: key === 'publish' ? '/publish' : '/profile',
          message: '请先登录' 
        } 
      })
      return
    }
    
    if (key === 'publish') {
      // 处理发布按钮点击
      console.log('发布按钮被点击')
      // TODO: 导航到发布页面
      navigate('/publish')
      return
    }
    
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
