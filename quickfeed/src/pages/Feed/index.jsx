import { useState } from 'react'
import { Search, Tabs } from 'react-vant'
import { Plus, Fire } from '@react-vant/icons'
import './index.css'

const Feed = () => {
  const [activeTab, setActiveTab] = useState('recommend')

  return (
    <article className="feed-page">
      {/* 顶部搜索栏 */}
      <header className="feed-header">
        <div className="header-search" role="search">
          <Search 
            placeholder="搜索感兴趣的内容" 
            shape="round"
            disabled
            background="transparent"
            aria-label="搜索内容"
          />
        </div>
        <nav className="header-actions" aria-label="快捷操作">
          <button 
            className="action-btn publish-btn"
            aria-label="发布内容"
          >
            <Plus fontSize={20} />
            <span>发布</span>
          </button>
          <button 
            className="action-btn ai-btn"
            aria-label="AI助手"
          >
            <span>AI</span>
          </button>
        </nav>
      </header>

      {/* Tab导航栏 */}
      <nav className="feed-tabs" aria-label="内容分类">
        <Tabs 
          active={activeTab} 
          onChange={setActiveTab}
          sticky
          offsetTop={64}
        >
          <Tabs.TabPane name="follow" title="关注" />
          <Tabs.TabPane name="recommend" title="推荐" />
          <Tabs.TabPane name="hot" title="热榜" />
          <Tabs.TabPane name="video" title="视频" />
          <Tabs.TabPane name="image" title="图片" />
        </Tabs>
      </nav>

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
