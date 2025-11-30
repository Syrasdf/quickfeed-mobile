import { NavBar, Cell, Button, Dialog } from 'react-vant'
import { useNavigate } from 'react-router-dom'
import useUserStore from '../../store/userStore'
import './index.css'

const Profile = () => {
  const navigate = useNavigate()
  const { userInfo, logout } = useUserStore()

  // 处理退出登录
  const handleLogout = () => {
    Dialog.confirm({
      title: '提示',
      message: '确定要退出登录吗？',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      onConfirm: () => {
        logout()
        navigate('/login', { replace: true })
      }
    })
  }

  return (
    <article className="profile-page">
      <NavBar 
        title="个人中心" 
        fixed
        placeholder
        className="profile-nav"
      />
      
      <main className="profile-content">
        {/* 用户信息卡片 */}
        <div className="user-card">
          <div className="user-avatar">
            {userInfo?.avatar ? (
              <img src={userInfo.avatar} alt="头像" />
            ) : (
              <div style={{fontSize: 48, color: '#ff4b4b'}}>用户</div>
            )}
          </div>
          <div className="user-info">
            <h2 className="user-nickname">{userInfo?.nickname || userInfo?.username || '未登录'}</h2>
            <p className="user-bio">{userInfo?.bio || '这个人很懒，什么都没写'}</p>
          </div>
        </div>

        {/* 功能列表 */}
        <div className="profile-section">
          <Cell.Group card>
            <Cell 
              title="个人资料"
              isLink
              onClick={() => console.log('个人资料')}
            />
            <Cell 
              title="设置"
              isLink
              onClick={() => console.log('设置')}
            />
            <Cell 
              title="关于我们"
              isLink
              onClick={() => console.log('关于我们')}
            />
          </Cell.Group>
        </div>

        {/* 退出登录 */}
        <div className="logout-section">
          <Button 
            block 
            type="danger"
            size="large"
            onClick={handleLogout}
            className="logout-btn"
          >
            退出登录
          </Button>
        </div>

        {/* 测试信息 */}
        <div className="test-info">
          <p>测试账号：admin / 123456</p>
          <p>测试账号：test / 123456</p>
        </div>
      </main>
    </article>
  )
}

export default Profile
