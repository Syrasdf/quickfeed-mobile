import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Input, Button, NavBar, Checkbox } from 'react-vant'
import useUserStore from '../../store/userStore'
import { register, sendCode } from '../../api/auth'
import './index.css'

const Register = () => {
  const navigate = useNavigate()
  const { login: setLogin } = useUserStore()
  const [loading, setLoading] = useState(false)
  const [codeLoading, setCodeLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [agreed, setAgreed] = useState(false)
  const [form] = Form.useForm()

  // 发送验证码
  const handleSendCode = async () => {
    const phone = form.getFieldValue('phone')
    
    if (!phone) {
      alert('请输入手机号')
      return
    }
    
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      alert('手机号格式不正确')
      return
    }

    try {
      setCodeLoading(true)
      await sendCode(phone)
      // 验证码已发送
      
      // 倒计时
      setCountdown(60)
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } catch (error) {
      console.error('发送验证码失败:', error)
    } finally {
      setCodeLoading(false)
    }
  }

  // 处理注册
  const handleRegister = async (values) => {
    if (!agreed) {
      alert('请先同意用户协议')
      return
    }

    try {
      setLoading(true)
      
      // 调用注册接口
      const res = await register(values)
      
      // 注册成功后自动登录
      setLogin(res.token, res.userInfo)
      
      // 注册成功，直接跳转
      
      // 跳转到首页
      setTimeout(() => {
        navigate('/', { replace: true })
      }, 500)
    } catch (error) {
      console.error('注册失败:', error)
    } finally {
      setLoading(false)
    }
  }

  // 验证规则
  const rules = {
    username: [
      { required: true, message: '请输入用户名' },
      { min: 3, max: 20, message: '用户名长度为3-20个字符' },
      { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字和下划线' }
    ],
    phone: [
      { required: true, message: '请输入手机号' },
      { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' }
    ],
    code: [
      { required: true, message: '请输入验证码' },
      { len: 6, message: '验证码为6位数字' }
    ],
    password: [
      { required: true, message: '请输入密码' },
      { min: 6, max: 20, message: '密码长度为6-20个字符' }
    ],
    confirmPassword: [
      { required: true, message: '请确认密码' },
      { 
        validator: (_, value) => {
          if (!value || form.getFieldValue('password') === value) {
            return Promise.resolve()
          }
          return Promise.reject(new Error('两次输入密码不一致'))
        }
      }
    ]
  }

  return (
    <div className="register-page">
      <NavBar 
        title="注册" 
        leftText="←"
        onClickLeft={() => navigate('/login')}
        className="register-nav"
      />
      
      <div className="register-container">
        {/* 标题 */}
        <div className="register-header">
          <h1>欢迎加入 QuickFeed</h1>
          <p>创建账号，开启精彩之旅</p>
        </div>

        {/* 注册表单 */}
        <div className="register-form">
          <Form 
            form={form}
            onFinish={handleRegister}
            footer={
              <div className="form-footer">
                <Button 
                  block 
                  type="primary" 
                  nativeType="submit"
                  loading={loading}
                  disabled={!agreed}
                  className="register-btn"
                  size="large"
                >
                  注册
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
              name="phone"
              rules={rules.phone}
            >
              <Input
                type="tel"
                placeholder="请输入手机号"
                clearable
                size="large"
              />
            </Form.Item>

            <Form.Item 
              name="code"
              rules={rules.code}
            >
              <Input
                placeholder="请输入验证码"
                clearable
                size="large"
                suffix={
                  <Button
                    size="small"
                    type="primary"
                    disabled={countdown > 0}
                    loading={codeLoading}
                    onClick={handleSendCode}
                    className="code-btn"
                  >
                    {countdown > 0 ? `${countdown}s` : '获取验证码'}
                  </Button>
                }
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

            <Form.Item 
              name="confirmPassword"
              rules={rules.confirmPassword}
            >
              <Input
                type="password"
                placeholder="请确认密码"
                clearable
                size="large"
              />
            </Form.Item>
          </Form>

          {/* 用户协议 */}
          <div className="agreement">
            <Checkbox 
              checked={agreed} 
              onChange={setAgreed}
              className="agreement-checkbox"
            >
              <span className="agreement-text">
                我已阅读并同意
                <a href="/terms" onClick={(e) => e.preventDefault()}>《用户协议》</a>
                和
                <a href="/privacy" onClick={(e) => e.preventDefault()}>《隐私政策》</a>
              </span>
            </Checkbox>
          </div>

          {/* 返回登录 */}
          <div className="register-footer">
            <span>已有账号？</span>
            <a onClick={() => navigate('/login')}>立即登录</a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
