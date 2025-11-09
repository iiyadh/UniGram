import NavBar from "../../Components/NavBar"
import '../../styles/dashboard.scss';
import { Outlet } from 'react-router-dom';

const MainContent = () => {
  return (
    <div className="dashboard" style={{ minHeight: '100vh', background: '#ffffff' }}>
        <NavBar />
        <Outlet />
    </div>
  )
}

export default MainContent;