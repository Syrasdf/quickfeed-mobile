import { NavBar } from 'react-vant'
import './index.css'

const Discover = () => {
  return (
    <article className="discover-page">
      <NavBar 
        title="发现" 
        fixed
        placeholder
      />
      <main className="discover-content">
        <p>发现页面</p>
      </main>
    </article>
  )
}

export default Discover
