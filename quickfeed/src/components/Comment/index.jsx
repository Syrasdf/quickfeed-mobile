import { useState, useEffect } from 'react'
import { Dialog, Field, Button, Toast, Empty } from 'react-vant'
import { getComments, addComment, deleteComment } from '../../api/post'
import './index.css'

const Comment = ({ postId, visible, onClose, onCommentCountUpdate }) => {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // 加载评论列表
  useEffect(() => {
    if (visible && postId) {
      loadComments()
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
  const handleDelete = async (commentId) => {
    try {
      await Dialog.confirm({
        title: '确认删除',
        message: '确定要删除这条评论吗？'
      })
      
      await deleteComment(commentId)
      setComments(comments.filter(c => c.id !== commentId))
      Toast.success('删除成功')
      
      // 更新评论数
      if (onCommentCountUpdate) {
        onCommentCountUpdate(comments.length - 1)
      }
    } catch (error) {
      // 用户取消或删除失败
      if (error.message !== 'cancel') {
        Toast.fail('删除失败')
      }
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

        {/* 评论列表 */}
        <div className="comment-list">
          {loading ? (
            <div className="comment-loading">加载中...</div>
          ) : comments.length > 0 ? (
            comments.map(comment => (
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
                    <button className="comment-like-btn">
                      <span>👍</span>
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
    </Dialog>
  )
}

export default Comment
