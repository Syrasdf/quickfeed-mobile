# QuickFeed - 简易资讯移动端

> 一个基于 React + Vite 的移动端资讯产品，支持内容发布、查看修改、信息流浏览等功能

## 📋 项目简介

QuickFeed 是一个简易的移动端资讯应用，实现了短图文发布、Feed流浏览、内容详情查看等核心功能。项目采用现代化的前端技术栈，注重用户体验和性能优化，并集成了 AI 能力实现智能内容标签识别和推荐。

**开发周期：** 2024.11.15 - 2024.12.10  
**在线访问：** [待部署]  
**技术文档：** [飞书文档链接]

---

## ✨ 核心功能

### 1. 登录注册模块
- ✅ 用户注册功能
- ✅ 用户登录功能（JWT 鉴权）
- ✅ 退出登录
- ✅ 路由守卫（未登录自动跳转）

### 2. 短图文发布模块
- ✅ 短图文编辑器（文字 + 图片）
- ✅ 内容发布
- ✅ 已发布内容的二次编辑修改
- 🚀 **[挑战]** 富文本编辑器支持
- 🚀 **[挑战]** 草稿自动保存（每30s云端存储）
- 🚀 **[挑战]** 断网编辑，联网自动同步
- 🚀 **[挑战]** AI 内容标签识别（发文后自动打标签）

### 3. 内容详情页模块
- ✅ 短图文内容查看
- ✅ 发布人、发布时间展示
- ✅ 文字和图片内容渲染
- 🚀 **[挑战]** AI 相关话题推荐
- 🚀 **[挑战]** 点击话题自动填充到发布模块

### 4. Feed 流模块
- ✅ 所有短图文内容展示
- ✅ 按发布时间排序
- ✅ 滚动加载更多（瀑布流/列表）
- 🚀 **[挑战]** 下拉刷新功能
- 🚀 **[挑战]** 性能优化（LCP < 2.5s，fps > 55）
- 🚀 **[挑战]** 相同标签内容推荐

---

## 🛠 技术栈

### 前端技术
- **框架：** React 18 + Vite 6
- **路由：** React Router DOM v6（懒加载 + 路由守卫）
- **状态管理：** Zustand（轻量级状态管理）
- **UI 组件库：** React-Vant（移动端 UI）
- **图标：** @react-vant/icons
- **HTTP 请求：** Axios（请求拦截 + 代理）
- **样式方案：** 
  - CSS Modules（组件样式隔离）
  - Stylus（CSS 预处理器）
  - PostCSS + postcss-pxtorem（自动 px 转 rem）
- **移动端适配：** lib-flexible（rem 方案）
- **鉴权：** JWT（jsonwebtoken）
- **工具库：** mitt（事件总线）

### AI 能力
- **模型选择：** 豆包/DeepSeek/GPT 等（支持任意模型切换）
- **功能：**
  - Chat 对话模型
  - 内容标签识别
  - 相关话题推荐
  - 流式输出
