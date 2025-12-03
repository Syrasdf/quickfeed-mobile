import request from './request'

// 开发环境使用 mock
const isDev = import.meta.env.DEV

// Mock 数据
const mockPosts = [
  {
    id: '1',
    content: '今天天气真好，出去散步看到了美丽的晚霞。夕阳西下，整个天空都被染成了橙红色，真是太美了！',
    images: [
      'https://picsum.photos/400/600?random=1',
      'https://picsum.photos/400/600?random=2'
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
      'https://picsum.photos/400/400?random=3',
      'https://picsum.photos/400/400?random=4',
      'https://picsum.photos/400/400?random=5'
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
      'https://picsum.photos/600/800?random=6'
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
