import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Card, Image, Loading, Empty, Tag } from 'react-vant'
import { getPostList } from '../../api/post'
import './index.css'

const SearchPage = () => {
  const navigate = useNavigate()
  const [keyword, setKeyword] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [hotKeywords] = useState(['美食', '旅行', '摄影', '日常', '穿搭', '美妆', '健身', '读书'])
  const [searchHistory, setSearchHistory] = useState(() => {
    const history = localStorage.getItem('searchHistory')
    return history ? JSON.parse(history) : []
  })

  // 执行搜索
  const handleSearch = async (searchKeyword) => {
    const trimmedKeyword = (searchKeyword || keyword).trim()
    if (!trimmedKeyword) return

    setLoading(true)
    setSearched(true)
    
    // 添加到搜索历史
    const newHistory = [trimmedKeyword, ...searchHistory.filter(k => k !== trimmedKeyword)].slice(0, 10)
    setSearchHistory(newHistory)
    localStorage.setItem('searchHistory', JSON.stringify(newHistory))

    try {
      // 获取所有文章并过滤
      const data = await getPostList({ page: 1, pageSize: 100 })
      const filtered = data.list.filter(post => 
        post.content.includes(trimmedKeyword) || 
        post.author.includes(trimmedKeyword) ||
        (post.tags && post.tags.some(tag => tag.includes(trimmedKeyword)))
      )
      setResults(filtered)
    } catch (error) {
      console.error('搜索失败:', error)
    } finally {
      setLoading(false)
    }
  }

  // 清除搜索历史
  const clearHistory = () => {
    setSearchHistory([])
    localStorage.removeItem('searchHistory')
  }

  // 跳转到详情页
  const goToDetail = (id) => {
    navigate(`/detail/${id}`)
  }

  return (
    <div className="search-page">
      {/* 搜索栏 */}
      <div className="search-header">
        <Search
          value={keyword}
          onChange={setKeyword}
          placeholder="搜索感兴趣的内容"
          shape="round"
          onSearch={handleSearch}
          showAction
          actionText="取消"
          onCancel={() => navigate(-1)}
          autoFocus
        />
      </div>

      {/* 搜索结果或推荐内容 */}
      {!searched ? (
        <div className="search-recommend">
          {/* 搜索历史 */}
          {searchHistory.length > 0 && (
            <div className="search-section">
              <div className="section-header">
                <h3>搜索历史</h3>
                <span className="clear-btn" onClick={clearHistory}>清空</span>
              </div>
              <div className="tag-list">
                {searchHistory.map((item, index) => (
                  <Tag 
                    key={index}
                    size="large"
                    plain
                    onClick={() => {
                      setKeyword(item)
                      handleSearch(item)
                    }}
                  >
                    {item}
                  </Tag>
                ))}
              </div>
            </div>
          )}

          {/* 热门搜索 */}
          <div className="search-section">
            <div className="section-header">
              <h3>热门搜索</h3>
            </div>
            <div className="tag-list">
              {hotKeywords.map((item, index) => (
                <Tag 
                  key={index}
                  size="large"
                  plain
                  type={index < 3 ? 'danger' : 'default'}
                  onClick={() => {
                    setKeyword(item)
                    handleSearch(item)
                  }}
                >
                  {index < 3 && <span className="hot-icon">🔥</span>}
                  {item}
                </Tag>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="search-results">
          {loading ? (
            <div className="loading-container">
              <Loading size="48px">搜索中...</Loading>
            </div>
          ) : results.length > 0 ? (
            <div className="results-list">
              <div className="results-count">共找到 {results.length} 条结果</div>
              {results.map(post => (
                <Card 
                  key={post.id}
                  className="result-card"
                  onClick={() => goToDetail(post.id)}
                >
                  <div className="result-content">
                    <div className="result-text">
                      <h4>{post.content.slice(0, 50)}{post.content.length > 50 && '...'}</h4>
                      <div className="result-meta">
                        <span className="author">@{post.author}</span>
                        <span className="stats">👍 {post.likes || 0}</span>
                      </div>
                    </div>
                    {post.images && post.images[0] && (
                      <div className="result-image">
                        <Image 
                          src={post.images[0]}
                          fit="cover"
                          width={80}
                          height={80}
                        />
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Empty description="暂无搜索结果" />
          )}
        </div>
      )}
    </div>
  )
}

export default SearchPage