- **平台：** Coze 工作流调用 / 火山引擎模型
- **参考文档：** 
  - [火山方舟模型使用](https://www.volcengine.com/docs/82379/1399008)
  - [OpenAI SDK 使用](https://platform.openai.com/docs/libraries/node-js-library)

### 开发工具
- **构建工具：** Vite
- **代码规范：** ESLint
- **版本管理：** Git + GitHub
- **包管理：** npm / pnpm

---

## 📁 项目架构

```
quickfeed/
├── src/
│   ├── api/                  # 接口请求封装
│   │   ├── request.js        # axios 封装
│   │   ├── auth.js           # 登录注册接口
│   │   ├── post.js           # 内容发布接口
│   │   └── feed.js           # Feed 流接口
│   ├── assets/               # 静态资源
│   ├── components/           # 公共组件
│   │   ├── Layout/           # 布局组件
│   │   ├── TabBar/           # 底部导航
│   │   ├── Toast/            # 自定义 Toast
│   │   ├── Loading/          # 加载组件
│   │   └── ...
│   ├── pages/                # 页面组件
│   │   ├── Login/            # 登录页
│   │   ├── Register/         # 注册页
│   │   ├── Feed/             # Feed 流页
│   │   ├── Publish/          # 发布页
│   │   ├── Detail/           # 详情页
│   │   └── Profile/          # 个人中心
│   ├── store/                # Zustand 状态管理
│   │   ├── userStore.js      # 用户状态
│   │   └── postStore.js      # 内容状态
│   ├── hooks/                # 自定义 Hooks
│   │   ├── useTitle.js       # 页面标题
│   │   ├── useDebounce.js    # 防抖
│   │   └── useIntersection.js # 交叉观察器
│   ├── utils/                # 工具函数
│   │   ├── eventBus.js       # 事件总线（mitt）
│   │   ├── storage.js        # 本地存储
│   │   └── llm.js            # AI 模型调用
│   ├── router/               # 路由配置
│   │   └── index.jsx         # 路由表
│   ├── styles/               # 全局样式
│   │   ├── reset.css         # 样式重置
│   │   └── common.styl       # 通用样式
│   ├── App.jsx               # 根组件
│   ├── main.jsx              # 入口文件
│   └── flexible.js           # 移动端适配
├── public/                   # 公共资源
├── .env.local                # 环境变量（API Key）
├── vite.config.js            # Vite 配置
├── postcss.config.js         # PostCSS 配置
├── package.json              # 依赖配置
└── README.md                 # 项目文档
```

---

## 🚀 快速开始

### 环境要求
- Node.js >= 16.0.0
- npm >= 8.0.0 或 pnpm >= 7.0.0

### 安装依赖

```bash
# 克隆项目
git clone [your-repo-url]
cd quickfeed

# 安装依赖
npm install
# 或
pnpm install
```

### 依赖包列表

**运行时依赖：**
```bash
npm install react-router-dom zustand axios react-vant lib-flexible mitt @react-vant/icons
```

**开发依赖：**
```bash
npm install -D vite-plugin-svg-icons jsonwebtoken stylus postcss-pxtorem
```

### 环境变量配置

创建 `.env.local` 文件：

```env
# AI 模型 API Key
VITE_AI_API_KEY=your_api_key_here

# 后端 API 地址
VITE_API_BASE_URL=http://localhost:3000

# 火山引擎配置（可选）
VITE_VOLC_API_KEY=your_volc_key

# Coze 工作流配置（可选）
VITE_COZE_TOKEN=your_coze_token
VITE_COZE_WORKFLOW_ID=your_workflow_id
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:5173

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

---

## 📱 移动端适配方案

### rem 适配原理

- 使用 `lib-flexible` 动态设置 `html` 的 `font-size`
- 公式：`1rem = 屏幕宽度 / 10`
- 设计稿标准：750px（iPhone 标准尺寸，2倍屏）

### px 自动转换

配置 `postcss-pxtorem` 实现 px 自动转 rem：

**postcss.config.js**
```javascript
export default {
  plugins: {
    'postcss-pxtorem': {
      rootValue: 75,        // 设计稿宽度 / 10
      propList: ['*'],      // 所有属性都转换
      selectorBlackList: [] // 排除不需要转换的类
    }
  }
}
```

### 使用方式

设计稿上的尺寸直接除以 2 即可：

```css
/* 设计稿：宽度 750px，元素宽度 200px */
.box {
  width: 100px;  /* 200 / 2 = 100px，会自动转为 rem */
}
```

---

## 🎨 核心功能实现

### 1. 路由配置与懒加载

```jsx
import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import Loading from '@/components/Loading'

const Login = lazy(() => import('@/pages/Login'))
const Feed = lazy(() => import('@/pages/Feed'))

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Suspense fallback={<Loading />}><Login /></Suspense>
  },
  {
    element: <Layout />,  // 嵌套路由
    children: [
      { path: '/', element: <Feed /> },
      { path: '/publish', element: <Publish /> },
      { path: '/detail/:id', element: <Detail /> },
      { path: '/profile', element: <Profile /> }
    ]
  }
])
```

### 2. 路由守卫

```jsx
// 在 Layout 组件中检查登录状态
const Layout = () => {
  const { token } = useUserStore()
  const navigate = useNavigate()
  
  useEffect(() => {
    if (!token) {
      navigate('/login', { replace: true })
    }
  }, [token, navigate])
  
  return (
    <div className="layout">
      <Outlet />
      <TabBar />
    </div>
  )
}
```

### 3. TabBar 底部导航

```jsx
import { Tabbar } from 'react-vant'
import { HomeO, AddO, UserO } from '@react-vant/icons'

