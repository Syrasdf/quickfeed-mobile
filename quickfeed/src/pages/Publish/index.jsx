import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { NavBar, Field, Button, Uploader, Toast, Tag } from 'react-vant'
import { publishPost } from '../../api/post'
import './index.css'

const Publish = () => {
  const navigate = useNavigate()
  const [content, setContent] = useState('')
  const [images, setImages] = useState([])
  const [tags, setTags] = useState([])
  const [tagInput, setTagInput] = useState('')
  const [loading, setLoading] = useState(false)

  // 处理发布
  const handlePublish = async () => {
    if (!content.trim() && images.length === 0) {
      alert('请输入内容或选择图片')
      return
    }

    try {
      setLoading(true)
      
      // 调用发布接口
      const newPost = await publishPost({
        content,
        images: images.map(img => img.url),
        tags: tags
      })
      
      // 发布成功
      Toast.success('发布成功')
      
      // 发布成功后返回首页
      setTimeout(() => {
        navigate('/', { replace: true })
      }, 500)
    } catch (error) {
      console.error('发布失败:', error)
      Toast.fail('发布失败')
    } finally {
      setLoading(false)
    }
  }

  // 处理图片上传
  const handleImageUpload = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.readAsDataURL(file.file)
      reader.onload = () => {
        resolve({
          url: reader.result,
          file: file.file
        })
      }
    })
  }

  // 添加标签
  const addTag = () => {
    const trimmedTag = tagInput.trim()
    if (!trimmedTag) return
    
    // 检查是否重复
    if (tags.includes(trimmedTag)) {
      Toast.fail('标签已存在')
      return
    }
    
    // 最多5个标签
    if (tags.length >= 5) {
      Toast.fail('最多添加5个标签')
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
        title="发布动态"
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
            发布
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
          />
        </div>

        {/* 标签输入区域 */}
        <div className="publish-tags">
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
      </div>
    </div>
  )
}

export default Publish
