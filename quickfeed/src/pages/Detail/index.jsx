import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { NavBar, Image, Tag, Loading, Empty, Button, ShareSheet, Dialog } from 'react-vant'
import Toast from '../../utils/toast'
import { getPostDetail, likePost, getLikeStatus, collectPost, getCollectStatus, deletePost } from '../../api/post'
import Comment from '../../components/Comment'
import './index.css'

const Detail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [shareVisible, setShareVisible] = useState(false)
  const [imagePreview, setImagePreview] = useState(false)
  const [previewIndex, setPreviewIndex] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [isCollected, setIsCollected] = useState(false)
  const [likes, setLikes] = useState(0)
  const [commentVisible, setCommentVisible] = useState(false)
  const [commentCount, setCommentCount] = useState(0)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  // 加载文章详情
  useEffect(() => {
    loadPostDetail()
  }, [id])

  const loadPostDetail = async () => {
    try {
      setLoading(true)
      const data = await getPostDetail(id)
      setPost(data)
      setIsLiked(getLikeStatus(id))
      setIsCollected(getCollectStatus(id))
      setLikes(data.likes || 0)
      setCommentCount(data.comments || 0)
    } catch (error) {
      console.error('加载失败:', error)
    } finally {
      setLoading(false)
    }
  }

  // 格式化时间
  const formatTime = (date) => {
    if (!date) return ''
    const d = new Date(date)
    const now = new Date()
    const diff = (now - d) / 1000 // 秒

    if (diff < 60) return '刚刚'
    if (diff < 3600) return Math.floor(diff / 60) + '分钟前'
    if (diff < 86400) return Math.floor(diff / 3600) + '小时前'
    if (diff < 604800) return Math.floor(diff / 86400) + '天前'
    
    return `${d.getMonth() + 1}-${d.getDate()}`
  }

  // 处理编辑
  const handleEdit = () => {
    navigate(`/publish?edit=${id}`)
  }

  // 处理删除
  const handleDelete = () => {
    setShowDeleteDialog(true)
  }

  // 确认删除
  const confirmDelete = async () => {
    try {
      Toast.loading({
        message: '删除中...',
        forbidClick: true,
        duration: 0
      })
      
      // 调用删除接口
      await deletePost(id)
      
      Toast.clear()
      Toast({ message: '删除成功', icon: 'success' })
      
      // 删除成功后跳转到首页
      setTimeout(() => {
        navigate('/', { replace: true })
      }, 500)
    } catch (error) {
      Toast.clear()
      Toast({ message: '删除失败', icon: 'fail' })
    } finally {
      setShowDeleteDialog(false)
    }
  }

  // 分享选项
  const shareOptions = [
    { name: '微信', icon: '📱' },
    { name: '朋友圈', icon: '🌐' },
    { name: '微博', icon: '📝' },
    { name: '复制链接', icon: '🔗' }
  ]

  // 处理分享
  const handleShare = (option) => {
    setShareVisible(false)
    
    // 模拟分享功能
    if (option.name === '复制链接') {
      // 复制链接到剪贴板
      const url = window.location.href
      if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => {
          Toast({ message: '链接已复制', icon: 'success' })
        }).catch(() => {
          Toast({ message: '复制失败', icon: 'fail' })
        })
      } else {
        // 备用方案
        const input = document.createElement('input')
        input.value = url
        document.body.appendChild(input)
        input.select()
        document.execCommand('copy')
        document.body.removeChild(input)
        Toast({ message: '链接已复制', icon: 'success' })
      }
    } else {
      // 其他分享方式（模拟）
      Toast(`已打开${option.name}分享`)
      // 实际项目中可以调用对应的SDK或者使用Web Share API
      // if (navigator.share) {
      //   navigator.share({
      //     title: '分享文章',
      //     text: post.content,
      //     url: window.location.href
      //   })
      // }
    }
  }

  // 预览图片
  const handleImageClick = (index) => {
    setPreviewIndex(index)
    setImagePreview(true)
  }

  // 处理点赞
  const handleLike = () => {
    console.log('点击点赞，当前ID:', id, '当前状态:', isLiked, '当前点赞数:', likes)
    
    // 立即更新UI（乐观更新）
    const newIsLiked = !isLiked
    const newLikes = newIsLiked ? likes + 1 : Math.max(0, likes - 1)
    
    setIsLiked(newIsLiked)
    setLikes(newLikes)
    
    // 更新post对象
    if (post) {
      setPost({...post, likes: newLikes})
    }
    
    // 异步调用API
    likePost(id).then(result => {
      console.log('点赞API返回:', result)
      setIsLiked(result.isLiked)
      setLikes(result.likes)
      if (post) {
        setPost({...post, likes: result.likes})
      }
    }).catch(error => {
      console.error('点赞失败:', error)
      // 回滚状态
      setIsLiked(isLiked)
      setLikes(likes)
      if (post) {
        setPost({...post, likes: likes})
      }
      Toast({ message: '点赞失败', icon: 'fail' })
    })
  }

  // 处理收藏
  const handleCollect = async () => {
    try {
      const result = await collectPost(id)
      setIsCollected(result.isCollected)
      Toast({ message: result.isCollected ? '收藏成功' : '取消收藏', icon: 'success' })
    } catch (error) {
      Toast({ message: '操作失败', icon: 'fail' })
    }
  }

  if (loading) {
    return (
      <div className="detail-page">
        <NavBar 
          title="详情" 
          leftText="返回"
          onClickLeft={() => navigate(-1)}
        />
        <div className="detail-loading">
          <Loading size="48px">加载中...</Loading>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="detail-page">
        <NavBar 
          title="详情" 
          leftText="返回"
          onClickLeft={() => navigate(-1)}
        />
        <Empty description="文章不存在" />
      </div>
    )
  }

  const isOwner = post.userId === 'current_user_id' // TODO: 从userStore获取当前用户ID

  return (
    <div className="detail-page">
      <NavBar 
        title="详情" 
        leftText="返回"
        onClickLeft={() => navigate(-1)}
        rightText={
          <div className="nav-right">
            {isOwner && <span onClick={handleEdit}>编辑</span>}
            <span onClick={() => setShareVisible(true)}>分享</span>
          </div>
        }
      />

      <div className="detail-container">
        {/* 作者信息 */}
        <div className="author-section">
          <div className="author-info">
            <img 
              src={post.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=user'} 
              alt="头像"
              className="author-avatar"
            />
            <div className="author-details">
              <div className="author-name">{post.author || '匿名用户'}</div>
              <div className="post-time">{formatTime(post.createTime)}</div>
            </div>
          </div>
          {isOwner && (
            <Button 
              size="small" 
              type="danger" 
              plain
              onClick={handleDelete}
            >
              删除
            </Button>
          )}
        </div>

        {/* 文章内容 */}
        <div className="content-section">
          <div className="post-content">{post.content}</div>
          
          {/* 图片展示 */}
          {post.images && post.images.length > 0 && (
            <div className="image-grid">
              {post.images.map((img, index) => (
                <div 
                  key={index} 
                  className={`image-item image-count-${post.images.length}`}
                  onClick={() => handleImageClick(index)}
                >
                  <Image 
                    src={img} 
                    fit="cover"
                    lazyload
                  />
                </div>
              ))}
            </div>
          )}

          {/* 标签展示 */}
          {post.tags && post.tags.length > 0 && (
            <div className="tag-section">
              {post.tags.map((tag, index) => (
                <Tag 
                  key={index}
                  type="primary"
                  plain
                  className="post-tag"
                  onClick={() => navigate(`/search?tag=${tag}`)}
                >
                  # {tag}
                </Tag>
              ))}
            </div>
          )}
        </div>

        {/* 统计信息 */}
        <div className="stats-section">
          <div className="stat-item">
            <span className="stat-icon">👁️</span>
            <span className="stat-count">{post.views || 0}</span>
          </div>
          <div 
            className={`stat-item clickable ${isLiked ? 'liked' : ''}`}
            onClick={handleLike}
          >
            <span className="stat-icon">{isLiked ? '❤️' : '👍'}</span>
            <span className="stat-count">{likes}</span>
          </div>
          <div 
            className="stat-item clickable"
            onClick={() => setCommentVisible(true)}
          >
            <span className="stat-icon">💬</span>
            <span className="stat-count">{commentCount}</span>
          </div>
        </div>

        {/* 评论区提示 */}
        <div className="comment-section">
          <h3 className="section-title">
            评论 ({commentCount})
          </h3>
          <Button 
            type="primary" 
            size="large"
            block
            onClick={() => setCommentVisible(true)}
            style={{ marginBottom: '20px' }}
          >
            查看全部评论
          </Button>
        </div>

        {/* 相关推荐 (挑战功能) */}
        <div className="recommend-section">
          <h3 className="section-title">相关推荐</h3>
          <div className="recommend-list">
            <div className="recommend-item">
              <span className="recommend-tag"># 相似话题1</span>
            </div>
            <div className="recommend-item">
              <span className="recommend-tag"># 相似话题2</span>
            </div>
            <div className="recommend-item">
              <span className="recommend-tag"># 相似话题3</span>
            </div>
          </div>
        </div>
      </div>

      {/* 底部操作栏 */}
      <div className="detail-footer">
        <div className="footer-left">
          <input 
            type="text" 
            placeholder="说点什么..." 
            className="comment-input"
            onClick={() => setCommentVisible(true)}
          />
        </div>
        <div className="footer-actions">
          <button 
            className={`action-btn ${isLiked ? 'liked' : ''}`}
            onClick={handleLike}
          >
            <span>{isLiked ? '❤️' : '🤍'}</span>
            <span>{likes}</span>
          </button>
          <button 
            className={`action-btn ${isCollected ? 'collected' : ''}`}
            onClick={handleCollect}
          >
            <span>{isCollected ? '⭐' : '☆'}</span>
          </button>
          <button 
            className="action-btn"
            onClick={() => setCommentVisible(true)}
          >
            <span>💬</span>
            <span>{commentCount}</span>
          </button>
          <button className="action-btn" onClick={() => setShareVisible(true)}>
            <span>🔗</span>
          </button>
        </div>
      </div>

      {/* 分享面板 */}
      <ShareSheet
        visible={shareVisible}
        options={shareOptions}
        onSelect={handleShare}
        onCancel={() => setShareVisible(false)}
      />

      {/* 图片预览 */}
      {imagePreview && post.images && (
        <div 
          className="image-preview-overlay"
          onClick={() => setImagePreview(false)}
        >
          <Image 
            src={post.images[previewIndex]}
            fit="contain"
            className="preview-image"
          />
        </div>
      )}

      {/* 评论组件 */}
      {commentVisible && (
        <Comment 
          postId={id}
          visible={commentVisible}
          onClose={() => setCommentVisible(false)}
          onCommentCountUpdate={setCommentCount}
        />
      )}

      {/* 删除确认对话框 */}
      <Dialog
        visible={showDeleteDialog}
        title="确认删除"
        message="删除后无法恢复，确定要删除吗？"
        showCancelButton
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteDialog(false)}
      />
    </div>
  )
}

export default Detail
