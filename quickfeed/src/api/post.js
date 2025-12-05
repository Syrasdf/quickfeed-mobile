import request from './request'

// 开发环境使用 mock
const isDev = import.meta.env.DEV

// Base64占位图片(一个简单的渐变色块)
const placeholderImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNmZjZiNmI7c3RvcC1vcGFjaXR5OjEiIC8+CiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2ZmNGI0YjtzdG9wLW9wYWNpdHk6MSIgLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgPC9kZWZzPgogIDxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNjAwIiBmaWxsPSJ1cmwoI2dyYWQpIiAvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSI0MCI+5Zu+54mH5Yqg6L295LitLi4uPC90ZXh0Pgo8L3N2Zz4=';
const placeholderImage2 = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZDIiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojNDE2OWUxO3N0b3Atb3BhY2l0eToxIiAvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM3NjRiYTI7c3RvcC1vcGFjaXR5OjEiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KICA8cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0idXJsKCNncmFkMikiIC8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjQwIj7lm77niYfliqDovb3kuK0uLi48L3RleHQ+Cjwvc3ZnPg==';
const placeholderImage3 = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjgwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZDMiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMzJjZDMyO3N0b3Atb3BhY2l0eToxIiAvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM0MTY5ZTE7c3RvcC1vcGFjaXR5OjEiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KICA8cmVjdCB3aWR0aD0iNjAwIiBoZWlnaHQ9IjgwMCIgZmlsbD0idXJsKCNncmFkMykiIC8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjQwIj7lm77niYfliqDovb3kuK0uLi48L3RleHQ+Cjwvc3ZnPg==';

// Mock 数据
const mockPosts = [
  {
    id: '1',
    content: '今天天气真好，出去散步看到了美丽的晚霞。夕阳西下，整个天空都被染成了橙红色，真是太美了！',
    images: [
      placeholderImage,
      placeholderImage2
    ],
    author: '小明',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=xiaoming',
    userId: 'user_1',
    createTime: new Date(Date.now() - 3600000).toISOString(),
    tags: ['晚霞', '风景', '生活'],
    views: 128,
    likes: 23,
    comments: 5
  },
  {
    id: '2', 
    content: '分享一道今天做的美食 - 红烧排骨！色香味俱全，家人都说很好吃。附上详细食谱，感兴趣的朋友可以试试。',
    images: [
      placeholderImage2,
      placeholderImage2,
      placeholderImage2
    ],
    author: '美食达人',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=foodie',
    userId: 'user_2',
    createTime: new Date(Date.now() - 7200000).toISOString(),
    tags: ['美食', '烹饪', '排骨'],
    views: 256,
    likes: 45,
    comments: 12
  },
  {
    id: '3',
    content: '今天去爬山了，虽然很累但是山顶的风景真的很值得！下次还要再来。',
    images: [
      placeholderImage3
    ],
    author: '户外爱好者',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=outdoor',
    userId: 'current_user_id', // 当前用户的文章，可以编辑删除
    createTime: new Date(Date.now() - 86400000).toISOString(),
    tags: ['爬山', '户外', '运动'],
    views: 89,
    likes: 15,
    comments: 3
  }
]

// 获取文章详情
export const getPostDetail = async (id) => {
  if (isDev) {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 查找对应的文章
    const post = mockPosts.find(p => p.id === id)
    if (!post) {
      throw new Error('文章不存在')
    }
    
    return post
  }
  
  // 生产环境调用真实接口
  return request({
    url: `/posts/${id}`,
    method: 'GET'
  })
}

// 获取文章列表
export const getPostList = async (params = {}) => {
  if (isDev) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const { page = 1, pageSize = 10 } = params
    const start = (page - 1) * pageSize
    const end = start + pageSize
    
    return {
      list: mockPosts.slice(start, end),
      total: mockPosts.length,
      page,
      pageSize
    }
  }
  
  return request({
    url: '/posts',
    method: 'GET',
    params
  })
}

// 发布文章
export const publishPost = async (data) => {
  if (isDev) {
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const newPost = {
      id: Date.now().toString(),
      ...data,
      author: '当前用户',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=current',
      userId: 'current_user_id',
      createTime: new Date().toISOString(),
      views: 0,
      likes: 0,
      comments: 0
    }
    
    mockPosts.unshift(newPost)
    return newPost
  }
  
  return request({
    url: '/posts',
    method: 'POST',
    data
  })
}

// 更新文章
export const updatePost = async (id, data) => {
  if (isDev) {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const index = mockPosts.findIndex(p => p.id === id)
    if (index === -1) {
      throw new Error('文章不存在')
    }
    
    mockPosts[index] = {
      ...mockPosts[index],
      ...data,
      updateTime: new Date().toISOString()
    }
    
    return mockPosts[index]
  }
  
  return request({
    url: `/posts/${id}`,
    method: 'PUT',
    data
  })
}

// 删除文章
export const deletePost = async (id) => {
  if (isDev) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const index = mockPosts.findIndex(p => p.id === id)
    if (index === -1) {
      throw new Error('文章不存在')
    }
    
    mockPosts.splice(index, 1)
    return { success: true }
  }
  
  return request({
    url: `/posts/${id}`,
    method: 'DELETE'
  })
}

// 已点赞文章ID列表（模拟存储在localStorage中）
const getLikedPosts = () => {
  const liked = localStorage.getItem('likedPosts')
  return liked ? JSON.parse(liked) : []
}

const saveLikedPosts = (posts) => {
  localStorage.setItem('likedPosts', JSON.stringify(posts))
}

