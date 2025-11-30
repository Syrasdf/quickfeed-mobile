import request from './request'
import mockApi from './mock'

// 开发环境使用 mock，生产环境使用真实接口
const isDev = import.meta.env.DEV

// 用户登录
export const login = async (data) => {
  if (isDev) {
    const res = await mockApi.login(data)
    return res.data
  }
  return request({
    url: '/auth/login',
    method: 'POST',
    data
  })
}

// 用户注册
export const register = async (data) => {
  if (isDev) {
    const res = await mockApi.register(data)
    return res.data
  }
  return request({
    url: '/auth/register',
    method: 'POST',
    data
  })
}

// 获取用户信息
export const getUserInfo = async () => {
  if (isDev) {
    const token = localStorage.getItem('token')
    const res = await mockApi.getUserInfo(token)
    return res.data
  }
  return request({
    url: '/auth/userinfo',
    method: 'GET'
  })
}

// 退出登录
export const logout = () => {
  return request({
    url: '/auth/logout',
    method: 'POST'
  })
}

// 刷新 token
export const refreshToken = () => {
  return request({
    url: '/auth/refresh',
    method: 'POST'
  })
}

// 发送验证码
export const sendCode = async (phone) => {
  if (isDev) {
    const res = await mockApi.sendCode(phone)
    return res.data
  }
  return request({
    url: '/auth/sendcode',
    method: 'POST',
    data: { phone }
  })
}
