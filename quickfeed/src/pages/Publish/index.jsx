import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { NavBar, Field, Button, Uploader, Tag } from 'react-vant'
import Toast from '../../utils/toast'
import { publishPost, updatePost, getPostDetail } from '../../api/post'
import { extractTags } from '../../utils/llm'
import './index.css'

const Publish = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const editId = searchParams.get('edit') // 获取编辑的文章ID
  const isEditMode = !!editId // 是否是编辑模式
  
  const [content, setContent] = useState('')
  const [images, setImages] = useState([])
  const [tags, setTags] = useState([])
  const [tagInput, setTagInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [autoTagsEnabled, setAutoTagsEnabled] = useState(true)
  const [lastSaveTime, setLastSaveTime] = useState(null)
  const [initialLoading, setInitialLoading] = useState(false)
  const draftTimerRef = useRef(null)

  // 保存草稿到 localStorage
  const saveDraft = useCallback(() => {
    const draft = {
      content,
      images,
      tags,
      savedAt: new Date().toISOString()
    }
    
    try {
      localStorage.setItem('publish_draft', JSON.stringify(draft))
      setLastSaveTime(new Date())
      console.log('草稿已自动保存', new Date().toLocaleTimeString())
    } catch (error) {
      console.error('保存草稿失败:', error)
    }
  }, [content, images, tags])

  // 加载草稿
  const loadDraft = () => {
    try {
      const draftStr = localStorage.getItem('publish_draft')
      if (draftStr) {
        const draft = JSON.parse(draftStr)
        return draft
      }
    } catch (error) {
      console.error('加载草稿失败:', error)
    }
    return null
  }

  // 清除草稿
  const clearDraft = () => {
    try {
      localStorage.removeItem('publish_draft')
      if (draftTimerRef.current) {
        clearInterval(draftTimerRef.current)
      }
    } catch (error) {
      console.error('清除草稿失败:', error)
    }
  }

  // 编辑模式下加载原文章内容
  useEffect(() => {
    const loadPostForEdit = async () => {
      if (!editId) return
      
      try {
        setInitialLoading(true)
        Toast.loading({
          message: '加载中...',
          duration: 0,
          forbidClick: true
        })
        
        const post = await getPostDetail(editId)
        
        // 填充表单数据
        setContent(post.content || '')
        setTags(post.tags || [])
        
        // 转换图片格式以适配 Uploader 组件
        if (post.images && post.images.length > 0) {
          const formattedImages = post.images.map((url, index) => ({
            url,
            file: null,
            key: `existing-${index}`
          }))
          setImages(formattedImages)
        }
        
        Toast.clear()
      } catch (error) {
        console.error('加载文章失败:', error)
        Toast({ message: '加载失败', icon: 'fail' })
        // 加载失败返回上一页
        setTimeout(() => navigate(-1), 1500)
      } finally {
        setInitialLoading(false)
      }
    }
    
    if (isEditMode) {
      loadPostForEdit()
    }
  }, [editId, isEditMode, navigate])

  // 初始化加载草稿（非编辑模式）
  useEffect(() => {
    // 编辑模式不加载草稿
    if (isEditMode) return
    
    const draft = loadDraft()
    if (draft) {
      const timeDiff = Date.now() - new Date(draft.savedAt).getTime()
      const hoursDiff = timeDiff / (1000 * 60 * 60)
      
      // 如果草稿在24小时内，询问是否恢复
      if (hoursDiff < 24) {
        const savedTime = new Date(draft.savedAt).toLocaleString()
        if (window.confirm(`发现未发布的草稿（保存于 ${savedTime}），是否恢复？`)) {
          setContent(draft.content || '')
          setImages(draft.images || [])
          setTags(draft.tags || [])
          Toast({ message: '草稿已恢复', icon: 'success' })
        }
      }
    }
  }, [isEditMode])

  // 自动保存草稿（每30秒，仅在非编辑模式下）
  useEffect(() => {
    // 编辑模式不保存草稿
    if (isEditMode) return
    
    // 清除之前的定时器
    if (draftTimerRef.current) {
      clearInterval(draftTimerRef.current)
    }

    // 只有当有内容时才启动自动保存
    if (content || images.length > 0 || tags.length > 0) {
      // 立即保存一次
      saveDraft()
      
      // 设置定时保存
      draftTimerRef.current = setInterval(() => {
        saveDraft()
      }, 30000) // 30秒
    }

    // 清理函数
    return () => {
      if (draftTimerRef.current) {
        clearInterval(draftTimerRef.current)
      }
    }
  }, [content, images, tags, saveDraft, isEditMode])

  // AI 自动生成标签
  const generateAITags = async () => {
    if (!content.trim()) {
      Toast({ message: '请先输入内容', icon: 'fail' })
      return
    }

    setAiLoading(true)
    Toast.loading({
      message: 'AI 正在分析内容...',
      duration: 0,
      forbidClick: true
    })

    try {
      const aiTags = await extractTags(content, images)
      
      // 合并标签（去重）
      const newTags = [...new Set([...tags, ...aiTags])].slice(0, 5)
      setTags(newTags)
      
      Toast.clear()
      Toast({ message: '标签生成成功', icon: 'success' })
    } catch (error) {
      console.error('AI 标签生成失败:', error)
      Toast({ message: '标签生成失败', icon: 'fail' })
    } finally {
      setAiLoading(false)
    }
  }

  // 处理发布/更新
  const handlePublish = async () => {
    if (!content.trim()) {
      Toast({ message: '请输入内容', icon: 'fail' })
      return
    }

    try {
      setLoading(true)
      
      // 构造发布数据
      const postData = {
        content: content.trim(),
        images: images.map(img => img.url),
        tags
      }
      
      if (isEditMode) {
        // 编辑模式：调用更新接口
        await updatePost(editId, postData)
        Toast({ message: '更新成功', icon: 'success' })
        
        // 跳转回详情页
        setTimeout(() => {
          navigate(`/detail/${editId}`, { replace: true })
        }, 500)
      } else {
        // 发布模式：调用发布接口
        await publishPost(postData)
        
        // 发布成功，清除草稿
        clearDraft()
        
        Toast({ message: '发布成功', icon: 'success' })
        
        // 跳转到首页
        setTimeout(() => {
          navigate('/', { replace: true })
        }, 500)
      }
    } catch (error) {
      console.error(isEditMode ? '更新失败:' : '发布失败:', error)
      Toast({ message: isEditMode ? '更新失败' : '发布失败', icon: 'fail' })
    } finally {
      setLoading(false)
    }
  }

  // 处理图片上传
  const handleImageUpload = (file) => {
    return new Promise((resolve, reject) => {
      try {
        // 检查文件类型
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
        
        // 检查file参数
        if (!file) {
          reject(new Error('No file provided'))
          return
        }
        
        // 获取实际的File对象
        let actualFile = file
        if (file.file) {
          actualFile = file.file
        }
        
        // 如果已经有url（编辑模式），直接返回
        if (typeof file === 'string' || (file.url && typeof file.url === 'string')) {
          resolve({
            url: file.url || file,
            status: 'done'
          })
          return
        }
        
        // 检查是否是有效的文件对象
        if (!actualFile || (!actualFile.type && !actualFile.size)) {
          console.error('Invalid file object:', actualFile)
          reject(new Error('Invalid file object'))
          return
        }
        
        // 检查文件类型
        if (actualFile.type && !validTypes.includes(actualFile.type)) {
          Toast({ message: '请选择图片文件', icon: 'fail' })
          reject(new Error('Invalid file type: ' + actualFile.type))
          return
        }
        
        // 创建FileReader
        const reader = new FileReader()
        
        reader.onload = (e) => {
          resolve({
            url: e.target.result,
            status: 'done'
          })
        }
        
        reader.onerror = (error) => {
          console.error('FileReader error:', error)
          Toast({ message: '图片读取失败', icon: 'fail' })
          reject(error)
        }
        
        // 读取文件
        reader.readAsDataURL(actualFile)
      } catch (error) {
        console.error('Upload error:', error)
        Toast({ message: '图片上传失败', icon: 'fail' })
        reject(error)
      }
    })
  }

  // 添加标签
  const addTag = () => {
    const trimmedTag = tagInput.trim()
    if (!trimmedTag) return
    
    // 检查是否重复
    if (tags.includes(trimmedTag)) {
      Toast({ message: '标签已存在', icon: 'fail' })
      return
    }
    
    // 最多5个标签
    if (tags.length >= 5) {
      Toast({ message: '最多添加5个标签', icon: 'fail' })
      return
    }
    
    setTags([...tags, trimmedTag])
    setTagInput('')
  }

  // 删除标签
  const removeTag = (tag) => {
    setTags(tags.filter(t => t !== tag))
  }

  return (
    <div className="publish-page">
      <NavBar
        title={isEditMode ? "编辑动态" : "发布动态"}
        leftText="←"
        onClickLeft={() => navigate(-1)}
        rightText={
          <Button
            type="primary"
            size="small"
            loading={loading}
            onClick={handlePublish}
            className="publish-submit-btn"
          >
            {isEditMode ? '更新' : '发布'}
          </Button>
        }
        className="publish-nav"
      />

      <div className="publish-container">
        {/* 文本输入区域 */}
        <div className="publish-content">
          <Field
            value={content}
            onChange={setContent}
            placeholder="分享新鲜事..."
            type="textarea"
            rows={6}
            maxLength={500}
            showWordLimit
            className="publish-textarea"
          />
        </div>

        {/* 图片上传区域 */}
        <div className="publish-images">
          <Uploader
            value={images}
            onChange={setImages}
            upload={handleImageUpload}
            maxCount={9}
            multiple
            maxSize={10 * 1024 * 1024}
            onOversize={() => Toast({ message: '文件大小不能超过10MB', icon: 'fail' })}
          />
        </div>

        {/* 标签输入区域 */}
        <div className="publish-tags">
          <div className="tag-header">
            <span className="tag-title">添加标签</span>
            <Button
              size="small"
              type="default"
              plain
              onClick={generateAITags}
              loading={aiLoading}
              className="ai-tag-btn"
            >
              🤖 AI生成
            </Button>
          </div>
          <div className="tag-input-wrapper">
            <Field
              value={tagInput}
              onChange={setTagInput}
              placeholder="添加标签（回车添加）"
              maxLength={20}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addTag()
                }
              }}
            />
            <Button 
              size="small" 
              type="primary"
              onClick={addTag}
            >
              添加
            </Button>
          </div>
          
          {/* 标签列表 */}
          {tags.length > 0 && (
            <div className="tag-list">
              {tags.map((tag, index) => (
                <Tag
                  key={index}
                  plain
                  type="primary"
                  closeable
                  onClose={() => removeTag(tag)}
                >
                  #{tag}
                </Tag>
              ))}
            </div>
          )}
        </div>

        {/* 功能按钮 */}
        <div className="publish-tools">
          <button className="tool-btn">
            <span style={{fontSize: 20}}>📷</span>
            <span>图片</span>
          </button>
          <button className="tool-btn" onClick={() => setTagInput('美食')}>
            <span style={{fontSize: 20}}>🎯</span>
            <span>标签</span>
          </button>
        </div>
        
        {/* 草稿保存状态（编辑模式不显示） */}
        {!isEditMode && lastSaveTime && (
          <div className="draft-status">
            <span className="draft-icon">📝</span>
            <span className="draft-text">
              草稿已保存于 {lastSaveTime.toLocaleTimeString()}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export default Publish
