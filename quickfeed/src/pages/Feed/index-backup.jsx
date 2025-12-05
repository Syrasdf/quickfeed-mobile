import { useNavigate } from 'react-router-dom'
import { Search } from 'react-vant'
import SimpleWaterfall from '../../components/SimpleWaterfall'
import './index.css'

const Feed = () => {
  const navigate = useNavigate()

  // 设置交叉观察器以实现无限滚动
  useEffect(() => {
    if (!loadMoreRef.current) return
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore && hasMore && !loading) {
          loadMore()
        }
      },
      { threshold: 0.1 }
    )
    
    observerRef.current = observer
    observer.observe(loadMoreRef.current)
    
    return () => {
      if (observerRef.current && loadMoreRef.current) {
        observerRef.current.unobserve(loadMoreRef.current)
      }
    }
  }, [loadingMore, hasMore, loading])
  
  const loadPosts = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true)
        setPage(1)
      } else {
        setLoading(true)
      }
      
      const data = await getPostList({ page: isRefresh ? 1 : page, pageSize: 10 })
      // 添加点赞状态
      const postsWithLikeStatus = data.list.map(post => ({
        ...post,
        isLiked: getLikeStatus(post.id)
      }))
      
      if (isRefresh) {
        setPosts(postsWithLikeStatus)
        setHasMore(data.list.length === 10)
      } else {
        setPosts(postsWithLikeStatus)
        setHasMore(data.list.length === 10)
      }
    } catch (error) {
      console.error('加载失败:', error)
      Toast.fail('加载失败')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // 加载更多
  const loadMore = async () => {
    if (loadingMore || !hasMore) return
    
    try {
      setLoadingMore(true)
      const nextPage = page + 1
      const data = await getPostList({ page: nextPage, pageSize: 10 })
      
      // 添加点赞状态
      const postsWithLikeStatus = data.list.map(post => ({
        ...post,
        isLiked: getLikeStatus(post.id)
      }))
      
      setPosts(prev => [...prev, ...postsWithLikeStatus])
      setPage(nextPage)
      setHasMore(data.list.length === 10)
    } catch (error) {
      console.error('加载更多失败:', error)
      Toast.fail('加载失败')
    } finally {
      setLoadingMore(false)
    }
  }

  // 下拉刷新
  const onRefresh = async () => {
    await loadPosts(true)
  }
  
  // 跳转到详情页
  const goToDetail = (id) => {
    navigate(`/detail/${id}`)
  }
  
  // 处理点赞
  const handleLike = async (e, postId) => {
    e.stopPropagation() // 阻止事件冒泡
    try {
      const result = await likePost(postId)
      // 更新点赞状态
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId 
            ? { ...post, isLiked: result.isLiked, likes: result.likes }
            : post
        )
      )
    } catch (error) {
      Toast.fail('点赞失败')
    }
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
        ) : posts.length > 0 ? (
          <PullRefresh
            value={refreshing}
            onRefresh={onRefresh}
            successText="刷新成功"
            pullText="下拉刷新"
            loosingText="释放刷新"
            loadingText="刷新中..."
          >
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
                        <button 
                          className={`like-btn ${post.isLiked ? 'liked' : ''}`}
                          onClick={(e) => handleLike(e, post.id)}
                        >
                          <span>{post.isLiked ? '❤️' : '🤍'}</span>
                          <span>{post.likes || 0}</span>
                        </button>
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
                        <button 
                          className={`like-btn ${post.isLiked ? 'liked' : ''}`}
                          onClick={(e) => handleLike(e, post.id)}
                        >
                          <span>{post.isLiked ? '❤️' : '🤍'}</span>
                          <span>{post.likes || 0}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            </section>
            
            {/* 加载更多指示器 */}
            <div ref={loadMoreRef} className="load-more-indicator">
              {loadingMore && (
                <div className="loading-more">
                  <Loading size="36px">加载更多...</Loading>
                </div>
              )}
              {!hasMore && posts.length > 0 && (
                <div className="no-more">没有更多内容了</div>
              )}
            </div>
          </PullRefresh>
        ) : (
          // 没有内容时只显示瀑布流
          <div></div>
        )}
        
        {/* 瀑布流推荐区域 */}
        {!loading && (
          <SimpleWaterfall />
        )}
      </main>
    </article>
  )
}

export default Feed
