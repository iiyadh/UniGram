import LogoLight from '../assets/LogoLight.png';
import { Button, Image } from 'antd';
import { MoonOutlined,SunOutlined,BellOutlined,LogoutOutlined
    ,UserOutlined 
    ,ProjectOutlined
    ,TeamOutlined,
    AuditOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '../styles/generalstyle.scss';




const NavBar = () => {

    const navigate = useNavigate(); 

    const [isDarkMode, setIsDarkMode] = useState(false);
    const { logout , role} = useAuthStore();

    const handleLogout = async () => {
        
        try{
            const res = await logout();
            if(res.success){
                console.log("Logout successful:", res.data);
                navigate('/login');
                
            }else{
                console.log("Logout failed:", res.error);
            }
        }catch(err){
            console.log(err);
        }finally{
            navigate('/login');
        }
    }

    return (
        <div style={{
            background: '#ffffff',
            padding: '10px 50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '2px solid #016FB9',
        }}
        >
            <div className='logo' style={{ color: '#000', fontSize: '24px', fontWeight: 'bold' }}>
                <Image src={LogoLight} alt="UniCord Logo" style={{ height: '40px', marginRight: '10px' }} preview={false} />
                UniCord
            </div>
            <div>
                {role === 'admin' && <>
                <Link to="/dashboard/students">
                    <a className='links' href="#" style={{ marginRight: '20px', fontSize: '16px' }}>
                        <TeamOutlined style={{marginRight: '5px'}} />
                        Students
                    </a>
                </Link>

                <Link to="/dashboard/teachers">
                    <a className='links' href="#" style={{ marginRight: '20px', fontSize: '16px' }}>
                        <AuditOutlined style={{marginRight: '5px'}} />
                        Teachers
                    </a>
                </Link>

                <Link to="/dashboard/dep">
                <a className='links' href="#" style={{ marginRight: '20px', fontSize: '16px' }}>
                    <ProjectOutlined  style={{marginRight: '5px'}} />
                    Structure
                </a>
                </Link>
                </>}
                <a className='links' href="#" style={{ marginRight: '20px', fontSize: '16px' }}>
                    <UserOutlined style={{marginRight: '5px'}} />
                    Edit Profile
                </a>
                <Button
                    icon={<BellOutlined />}
                    style={{ marginRight: '10px' }}
                />
                <Button
                    className='mutable-button'
                    onClick={() => {
                        setIsDarkMode(!isDarkMode);
                    }}
                    style={{ marginRight: '10px' }}
                    icon={isDarkMode ? <SunOutlined /> : <MoonOutlined />}
                >
                    {isDarkMode ? "Light" : "Dark"}
                </Button>
                <Button type="primary" style={{
                    background: '#016FB9',
                    borderColor: '#016FB9',
                    marginRight: '10px'
                }}
                onClick={handleLogout}>
                    <LogoutOutlined style={{ marginRight: 8 }} />
                    Logout
                </Button>
            </div>
        </div>
    )
}


export default NavBar;