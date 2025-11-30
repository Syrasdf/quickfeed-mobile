import { create } from 'zustand'
import storage from '../utils/storage'

const useUserStore = create((set) => ({
  // 状态
  token: storage.get('token') || null,
  userInfo: storage.get('userInfo') || null,
  isLogin: !!storage.get('token'),

  // 登录
  login: (token, userInfo) => {
    storage.set('token', token)
    storage.set('userInfo', userInfo)
    set({ 
      token, 
      userInfo, 
      isLogin: true 
    })
  },

  // 更新用户信息
  updateUserInfo: (userInfo) => {
    storage.set('userInfo', userInfo)
    set({ userInfo })
  },

  // 退出登录
  logout: () => {
    storage.remove('token')
    storage.remove('userInfo')
    set({ 
      token: null, 
      userInfo: null, 
      isLogin: false 
    })
  },

  // 检查登录状态
  checkLogin: () => {
    const token = storage.get('token')
    if (token) {
      set({ 
        token, 
        userInfo: storage.get('userInfo'), 
        isLogin: true 
      })
      return true
    }
    return false
  }
}))

export default useUserStore
