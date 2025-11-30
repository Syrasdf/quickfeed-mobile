import { useState, useEffect } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { Form, Input, Button, NavBar } from 'react-vant'
import useUserStore from '../../store/userStore'
import { login } from '../../api/auth'
import './index.css'

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login: setLogin, isLogin } = useUserStore()
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()
  const [redirectMessage, setRedirectMessage] = useState('')
  
  // 显示来源页面的消息
  useEffect(() => {
    if (location.state?.message) {
      setRedirectMessage(location.state.message)
      // 3秒后清除消息
      setTimeout(() => setRedirectMessage(''), 3000)
    }
  }, [])
  
  // 如果已经登录，跳转到首页
  useEffect(() => {
    if (isLogin) {
      navigate('/', { replace: true })
    }
  }, [isLogin])

  // 处理登录
  const handleLogin = async (values) => {
    try {
      setLoading(true)
      
      // 调用登录接口
      const res = await login(values)
      
      // 保存用户信息
      setLogin(res.token, res.userInfo)
      
      // 登录成功，直接跳转
      
      // 跳转到之前的页面或首页
      const from = location.state?.from || '/'
      setTimeout(() => {
        navigate(from, { replace: true })
      }, 500)
    } catch (error) {
      console.error('登录失败:', error)
    } finally {
      setLoading(false)
    }
  }

  // 验证规则
  const rules = {
    username: [
      { required: true, message: '请输入用户名' },
      { min: 3, message: '用户名至少3个字符' }
    ],
    password: [
      { required: true, message: '请输入密码' },
      { min: 6, message: '密码至少6个字符' }
    ]
  }

  return (
    <div className="login-page">
      <NavBar 
        title="登录" 
        leftText="←"
        onClickLeft={() => navigate('/')}
        className="login-nav"
      />
      
      <div className="login-container">
        {/* 提示消息 */}
        {redirectMessage && (
          <div className="login-message">
            {redirectMessage}
          </div>
        )}
        
        {/* Logo区域 */}
        <div className="login-header">
          <div className="app-logo">
            <div className="logo-icon">Q</div>
          </div>
          <h1 className="app-name">QuickFeed</h1>
          <p className="app-desc">发现精彩，分享生活</p>
        </div>

        {/* 登录表单 */}
        <div className="login-form">
          <Form 
            form={form}
            onFinish={handleLogin}
            footer={
              <div className="form-footer">
                <Button 
                  block 
                  type="primary" 
                  nativeType="submit"
                  loading={loading}
                  className="login-btn"
                  size="large"
                >
                  登录
                </Button>
              </div>
            }
          >
            <Form.Item 
              name="username"
              rules={rules.username}
            >
              <Input
                placeholder="请输入用户名"
                clearable
                size="large"
              />
            </Form.Item>

            <Form.Item 
              name="password"
              rules={rules.password}
            >
              <Input
                type="password"
                placeholder="请输入密码"
                clearable
                size="large"
              />
            </Form.Item>
          </Form>

          {/* 其他操作 */}
          <div className="login-footer">
            <Link to="/register" className="register-link">
              还没有账号？立即注册
            </Link>
            <Link to="/forgot" className="forgot-link">
              忘记密码
            </Link>
          </div>

          {/* 其他登录方式 */}
          <div className="other-login">
            <div className="divider">
              <span>其他登录方式</span>
            </div>
            <div className="login-icons">
              <button className="icon-btn wechat-btn">
                <span>微信</span>
              </button>
              <button className="icon-btn qq-btn">
                <span>QQ</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