const TabBar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  
  const [active, setActive] = useState('/')
  
  const onChange = (path) => {
    setActive(path)
    navigate(path)
  }
  
  return (
    <Tabbar value={active} onChange={onChange}>
      <Tabbar.Item name="/" icon={<HomeO />}>首页</Tabbar.Item>
      <Tabbar.Item name="/publish" icon={<AddO />}>发布</Tabbar.Item>
      <Tabbar.Item name="/profile" icon={<UserO />}>我的</Tabbar.Item>
    </Tabbar>
  )
}
```

### 4. 瀑布流 Feed 实现

```jsx
const Feed = () => {
  const [leftImages, setLeftImages] = useState([])
  const [rightImages, setRightImages] = useState([])
  const [page, setPage] = useState(1)
  
  // 计算应该加入哪一列
  const addToColumn = (newImages) => {
    newImages.forEach(img => {
      const leftHeight = calcHeight(leftImages)
      const rightHeight = calcHeight(rightImages)
      
      if (leftHeight <= rightHeight) {
        setLeftImages(prev => [...prev, img])
      } else {
        setRightImages(prev => [...prev, img])
      }
    })
  }
  
  // IntersectionObserver 监听滚动加载
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        loadMore()
      }
    })
    
    const sentinel = document.querySelector('.load-more-sentinel')
    if (sentinel) observer.observe(sentinel)
    
    return () => observer.disconnect()
  }, [])
  
  return (
    <PullRefresh onRefresh={handleRefresh}>
      <div className="feed">
        <div className="column">{leftImages.map(...)}</div>
        <div className="column">{rightImages.map(...)}</div>
      </div>
      <div className="load-more-sentinel" />
    </PullRefresh>
  )
}
```

### 5. Toast 组件封装

基于 mitt 事件总线实现跨组件通信：

**utils/eventBus.js**
```javascript
import mitt from 'mitt'
export const eventBus = mitt()
```

**components/Toast/index.jsx**
```jsx
import { useEffect, useState } from 'react'
import { eventBus } from '@/utils/eventBus'
import styles from './index.module.css'

const Toast = () => {
  const [visible, setVisible] = useState(false)
  const [message, setMessage] = useState('')
  
  useEffect(() => {
    eventBus.on('toast', ({ message, duration = 2000 }) => {
      setMessage(message)
      setVisible(true)
      
      setTimeout(() => setVisible(false), duration)
    })
    
    return () => eventBus.off('toast')
  }, [])
  
  if (!visible) return null
  
  return (
    <div className={styles.toast}>
      {message}
    </div>
  )
}

export default Toast

// 使用方式
export const showToast = (options) => {
  eventBus.emit('toast', options)
}
```

### 6. AI 能力集成

**utils/llm.js**
```javascript
import axios from 'axios'

// 抽象 chat 函数，支持多模型
export const chat = async ({ model = 'deepseek', prompt, apiKey }) => {
  const API_ENDPOINTS = {
    deepseek: 'https://api.deepseek.com/v1/chat/completions',
    doubao: 'https://ark.cn-beijing.volces.com/api/v3/chat/completions',
    gpt: 'https://api.openai.com/v1/chat/completions'
  }
  
  const response = await axios.post(API_ENDPOINTS[model], {
    model: model,
    messages: [{ role: 'user', content: prompt }]
  }, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }
  })
  
  return response.data.choices[0].message.content
}

