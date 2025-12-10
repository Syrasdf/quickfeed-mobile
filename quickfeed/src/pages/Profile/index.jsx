import { useState, useEffect } from 'react'
import { NavBar, Cell, Button, Dialog, Tabs, Card, Image, Empty, Loading } from 'react-vant'
import Toast from '../../utils/toast'
import { useNavigate, useLocation } from 'react-router-dom'
import useUserStore from '../../store/userStore'
import { getUserPosts, getUserCollectedPosts, getUserStats } from '../../api/post'
import './index.css'

const Profile = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { userInfo, logout } = useUserStore()
  const [activeTab, setActiveTab] = useState('posts')
  const [posts, setPosts] = useState([])
  const [collections, setCollections] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)

  // 加载用户数据 - 每次进入页面都刷新
  useEffect(() => {
    // 当路由是个人中心页面时，重新加载数据
    if (location.pathname === '/profile') {
      loadUserData()
    }
  }, [location.pathname])
  
  // 页面获得焦点时也刷新数据
  useEffect(() => {
    const handleFocus = () => {
      if (document.visibilityState === 'visible' && location.pathname === '/profile') {
        loadUserData()
      }
    }
    
    document.addEventListener('visibilitychange', handleFocus)
    return () => {
      document.removeEventListener('visibilitychange', handleFocus)
    }
  }, [location.pathname])

  const loadUserData = async () => {
    try {
      setLoading(true)
      // 加载统计数据
      const statsData = await getUserStats()
      setStats(statsData)
      
      // 加载用户发布的文章
      const postsData = await getUserPosts()
      setPosts(postsData.list)
      
      // 加载收藏的文章
      const collectionsData = await getUserCollectedPosts()
      setCollections(collectionsData.list)
    } catch (error) {
      console.error('加载数据失败:', error)
      Toast({ message: '加载失败', icon: 'fail' })
    } finally {
      setLoading(false)
    }
  }

  // 处理退出登录
  const handleLogout = () => {
    setShowLogoutDialog(true)
  }

  // 确认退出
  const confirmLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  // 跳转到详情页
  const goToDetail = (id) => {
    navigate(`/detail/${id}`)
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
              <div className="default-avatar">🙍</div>
            )}
          </div>
          <div className="user-info">
            <h2 className="user-nickname">{userInfo?.nickname || userInfo?.username || '未登录'}</h2>
            <p className="user-bio">{userInfo?.bio || '这个人很懒，什么都没写'}</p>
          </div>
        </div>

        {/* 统计数据 */}
        <div className="stats-section">
          <div className="stat-item">
            <div className="stat-value">{stats?.postCount || 0}</div>
            <div className="stat-label">发布</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{stats?.likeCount || 0}</div>
            <div className="stat-label">获赞</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{stats?.collectedCount || 0}</div>
            <div className="stat-label">收藏</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{stats?.followerCount || 0}</div>
            <div className="stat-label">粉丝</div>
          </div>
        </div>

        {/* 内容标签页 */}
        <div className="content-section">
          <Tabs 
            active={activeTab} 
            onChange={setActiveTab}
            className="profile-tabs"
          >
            <Tabs.TabPane title="我的发布" name="posts">
              {loading ? (
                <div className="loading-container">
                  <Loading size="48px">加载中...</Loading>
                </div>
              ) : posts.length > 0 ? (
                <div className="post-list">
                  {posts.map(post => (
                    <Card 
                      key={post.id}
                      className="post-card"
                      onClick={() => goToDetail(post.id)}
                    >
                      <div className="post-content">
                        <div className="post-text">{post.content}</div>
                        {post.images && post.images.length > 0 && (
                          <div className="post-images">
                            {post.images.slice(0, 3).map((img, index) => (
                              <Image 
                                key={index}
                                src={img}
                                fit="cover"
                                width={100}
                                height={100}
                              />
                            ))}
                            {post.images.length > 3 && (
                              <div className="more-images">+{post.images.length - 3}</div>
                            )}
                          </div>
                        )}
                        <div className="post-meta">
                          <span>👍 {post.likes || 0}</span>
                          <span>💬 {post.comments || 0}</span>
                          <span>👁 {post.views || 0}</span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Empty description="暂无发布内容" />
              )}
            </Tabs.TabPane>
            
            <Tabs.TabPane title="我的收藏" name="collections">
              {loading ? (
                <div className="loading-container">
                  <Loading size="48px">加载中...</Loading>
                </div>
              ) : collections.length > 0 ? (
                <div className="post-list">
                  {collections.map(post => (
                    <Card 
                      key={post.id}
                      className="post-card"
                      onClick={() => goToDetail(post.id)}
                    >
                      <div className="post-content">
                        <div className="post-text">{post.content}</div>
                        {post.images && post.images.length > 0 && (
                          <div className="post-images">
                            {post.images.slice(0, 3).map((img, index) => (
                              <Image 
                                key={index}
                                src={img}
                                fit="cover"
                                width={100}
                                height={100}
                              />
                            ))}
                            {post.images.length > 3 && (
                              <div className="more-images">+{post.images.length - 3}</div>
                            )}
                          </div>
                        )}
                        <div className="post-meta">
                          <span>作者: @{post.author}</span>
                          <span>👍 {post.likes || 0}</span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Empty description="暂无收藏内容" />
              )}
            </Tabs.TabPane>
          </Tabs>
        </div>

        {/* 功能列表 */}
        <div className="profile-section">
          <Cell.Group card>
            <Cell 
              title="个人资料"
              isLink
              onClick={() => Toast('功能开发中')}
            />
            <Cell 
              title="设置"
              isLink
              onClick={() => Toast('功能开发中')}
            />
            <Cell 
              title="关于我们"
              isLink
              onClick={() => Toast('QuickFeed v1.0.0')}
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

        {/* 退出登录确认对话框 */}
        <Dialog
          visible={showLogoutDialog}
          title="提示"
          message="确定要退出登录吗？"
          showCancelButton
          onConfirm={confirmLogout}
          onCancel={() => setShowLogoutDialog(false)}
        />
      </main>
    </article>
  )
}

export default Profile
