import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { NavBar, Field, Button, Uploader } from 'react-vant'
import './index.css'

const Publish = () => {
  const navigate = useNavigate()
  const [content, setContent] = useState('')
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)

  // 处理发布
  const handlePublish = async () => {
    if (!content.trim() && images.length === 0) {
      alert('请输入内容或选择图片')
      return
    }

    try {
      setLoading(true)
      
      // TODO: 调用发布接口
      console.log('发布内容:', { content, images })
      
      // 发布成功
      
      // 发布成功后返回首页
      setTimeout(() => {
        navigate('/', { replace: true })
      }, 500)
    } catch (error) {
      console.error('发布失败:', error)
      alert('发布失败')
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

        {/* 功能按钮 */}
        <div className="publish-tools">
          <button className="tool-btn">
            <span style={{fontSize: 20}}>📷</span>
            <span>图片</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Publish