// 点赞/取消点赞
export const likePost = async (id) => {
  if (isDev) {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const post = mockPosts.find(p => p.id === id)
    if (!post) {
      throw new Error('文章不存在')
    }
    
    const likedPosts = getLikedPosts()
    const isLiked = likedPosts.includes(id)
    
    if (isLiked) {
      // 取消点赞
      post.likes = Math.max(0, (post.likes || 0) - 1)
      const index = likedPosts.indexOf(id)
      likedPosts.splice(index, 1)
    } else {
      // 点赞
      post.likes = (post.likes || 0) + 1
      likedPosts.push(id)
    }
    
    saveLikedPosts(likedPosts)
    
    return { 
      success: true, 
      isLiked: !isLiked,
      likes: post.likes 
    }
  }
  
  return request({
    url: `/posts/${id}/like`,
    method: 'POST'
  })
}

// 获取点赞状态
export const getLikeStatus = (id) => {
  const likedPosts = getLikedPosts()
  return likedPosts.includes(id)
}

// 收藏文章ID列表
const getCollectedPosts = () => {
  const collected = localStorage.getItem('collectedPosts')
  return collected ? JSON.parse(collected) : []
}

const saveCollectedPosts = (posts) => {
  localStorage.setItem('collectedPosts', JSON.stringify(posts))
}

// 收藏/取消收藏
export const collectPost = async (id) => {
  if (isDev) {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const post = mockPosts.find(p => p.id === id)
    if (!post) {
      throw new Error('文章不存在')
    }
    
    const collectedPosts = getCollectedPosts()
    const isCollected = collectedPosts.includes(id)
    
    if (isCollected) {
      // 取消收藏
      const index = collectedPosts.indexOf(id)
      collectedPosts.splice(index, 1)
    } else {
      // 收藏
      collectedPosts.push(id)
    }
    
    saveCollectedPosts(collectedPosts)
    
    return { 
      success: true, 
      isCollected: !isCollected
    }
  }
  
  return request({
    url: `/posts/${id}/collect`,
    method: 'POST'
  })
}

// 获取收藏状态
export const getCollectStatus = (id) => {
  const collectedPosts = getCollectedPosts()
  return collectedPosts.includes(id)
}

// Mock评论数据
const mockComments = [
  {
    id: 'c1',
    postId: '1',
    content: '很棒的分享！',
    author: '路人甲',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1',
    createTime: new Date(Date.now() - 1800000).toISOString(),
    likes: 5
  },
  {
    id: 'c2',
    postId: '1',
    content: '太美了，我也想去看看',
    author: '小花',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user2',
    createTime: new Date(Date.now() - 3600000).toISOString(),
    likes: 3
  }
]

// 获取评论列表
export const getComments = async (postId) => {
  if (isDev) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const comments = mockComments.filter(c => c.postId === postId)
    return {
      list: comments,
      total: comments.length
    }
  }
  
  return request({
    url: `/posts/${postId}/comments`,
    method: 'GET'
  })
}

// 发布评论
export const addComment = async (postId, content) => {
  if (isDev) {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const newComment = {
      id: 'c' + Date.now(),
      postId,
      content,
      author: '当前用户',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=current',
      createTime: new Date().toISOString(),
      likes: 0
    }
    
    mockComments.unshift(newComment)
    
    // 更新文章评论数
    const post = mockPosts.find(p => p.id === postId)
    if (post) {
      post.comments = (post.comments || 0) + 1
    }
    
    return newComment
  }
  
  return request({
    url: `/posts/${postId}/comments`,
    method: 'POST',
    data: { content }
  })
}

// 删除评论
export const deleteComment = async (commentId) => {
  if (isDev) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const index = mockComments.findIndex(c => c.id === commentId)
    if (index === -1) {
      throw new Error('评论不存在')
    }
    
    const comment = mockComments[index]
    mockComments.splice(index, 1)
    
    // 更新文章评论数
    const post = mockPosts.find(p => p.id === comment.postId)
    if (post) {
      post.comments = Math.max(0, (post.comments || 0) - 1)
    }
    
    return { success: true }
  }
  
  return request({
    url: `/comments/${commentId}`,
    method: 'DELETE'
  })
}

// 获取用户发布的文章
export const getUserPosts = async (userId = 'current_user_id') => {
  if (isDev) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const userPosts = mockPosts.filter(p => p.userId === userId)
    return {
      list: userPosts,
      total: userPosts.length
    }
  }
  
  return request({
    url: `/users/${userId}/posts`,
    method: 'GET'
  })
}

// 获取用户收藏的文章
export const getUserCollectedPosts = async () => {
  if (isDev) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const collectedIds = getCollectedPosts()
    const collectedPosts = mockPosts.filter(p => collectedIds.includes(p.id))
    return {
      list: collectedPosts,
      total: collectedPosts.length
    }
  }
  
  return request({
    url: '/user/collections',
    method: 'GET'
  })
}

// 获取用户统计数据
export const getUserStats = async (userId = 'current_user_id') => {
  if (isDev) {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const userPosts = mockPosts.filter(p => p.userId === userId)
    const totalLikes = userPosts.reduce((sum, p) => sum + (p.likes || 0), 0)
    const collectedCount = getCollectedPosts().length
    
    return {
      postCount: userPosts.length,
      likeCount: totalLikes,
      collectedCount: collectedCount,
      followerCount: 128,  // 模拟数据
      followingCount: 89   // 模拟数据
    }
  }
  
  return request({
    url: `/users/${userId}/stats`,
    method: 'GET'
  })
}
