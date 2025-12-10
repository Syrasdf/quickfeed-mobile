import { NavBar } from 'react-vant'
import './index.css'

const Message = () => {
  return (
    <article className="message-page">
      <NavBar 
        title="消息" 
        style={{ background: 'transparent', borderBottom: 'none' }}
      />
      <main className="message-content">
        <div className="empty-message">
          <div className="empty-icon">💬</div>
          <div className="empty-text">
            暂时没有新消息
            <br />
            <span style={{fontSize: '36px', opacity: 0.7}}>
              与朋友互动后会在这里收到通知
            </span>
          </div>
        </div>
      </main>
    </article>
  )
}

export default Message