// 内容标签识别
export const extractTags = async (content) => {
  return await chat({
    model: 'deepseek',
    prompt: `请提取以下内容的3-5个标签，只返回标签数组：${content}`,
    apiKey: import.meta.env.VITE_AI_API_KEY
  })
}

// 相关话题推荐
export const suggestTopics = async (content) => {
  return await chat({
    model: 'deepseek',
    prompt: `根据以下内容推荐3个相关话题：${content}`,
    apiKey: import.meta.env.VITE_AI_API_KEY
  })
}
```

---

## 🎯 性能优化

### 1. 组件优化
```jsx
// React.memo 防止无状态组件重复渲染
const PostCard = React.memo(({ post }) => {
  return <div>{post.title}</div>
})

// useCallback 缓存函数引用
const handleClick = useCallback(() => {
  navigate(`/detail/${post.id}`)
}, [post.id])

// useMemo 缓存计算结果
const filteredPosts = useMemo(() => {
  return posts.filter(p => p.tags.includes(selectedTag))
}, [posts, selectedTag])
```

### 2. 搜索防抖
```javascript
// hooks/useDebounce.js
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value)
  
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  
  return debouncedValue
}

// 使用
const Search = () => {
  const [keyword, setKeyword] = useState('')
  const debouncedKeyword = useDebounce(keyword, 500)
  
  useEffect(() => {
    if (debouncedKeyword) {
      fetchSearchResults(debouncedKeyword)
    }
  }, [debouncedKeyword])
}
```

### 3. 图片优化
- **懒加载：** 使用 `IntersectionObserver`
- **压缩上传：** 上传前压缩图片
- **WebP 格式：** 优先使用 WebP

```jsx
// 图片懒加载
useEffect(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target
        img.src = img.dataset.src
        observer.unobserve(img)
      }
    })
  })
  
  document.querySelectorAll('img[data-src]').forEach(img => {
    observer.observe(img)
  })
  
  return () => observer.disconnect()
}, [])
```

### 4. 性能指标
- **LCP (Largest Contentful Paint):** < 2.5s
- **FPS (Frames Per Second):** > 55fps
- **首屏加载：** 路由懒加载减少体积

---

## 🔧 Vite 配置

### vite.config.js

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

export default defineConfig({
  plugins: [
    react(),
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
      symbolId: 'icon-[name]'
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  },
  css: {
    preprocessorOptions: {
      stylus: {
        additionalData: `@import "@/styles/variables.styl"`
      }
    }
  }
})
```

### postcss.config.js

```javascript
export default {
  plugins: {
    'postcss-pxtorem': {
      rootValue: 75,
      propList: ['*'],
      selectorBlackList: [],
      minPixelValue: 2
    }
  }
}
```

---

## 📝 Git 提交规范

遵循 Conventional Commits 规范：

```bash
# 功能开发
git commit -m "feat: 添加短图文发布功能"
git commit -m "feat(feed): 实现瀑布流布局"

# Bug 修复
git commit -m "fix: 修复 Feed 流滚动加载问题"
git commit -m "fix(auth): 修复登录状态丢失"

# 样式调整
git commit -m "style: 优化详情页布局"

# 性能优化
git commit -m "perf: 优化图片懒加载逻辑"

# 文档更新
git commit -m "docs: 更新 README 部署说明"

# 重构
git commit -m "refactor: 重构 AI 调用逻辑"

# 测试
git commit -m "test: 添加登录模块单元测试"
```

---

## 🌟 项目亮点

### 1. AI 智能化
- ✅ 内容标签自动识别
- ✅ 相关话题智能推荐
- ✅ 支持多模型灵活切换（豆包/DeepSeek/GPT）
- ✅ Coze 工作流集成
- ✅ 流式输出支持

### 2. 用户体验优化
- ✅ 移动端 rem 适配，完美还原设计稿
- ✅ 路由懒加载 + 骨架屏
- ✅ 搜索防抖 + useMemo 性能优化
- ✅ 瀑布流 + 图片懒加载
- ✅ 下拉刷新 + 滚动加载
- ✅ 草稿自动保存
- ✅ 断网续传功能

