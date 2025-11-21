import { NavBar } from 'react-vant'
import './index.css'

const Profile = () => {
  return (
    <article className="profile-page">
      <NavBar 
        title="我的" 
        fixed
        placeholder
      />
      <main className="profile-content">
        <p>个人中心</p>
      </main>
    </article>
  )
}

export default Profile
