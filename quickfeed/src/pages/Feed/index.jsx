import { Search } from 'react-vant'
import './index.css'

const Feed = () => {
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
        <section className="waterfall-container" aria-label="内容瀑布流">
          <div className="waterfall-column left-column">
            {/* 左列图片 */}
          </div>
          <div className="waterfall-column right-column">
            {/* 右列图片 */}
          </div>
        </section>
      </main>
    </article>
  )
}

export default Feed
