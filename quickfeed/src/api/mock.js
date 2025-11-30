// Mock API - 模拟后端接口用于开发测试
// 生产环境需要替换为真实接口

// 模拟用户数据库
const mockUsers = [
  {
    id: 1,
    username: 'admin',
    password: '123456',
    phone: '13800138000',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    nickname: '管理员',
    bio: '这个人很懒，什么都没写',
    createTime: '2024-01-01'
  },
  {
    id: 2,
    username: 'test',
    password: '123456',
    phone: '13900139000',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=test',
    nickname: '测试用户',
    bio: '测试账号',
    createTime: '2024-01-02'
  }
]

// 生成 token
const generateToken = (userId) => {
  return `mock_token_${userId}_${Date.now()}`
}

// 延迟函数（模拟网络延迟）
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms))

// Mock API 实现
export const mockApi = {
  // 登录
  login: async (data) => {
    await delay(800)
    
    const { username, password } = data
    const user = mockUsers.find(u => 
      u.username === username && u.password === password
    )
    
    if (user) {
      const token = generateToken(user.id)
      const userInfo = {
        id: user.id,
        username: user.username,
        phone: user.phone,
        avatar: user.avatar,
        nickname: user.nickname,
        bio: user.bio
      }
      
      return {
        code: 200,
        message: '登录成功',
        data: {
          token,
          userInfo
        }
      }
    }
    
    throw new Error('用户名或密码错误')
  },

  // 注册
  register: async (data) => {
    await delay(1000)
    
    const { username, phone, password } = data
    
    // 检查用户名是否已存在
    if (mockUsers.find(u => u.username === username)) {
      throw new Error('用户名已存在')
    }
    
    // 检查手机号是否已注册
    if (mockUsers.find(u => u.phone === phone)) {
      throw new Error('手机号已注册')
    }
    
    // 创建新用户
    const newUser = {
      id: mockUsers.length + 1,
      username,
      password,
      phone,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      nickname: username,
      bio: '这个人很懒，什么都没写',
      createTime: new Date().toISOString()
    }
    
    mockUsers.push(newUser)
    
    const token = generateToken(newUser.id)
    const userInfo = {
      id: newUser.id,
      username: newUser.username,
      phone: newUser.phone,
      avatar: newUser.avatar,
      nickname: newUser.nickname,
      bio: newUser.bio
    }
    
    return {
      code: 200,
      message: '注册成功',
      data: {
        token,
        userInfo
      }
    }
  },

  // 发送验证码
  sendCode: async (phone) => {
    await delay(500)
    
    // 模拟发送验证码
    console.log(`验证码已发送到 ${phone}: 123456`)
    
    return {
      code: 200,
      message: '验证码已发送',
      data: null
    }
  },

  // 获取用户信息
  getUserInfo: async (token) => {
    await delay(300)
    
    // 从 token 中解析用户 ID（实际应该验证 token）
    const userId = parseInt(token.split('_')[2])
    const user = mockUsers.find(u => u.id === userId)
    
    if (user) {
      return {
        code: 200,
        message: '获取成功',
        data: {
          id: user.id,
          username: user.username,
          phone: user.phone,
          avatar: user.avatar,
          nickname: user.nickname,
          bio: user.bio
        }
      }
    }
    
    throw new Error('用户不存在')
  }
}

// 默认导出
export default mockApi
