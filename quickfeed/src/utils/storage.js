// localStorage 封装
const storage = {
  // 设置值
  set(key, value) {
    if (typeof value === 'object') {
      value = JSON.stringify(value)
    }
    localStorage.setItem(key, value)
  },

  // 获取值
  get(key) {
    const value = localStorage.getItem(key)
    try {
      return JSON.parse(value)
    } catch {
      return value
    }
  },

  // 删除值
  remove(key) {
    localStorage.removeItem(key)
  },

  // 清空所有
  clear() {
    localStorage.clear()
  }
}

export default storage
