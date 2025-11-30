import axios from 'axios'
import storage from '../utils/storage'

// 创建 axios 实例
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 添加 token
    const token = storage.get('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // loading处理可以在这里添加
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    
    // 处理业务错误
    const { code, message, data } = response.data
    
    if (code === 200 || code === 0) {
      return data
    } else {
      // 业务错误
      console.error(message || '请求失败')
      return Promise.reject(new Error(message || '请求失败'))
    }
  },
  (error) => {
    
    // 处理 HTTP 错误
    if (error.response) {
      const { status, data } = error.response
      
      switch (status) {
        case 401:
          // token 过期或未登录
          console.error('请先登录')
          storage.remove('token')
          storage.remove('userInfo')
          // 跳转到登录页
          setTimeout(() => {
            window.location.href = '/login'
          }, 1500)
          break
        case 403:
          console.error('没有权限')
          break
        case 404:
          console.error('请求资源不存在')
          break
        case 500:
          console.error('服务器错误')
          break
        default:
          console.error(data?.message || '请求失败')
      }
    } else if (error.message === 'Network Error') {
      console.error('网络连接失败')
    } else if (error.message.includes('timeout')) {
      console.error('请求超时')
    } else {
      console.error('请求失败')
    }
    
    return Promise.reject(error)
  }
)

export default request
