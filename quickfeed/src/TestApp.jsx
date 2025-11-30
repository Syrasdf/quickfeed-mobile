import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// 简单的测试组件
const TestComponent = () => (
  <div style={{ padding: '20px' }}>
    <h1>测试页面</h1>
    <p>如果你能看到这个，说明基本路由工作正常</p>
  </div>
)

function TestApp() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TestComponent />} />
        <Route path="/*" element={<TestComponent />} />
      </Routes>
    </Router>
  )
}

export default TestApp
