import React, { useState, useEffect } from 'react'
import './index.css'

let toastInstance = null
let setToastData = null

// Custom Toast Component
const CustomToast = () => {
  const [visible, setVisible] = useState(false)
  const [message, setMessage] = useState('')
  const [type, setType] = useState('info')
  
  useEffect(() => {
    // Store the setter function so we can call it from outside
    setToastData = (data) => {
      if (!data) {
        setVisible(false)
        return
      }
      setMessage(data.message || '')
      setType(data.type || 'info')
      setVisible(true)
      
      // Auto hide after duration
      if (data.duration !== 0) {
        setTimeout(() => {
          setVisible(false)
        }, data.duration || 2000)
      }
    }
    
    return () => {
      setToastData = null
    }
  }, [])
  
  if (!visible) return null
  
  const icons = {
    success: '✅',
    fail: '❌',
    loading: '⏳',
    info: 'ℹ️'
  }
  
  return (
    <div className={`custom-toast custom-toast-${type}`}>
      <span className="custom-toast-icon">{icons[type] || icons.info}</span>
      <span className="custom-toast-message">{message}</span>
    </div>
  )
}

// Toast API
const Toast = (options) => {
  if (!setToastData) {
    console.warn('Toast not initialized')
    return
  }
  
  if (typeof options === 'string') {
    setToastData({ message: options, type: 'info', duration: 2000 })
  } else if (options && typeof options === 'object') {
    const type = options.icon === 'success' ? 'success' : 
                 options.icon === 'fail' ? 'fail' : 
                 options.type || 'info'
    setToastData({
      message: options.message || '',
      type: type,
      duration: options.duration !== undefined ? options.duration : 2000
    })
  }
}

// Static methods
Toast.success = (message) => {
  Toast({ message, icon: 'success' })
}

Toast.fail = (message) => {
  Toast({ message, icon: 'fail' })
}

Toast.loading = (options) => {
  const message = typeof options === 'string' ? options : options?.message || '加载中...'
  Toast({ message, type: 'loading', duration: 0 })
}

Toast.clear = () => {
  if (setToastData) {
    setToastData(null)
  }
}

export { CustomToast, Toast }
