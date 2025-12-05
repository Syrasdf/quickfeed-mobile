import { useNavigate } from 'react-router-dom'
import { Search } from 'react-vant'
import TripWaterfall from '../../components/TripWaterfall'
import './index.css'

const Feed = () => {
  const navigate = useNavigate()

  return (
    <article className="feed-page">
      {/* 顶部搜索栏 */}
      <header className="feed-header">
        <div className="header-content">
          <div className="header-search" role="search" onClick={() => navigate('/search')}>
            <Search 
              placeholder="搜索感兴趣的内容" 
              shape="round"
              disabled
              background="transparent"
              aria-label="搜索内容"
            />
          </div>
          <button 
            className="ai-btn"
            aria-label="AI助手"
          >
            <span>AI</span>
          </button>
        </div>
      </header>

      {/* 瀑布流内容区域 */}
      <main className="feed-content">
        <TripWaterfall />
      </main>
    </article>
  )
}

export default Feed
