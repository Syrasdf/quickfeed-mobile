import { useState, useEffect } from 'react'
import { Dialog, Field, Button, Empty } from 'react-vant'
import Toast from '../../utils/toast'
import { getComments, addComment, deleteComment } from '../../api/post'
import './index.css'

const Comment = ({ postId, visible, onClose, onCommentCountUpdate }) => {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteCommentId, setDeleteCommentId] = useState(null)
  const [likedComments, setLikedComments] = useState(new Set()) // 存储已点赞的评论ID
  const [sortBy, setSortBy] = useState('time') // 排序方式: 'time' 或 'likes'

  // 加载评论列表
  useEffect(() => {
    if (visible && postId) {
      loadComments()
      // 从localStorage加载已点赞的评论
      const liked = localStorage.getItem(`liked_comments_${postId}`)
      if (liked) {
        setLikedComments(new Set(JSON.parse(liked)))
      }
    }
  }, [visible, postId])

  const loadComments = async () => {
    try {
      setLoading(true)
      const data = await getComments(postId)
      setComments(data.list)
    } catch (error) {
      console.error('加载评论失败:', error)
      Toast.fail('加载评论失败')
    } finally {
      setLoading(false)
    }
  }

  // 处理评论点赞
  const handleLike = (commentId) => {
    const newLikedComments = new Set(likedComments)
    let updatedComments = [...comments]
    const commentIndex = updatedComments.findIndex(c => c.id === commentId)
    
    if (commentIndex !== -1) {
      if (newLikedComments.has(commentId)) {
        // 取消点赞
        newLikedComments.delete(commentId)
        updatedComments[commentIndex] = {
          ...updatedComments[commentIndex],
          likes: Math.max(0, (updatedComments[commentIndex].likes || 0) - 1)
        }
      } else {
        // 添加点赞
        newLikedComments.add(commentId)
        updatedComments[commentIndex] = {
          ...updatedComments[commentIndex],
          likes: (updatedComments[commentIndex].likes || 0) + 1
        }
      }
      
      setComments(updatedComments)
      setLikedComments(newLikedComments)
      // 保存到localStorage
      localStorage.setItem(`liked_comments_${postId}`, JSON.stringify(Array.from(newLikedComments)))
    }
  }

  // 获取排序后的评论列表
  const getSortedComments = () => {
    const sorted = [...comments]
    if (sortBy === 'time') {
      // 按时间排序（最新的在前）
      sorted.sort((a, b) => new Date(b.createTime) - new Date(a.createTime))
    } else if (sortBy === 'likes') {
      // 按点赞数排序（最多的在前）
      sorted.sort((a, b) => (b.likes || 0) - (a.likes || 0))
    }
    return sorted
  }

  // 发布评论
  const handleSubmit = async () => {
    if (!commentText.trim()) {
      Toast.fail('请输入评论内容')
      return
    }

    try {
      setSubmitting(true)
      const newComment = await addComment(postId, commentText.trim())
      setComments([newComment, ...comments])
      setCommentText('')
      Toast.success('评论成功')
      
      // 更新评论数
      if (onCommentCountUpdate) {
        onCommentCountUpdate(comments.length + 1)
      }
    } catch (error) {
      console.error('评论失败:', error)
      Toast.fail('评论失败')
    } finally {
      setSubmitting(false)
    }
  }

  // 删除评论
  const handleDelete = (commentId) => {
    setDeleteCommentId(commentId)
    setShowDeleteDialog(true)
  }

  // 确认删除
  const confirmDelete = async () => {
    try {
      await deleteComment(deleteCommentId)
      setComments(comments.filter(c => c.id !== deleteCommentId))
      Toast.success('删除成功')
      
      // 更新评论数
      if (onCommentCountUpdate) {
        onCommentCountUpdate(comments.length - 1)
      }
    } catch (error) {
      console.error('删除评论失败:', error)
      Toast.fail('删除失败')
    } finally {
      setShowDeleteDialog(false)
      setDeleteCommentId(null)
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
    <Dialog
      visible={visible}
      title="评论"
      showCancelButton={false}
      showConfirmButton={false}
      onClose={onClose}
      className="comment-dialog"
      closeOnClickOverlay
    >
      <div className="comment-container">
        {/* 评论输入区 */}
        <div className="comment-input-area">
          <Field
            value={commentText}
            onChange={setCommentText}
            placeholder="说点什么..."
            type="textarea"
            rows={3}
            maxLength={200}
            showWordLimit
          />
          <Button
            type="primary"
            size="small"
            loading={submitting}
            onClick={handleSubmit}
            className="comment-submit-btn"
          >
            发布
          </Button>
        </div>

        {/* 排序选项 */}
        <div className="comment-sort-bar">
          <div className="comment-count">
            共 <span className="count-number">{comments.length}</span> 条评论
          </div>
          <div className="sort-options">
            <button 
              className={`sort-btn ${sortBy === 'time' ? 'active' : ''}`}
              onClick={() => setSortBy('time')}
            >
              按时间
            </button>
            <button 
              className={`sort-btn ${sortBy === 'likes' ? 'active' : ''}`}
              onClick={() => setSortBy('likes')}
            >
              按热度
            </button>
          </div>
        </div>

        {/* 评论列表 */}
        <div className="comment-list">
          {loading ? (
            <div className="comment-loading">加载中...</div>
          ) : comments.length > 0 ? (
            getSortedComments().map(comment => (
              <div key={comment.id} className="comment-item">
                <img 
                  src={comment.avatar} 
                  alt="" 
                  className="comment-avatar"
                />
                <div className="comment-content">
                  <div className="comment-header">
                    <span className="comment-author">{comment.author}</span>
                    <span className="comment-time">{formatTime(comment.createTime)}</span>
                  </div>
                  <div className="comment-text">{comment.content}</div>
                  <div className="comment-actions">
                    <button 
                      className={`comment-like-btn ${likedComments.has(comment.id) ? 'liked' : ''}`}
                      onClick={() => handleLike(comment.id)}
                    >
                      <span>{likedComments.has(comment.id) ? '❤️' : '🤍'}</span>
                      <span>{comment.likes || 0}</span>
                    </button>
                    {comment.author === '当前用户' && (
                      <button 
                        className="comment-delete-btn"
                        onClick={() => handleDelete(comment.id)}
                      >
                        删除
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <Empty description="暂无评论" />
          )}
        </div>
      </div>

      {/* 删除确认对话框 */}
      <Dialog
        visible={showDeleteDialog}
        title="确认删除"
        message="确定要删除这条评论吗？"
        showCancelButton
        onConfirm={confirmDelete}
        onCancel={() => {
          setShowDeleteDialog(false)
          setDeleteCommentId(null)
        }}
      />
    </Dialog>
  )
}

export default Comment
