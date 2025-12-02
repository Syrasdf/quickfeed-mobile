import { useState, useEffect } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { Form, Input, Button, NavBar, Checkbox, Tabs, Toast } from 'react-vant'
import useUserStore from '../../store/userStore'
import { login } from '../../api/auth'
import storage from '../../utils/storage'
import './index.css'

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login: setLogin, isLogin } = useUserStore()
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()
  const [phoneForm] = Form.useForm()
  const [redirectMessage, setRedirectMessage] = useState('')
  const [loginType, setLoginType] = useState('account') // account | phone
  const [rememberPassword, setRememberPassword] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [countDown, setCountDown] = useState(0)
  const [showSkeleton, setShowSkeleton] = useState(true)
  
  // 显示来源页面的消息
  useEffect(() => {
    if (location.state?.message) {
      setRedirectMessage(location.state.message)
      // 3秒后清除消息
      setTimeout(() => setRedirectMessage(''), 3000)
    }
    
    // 加载记住的账号密码
    const savedAccount = storage.get('savedAccount')
    if (savedAccount) {
      form.setFieldsValue(savedAccount)
      setRememberPassword(true)
    }
    
    // 骨架屏动画
    setTimeout(() => setShowSkeleton(false), 300)
  }, [])
  
  // 倒计时处理
  useEffect(() => {
    if (countDown > 0) {
      const timer = setTimeout(() => setCountDown(countDown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countDown])
  
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
      
      // 如果是手机号登录，整合数据
      const loginData = loginType === 'phone' 
        ? { phone: values.phone, code: values.code }
        : values
      
      // 测试环境：手机号登录验证
      if (loginType === 'phone') {
        // 模拟验证：验证码必须是 123456
        if (values.code !== '123456') {
          Toast.fail('验证码错误，请输入：123456')
          throw new Error('验证码错误')
        }
        // 模拟手机号登录成功
        loginData.username = 'phone_user'
        loginData.password = '123456'
      }
      
      // 调用登录接口
      const res = await login(loginData)
      
      // 记住密码
      if (rememberPassword && loginType === 'account') {
        storage.set('savedAccount', values)
      } else {
        storage.remove('savedAccount')
      }
      
      // 保存用户信息
      setLogin(res.token, res.userInfo)
      
      Toast.success('登录成功')
      
      // 跳转到之前的页面或首页
      const from = location.state?.from || '/'
      setTimeout(() => {
        navigate(from, { replace: true })
      }, 500)
    } catch (error) {
      console.error('登录失败:', error)
      // 添加错误动画
      const formElement = document.querySelector('.login-form')
      formElement?.classList.add('shake-animation')
      setTimeout(() => {
        formElement?.classList.remove('shake-animation')
      }, 500)
    } finally {
      setLoading(false)
    }
  }
  
  // 发送验证码
  const sendVerifyCode = async () => {
    try {
      const phone = phoneForm.getFieldValue('phone')
      if (!phone) {
        Toast.fail('请输入手机号')
        return
      }
      
      // 验证手机号格式
      if (!/^1[3-9]\d{9}$/.test(phone)) {
        Toast.fail('请输入正确的手机号')
        return
      }
      
      // 模拟发送验证码
      const testCode = '123456' // 测试验证码
      Toast.show({
        message: `验证码已发送到 ${phone}\n测试验证码：${testCode}`,
        duration: 5000,
        position: 'top',
        icon: 'success'
      })
      
      setCountDown(60)
      
      // 实际项目中调用发送验证码API
      // await sendSms(phone)
      
      console.log(`手机号 ${phone} 的测试验证码是: ${testCode}`)
    } catch (error) {
      Toast.fail('发送失败，请重试')
    }
  }
  
  // 快速填充测试账号
  const fillTestAccount = () => {
    form.setFieldsValue({
      username: 'admin',
      password: '123456'
    })
    Toast.info('已填充测试账号')
  }
  
  // 快速填充测试手机号
  const fillTestPhone = () => {
    phoneForm.setFieldsValue({
      phone: '13800138000'
    })
    Toast.info('已填充测试手机号，请点击获取验证码')
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
      {/* 骨架屏 */}
      {showSkeleton && (
        <div className="login-skeleton">
          <div className="sk-nav shimmer"></div>
          <div className="sk-logo shimmer"></div>
          <div className="sk-form shimmer"></div>
        </div>
      )}
      
      <div className={`login-content ${!showSkeleton ? 'fade-in' : ''}`}>
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
            <div className="app-logo pulse-animation">
              <div className="logo-icon">Q</div>
            </div>
            <h1 className="app-name">QuickFeed</h1>
            <p className="app-desc">发现精彩，分享生活</p>
          </div>

          {/* 登录表单 */}
          <div className="login-form">
            {/* 登录方式切换 */}
            <Tabs 
              active={loginType}
              onChange={setLoginType}
              className="login-tabs"
            >
              <Tabs.TabPane title="账号登录" name="account">
                <Form 
                  form={form}
                  onFinish={handleLogin}
                  footer={
                    <div className="form-footer">
                      <div className="form-options">
                        <Checkbox 
                          checked={rememberPassword}
                          onChange={setRememberPassword}
                          className="remember-checkbox"
                        >
                          记住密码
                        </Checkbox>
                        <Button 
                          size="small"
                          type="default"
                          onClick={fillTestAccount}
                          className="test-account-btn"
                        >
                          使用测试账号
                        </Button>
                      </div>
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
                      className="input-with-animation"
                    />
                  </Form.Item>

                  <Form.Item 
                    name="password"
                    rules={rules.password}
                  >
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="请输入密码"
                      clearable
                      size="large"
                      className="input-with-animation"
                      suffix={
                        <span 
                          onClick={() => setShowPassword(!showPassword)}
                          style={{ cursor: 'pointer', fontSize: '40px' }}
                        >
                          {showPassword ? '👁️' : '👁️‍🗨️'}
                        </span>
                      }
                    />
                  </Form.Item>
                </Form>
              </Tabs.TabPane>
              
              <Tabs.TabPane title="手机号登录" name="phone">
                {/* 测试提示 */}
                <div style={{
                  background: '#fff4e6',
                  padding: '24px',
                  borderRadius: '12px',
                  marginBottom: '36px',
                  fontSize: '32px',
                  color: '#ff976a',
                  lineHeight: '1.5'
                }}>
                  📱 测试说明：<br/>
                  1. 输入任意手机号<br/>
                  2. 点击获取验证码<br/>
                  3. 输入测试验证码：<strong>123456</strong>
                  <Button 
                    size="small"
                    type="primary"
                    onClick={fillTestPhone}
                    style={{ 
                      marginTop: '24px',
                      width: '100%',
                      height: '84px',
                      fontSize: '36px',
                      background: '#ff976a',
                      border: 'none'
                    }}
                  >
                    快速填充测试手机号
                  </Button>
                </div>
                <Form 
                  form={phoneForm}
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
                    name="phone"
                    rules={[
                      { required: true, message: '请输入手机号' },
                      { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' }
                    ]}
                  >
                    <Input
                      placeholder="请输入手机号"
                      clearable
                      size="large"
                      className="input-with-animation"
                      maxLength={11}
                      type="tel"
                    />
                  </Form.Item>

                  <Form.Item 
                    name="code"
                    rules={[
                      { required: true, message: '请输入验证码' },
                      { len: 6, message: '验证码为6位数字' }
                    ]}
                  >
                    <Input
                      placeholder="请输入验证码 (测试: 123456)"
                      clearable
                      size="large"
                      className="input-with-animation"
                      maxLength={6}
                      type="number"
                      suffix={
                        <Button 
                          size="small"
                          type="primary"
                          disabled={countDown > 0}
                          onClick={sendVerifyCode}
                        >
                          {countDown > 0 ? `${countDown}s` : '获取验证码'}
                        </Button>
                      }
                    />
                  </Form.Item>
                </Form>
              </Tabs.TabPane>
            </Tabs>

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
    </div>
  )
}

export default Login
