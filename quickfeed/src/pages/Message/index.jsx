import { NavBar } from 'react-vant'
import './index.css'

const Message = () => {
  return (
    <article className="message-page">
      <NavBar 
        title="消息" 
        fixed
        placeholder
      />
      <main className="message-content">
        <p>消息页面</p>
      </main>
    </article>
  )
}

export default Message
