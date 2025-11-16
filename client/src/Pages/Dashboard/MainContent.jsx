import NavBar from "../../Components/NavBar"
import '../../styles/dashboard.scss';
import { Outlet } from 'react-router-dom';
import SideBar from "../../Components/SideBar";

const MainContent = () => {
  return (
    <div className="dashboard" style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <NavBar />
      {/* <SideBar /> */}
      {/* <div 
        className="main-content" 
        style={{ 
          marginLeft: '250px',
          padding: '24px',
          minHeight: 'calc(100vh - 64px)',
          top: '150px',
          transition: 'margin-left 0.2s'
        }}>
      </div> */}
        <Outlet />
    </div>
  )
}

export default MainContent;