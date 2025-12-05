import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { NavBar, Grid, Card, Tag, Image, Loading } from 'react-vant'
import { getPostList } from '../../api/post'
import './index.css'

const Discover = () => {
  const navigate = useNavigate()
  const [hotPosts, setHotPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [hotTopics] = useState([
    { id: 1, name: '美食探店', icon: '🍴', count: '12.3w' },
    { id: 2, name: '旅行打卡', icon: '✈️', count: '8.9w' },
    { id: 3, name: '健身达人', icon: '💪', count: '6.5w' },
    { id: 4, name: '时尚穿搭', icon: '👗', count: '10.2w' },
    { id: 5, name: '读书笔记', icon: '📚', count: '5.4w' },
    { id: 6, name: '摄影教程', icon: '📷', count: '7.8w' },
    { id: 7, name: '美妆教程', icon: '💄', count: '9.1w' },
    { id: 8, name: '萌宠日常', icon: '🐶', count: '11.5w' }
  ])
  const [categories] = useState([
    { name: '美食', icon: '🍜', color: '#FFA500' },
    { name: '旅行', icon: '🇺️', color: '#4169E1' },
    { name: '运动', icon: '⚽', color: '#32CD32' },
    { name: '时尚', icon: '👠', color: '#FF1493' },
    { name: '摄影', icon: '📸', color: '#FF6347' },
    { name: '电影', icon: '🎬', color: '#9370DB' },
    { name: '音乐', icon: '🎵', color: '#FFD700' },
    { name: '游戏', icon: '🎮', color: '#00CED1' }
  ])

  // 加载热门内容
  useEffect(() => {
    loadHotPosts()
  }, [])

  const loadHotPosts = async () => {
    try {
      setLoading(true)
      const data = await getPostList({ page: 1, pageSize: 6 })
      // 按点赞数排序
      const sortedPosts = data.list.sort((a, b) => (b.likes || 0) - (a.likes || 0))
      setHotPosts(sortedPosts)
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

  // 跳转到搜索页
  const goToSearch = (keyword) => {
    navigate('/search')
    // 可以通过状态管理或URL参数传递关键词
  }

  return (
    <article className="discover-page">
      <NavBar 
        title="发现" 
        fixed
        placeholder
        className="discover-nav"
      />
      <main className="discover-content">
        {/* 分类入口 */}
        <div className="category-section">
          <h3 className="section-title">探索分类</h3>
          <Grid columns={4} gap={20}>
            {categories.map((cat, index) => (
              <Grid.Item key={index}>
                <div 
                  className="category-item"
                  onClick={() => goToSearch(cat.name)}
                  style={{ background: `${cat.color}20` }}
                >
                  <span className="category-icon">{cat.icon}</span>
                  <span className="category-name">{cat.name}</span>
                </div>
              </Grid.Item>
            ))}
          </Grid>
        </div>

        {/* 热门话题 */}
        <div className="topics-section">
          <div className="section-header">
            <h3 className="section-title">🔥 热门话题</h3>
            <span className="more-link" onClick={() => goToSearch('')}>更多</span>
          </div>
          <div className="topics-grid">
            {hotTopics.map((topic) => (
              <Tag
                key={topic.id}
                size="large"
                plain
                onClick={() => goToSearch(topic.name)}
                className="topic-tag"
              >
                <span className="topic-icon">{topic.icon}</span>
                <div className="topic-content">
                  <div className="topic-name">#{topic.name}</div>
                  <div className="topic-count">{topic.count}讨论</div>
                </div>
              </Tag>
            ))}
          </div>
        </div>

        {/* 热门推荐 */}
        <div className="hot-section">
          <div className="section-header">
            <h3 className="section-title">🚀 热门推荐</h3>
            <span className="more-link" onClick={() => navigate('/')}>更多</span>
          </div>
          {loading ? (
            <div className="loading-container">
              <Loading size="48px">加载中...</Loading>
            </div>
          ) : (
            <div className="hot-posts">
              {hotPosts.map((post, index) => (
                <Card 
                  key={post.id}
                  className="hot-card"
                  onClick={() => goToDetail(post.id)}
                >
                  <div className="hot-card-content">
                    <div className="hot-rank">
                      {index < 3 ? '🆙' : ''}
                      {index + 1}
                    </div>
                    <div className="hot-info">
                      <h4 className="hot-title">{post.content.slice(0, 30)}{post.content.length > 30 && '...'}</h4>
                      <div className="hot-meta">
                        <span className="hot-author">@{post.author}</span>
                        <span className="hot-stats">🔥 {post.likes || 0}</span>
                      </div>
                    </div>
                    {post.images && post.images[0] && (
                      <Image
                        src={post.images[0]}
                        fit="cover"
                        width={120}
                        height={80}
                        className="hot-image"
                      />
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* 每日精选 */}
        <div className="daily-section">
          <div className="section-header">
            <h3 className="section-title">✨ 每日精选</h3>
          </div>
          <div className="daily-tip">
            <div className="daily-quote">
              <p>“生活不是等待风暴过去，而是学会在雨中跳舞”</p>
              <span className="quote-author">- 今日格言</span>
            </div>
          </div>
        </div>
      </main>
    </article>
  )
}

export default Discover
