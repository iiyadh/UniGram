import NavBar from "../../Components/NavBar"
import StudentsTable from "../../Components/StudentsTable";
import '../../styles/dashboard.scss';


const MainContent = () => {
  return (
    <div className="dashboard" style={{ minHeight: '100vh', background: '#ffffff' }}>
        <NavBar />
        <StudentsTable/>
    </div>
  )
}

export default MainContent;