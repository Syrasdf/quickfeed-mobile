import { Tabbar } from 'react-vant'
import { HomeO, Fire, ChatO, UserO } from '@react-vant/icons'
import { useNavigate, useLocation } from 'react-router-dom'
import './index.css'

const TabBarComponent = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const getActiveKey = () => {
    const path = location.pathname
    if (path === '/' || path === '/feed') return 'feed'
    if (path === '/discover') return 'discover'
    if (path === '/message') return 'message'
    if (path === '/profile') return 'profile'
    return 'feed'
  }

  const handleChange = (key) => {
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
      <Tabbar.Item name="feed" icon={<HomeO />}>
        首页
      </Tabbar.Item>
      <Tabbar.Item name="discover" icon={<Fire />}>
        发现
      </Tabbar.Item>
      <Tabbar.Item name="message" icon={<ChatO />}>
        消息
      </Tabbar.Item>
      <Tabbar.Item name="profile" icon={<UserO />}>
        我的
      </Tabbar.Item>
    </Tabbar>
  )
}

export default TabBarComponent
