import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Card, Image, Loading } from 'react-vant'
import { getPostList } from '../../api/post'
import './index.css'

const Feed = () => {
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  
  // 加载文章列表
  useEffect(() => {
    loadPosts()
  }, [])
  
  const loadPosts = async () => {
    try {
      setLoading(true)
      const data = await getPostList({ page, pageSize: 10 })
      setPosts(data.list)
    } catch (error) {
      console.error('加载失败:', error)
    } finally {
      setLoading(false)
    }
  }
  
  // 跳转到详情页
  const goToDetail = (id) => {
    navigate(`/detail/${id}`)
  }
  
  // 格式化时间
  const formatTime = (date) => {
    if (!date) return ''
    const d = new Date(date)
    const now = new Date()
    const diff = (now - d) / 1000
    
    if (diff < 60) return '刚刚'
    if (diff < 3600) return Math.floor(diff / 60) + '分钟前'
    if (diff < 86400) return Math.floor(diff / 3600) + '小时前'
    return Math.floor(diff / 86400) + '天前'
  }
  return (
    <article className="feed-page">
      {/* 顶部搜索栏 */}
      <header className="feed-header">
        <div className="header-content">
          <div className="header-search" role="search">
            <Search 
              placeholder="搜索感兴趣的内容" 
              shape="round"
              disabled
              background="transparent"
              aria-label="搜索内容"
            />
          </div>
          <button 
            className="ai-btn-large"
            aria-label="AI助手"
          >
            <span>AI</span>
          </button>
        </div>
      </header>

      {/* 内容区域 */}
      <main className="feed-content">
        {loading ? (
          <div className="feed-loading">
            <Loading size="48px">加载中...</Loading>
          </div>
        ) : (
          <section className="waterfall-container" aria-label="内容瀑布流">
            <div className="waterfall-column left-column">
              {posts.filter((_, index) => index % 2 === 0).map(post => (
                <Card 
                  key={post.id}
                  className="feed-card"
                  onClick={() => goToDetail(post.id)}
                >
                  {/* 图片 */}
                  {post.images && post.images[0] && (
                    <div className="card-image">
                      <Image 
                        src={post.images[0]}
                        fit="cover"
                        lazyload
                      />
                    </div>
                  )}
                  
                  {/* 内容 */}
                  <div className="card-content">
                    <div className="card-text">{post.content}</div>
                    <div className="card-footer">
                      <div className="card-author">
                        <img 
                          src={post.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'} 
                          alt="" 
                          className="author-avatar"
                        />
                        <span className="author-name">{post.author}</span>
                      </div>
                      <div className="card-stats">
                        <span>👍 {post.likes || 0}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            <div className="waterfall-column right-column">
              {posts.filter((_, index) => index % 2 === 1).map(post => (
                <Card 
                  key={post.id}
                  className="feed-card"
                  onClick={() => goToDetail(post.id)}
                >
                  {/* 图片 */}
                  {post.images && post.images[0] && (
                    <div className="card-image">
                      <Image 
                        src={post.images[0]}
                        fit="cover"
                        lazyload
                      />
                    </div>
                  )}
                  
                  {/* 内容 */}
                  <div className="card-content">
                    <div className="card-text">{post.content}</div>
                    <div className="card-footer">
                      <div className="card-author">
                        <img 
                          src={post.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'} 
                          alt="" 
                          className="author-avatar"
                        />
                        <span className="author-name">{post.author}</span>
                      </div>
                      <div className="card-stats">
                        <span>👍 {post.likes || 0}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}
      </main>
    </article>
  )
}

export default Feed