### 3. 工程化实践
- ✅ 组件化开发（公共组件 + 页面组件）
- ✅ 状态管理（Zustand）
- ✅ 自定义 Hooks 封装
- ✅ 原子化 CSS（模块化 + 通用类）
- ✅ 事件总线跨组件通信
- ✅ 路径别名配置
- ✅ 环境变量管理

### 4. 性能优化
- ✅ React.memo + useCallback 防止重复渲染
- ✅ IntersectionObserver 实现交叉观察
- ✅ 图片懒加载
- ✅ 首屏 LCP < 2.5s
- ✅ 滚动帧率 > 55fps

---

## 🐛 常见问题与解决方案

### 1. 闭包陷阱
在事件处理中多次调用 `setState` 可能导致状态覆盖，使用函数式更新：

```javascript
// ❌ 错误
setMessages([...messages, newMsg])
setMessages([...messages, anotherMsg])  // 会覆盖第一次的更新

// ✅ 正确
setMessages(prev => [...prev, newMsg])
setMessages(prev => [...prev, anotherMsg])
```

### 2. IntersectionObserver 内存泄漏
组件卸载时记得释放资源：

```javascript
useEffect(() => {
  const observer = new IntersectionObserver(callback)
  observer.observe(targetElement)
  
  return () => {
    observer.disconnect()  // 清理资源
  }
}, [])
```

### 3. 瀑布流高度不均
使用动态计算高度，而非简单的奇偶分配：

```javascript
// ❌ 不好：奇偶分配可能导致高度差异大
images.forEach((img, i) => {
  if (i % 2 === 0) leftCol.push(img)
  else rightCol.push(img)
})

// ✅ 好：判断哪一列高度更小
images.forEach(img => {
  const leftHeight = calcHeight(leftCol)
  const rightHeight = calcHeight(rightCol)
  const targetCol = leftHeight < rightHeight ? leftCol : rightCol
  targetCol.push(img)
})
```

### 4. 移动端点击延迟
禁用双击缩放：

```html
<!-- index.html -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
```

---

## 📦 部署

### GitHub Pages 部署

1. 安装 gh-pages：
```bash
npm install -D gh-pages
```

2. 配置 package.json：
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

3. 部署：
```bash
npm run deploy
```

### Vercel 部署

1. 在 Vercel 中导入 GitHub 仓库
2. 配置构建设置：
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. 添加环境变量（.env.local 中的变量）
4. 点击 Deploy

### Netlify 部署

1. 连接 GitHub 仓库
2. 配置构建设置：
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
3. 添加环境变量
4. Deploy

---

## 📊 开发进度

### 第一周（11.15 - 11.21）
- [x] 项目初始化
- [x] 技术栈选型
- [x] 基础架构搭建
- [x] 登录注册模块

### 第二周（11.22 - 11.28）
- [x] Feed 流页面
- [x] 短图文发布功能
- [ ] 内容详情页

### 第三周（11.29 - 12.05）
- [ ] AI 能力集成
- [ ] 性能优化
- [ ] 挑战功能实现

### 第四周（12.06 - 12.10）
- [ ] 测试与修复
- [ ] 文档完善
- [ ] 部署上线

---

## 👥 开发团队

- **杨超男** - 核心功能开发
- **卢士杰** - AI 功能集成
- **陈秋鑫** - UI/UX 优化

---

## 📚 参考资料

- [React 官方文档](https://react.dev/)
- [Vite 官方文档](https://vitejs.dev/)
- [React Router 文档](https://reactrouter.com/)
- [Zustand 文档](https://zustand.docs.pmnd.rs/)
- [React-Vant 文档](https://react-vant.3lang.dev/)
- [火山方舟模型文档](https://www.volcengine.com/docs/82379/1399008)
- [OpenAI SDK 文档](https://platform.openai.com/docs/libraries/node-js-library)

---

## 📄 License

MIT License

---

## 📞 联系方式

如有问题，请提交 Issue 或联系开发团队。

**最后更新时间：** 2024.11.19
