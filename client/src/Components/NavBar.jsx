import LogoLight from '../assets/LogoLight.png';
import { Button, Image } from 'antd';
import { MoonOutlined,SunOutlined,BellOutlined,LogoutOutlined
    ,UserOutlined 
    ,ProjectOutlined} from '@ant-design/icons';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/generalstyle.scss';




const NavBar = () => {

    const [isDarkMode, setIsDarkMode] = useState(false);

    return (
        <div style={{
            background: '#ffffff',
            padding: '10px 50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '2px solid #016FB9'
        }}>
            <div className='logo' style={{ color: '#000', fontSize: '24px', fontWeight: 'bold' }}>
                <Image src={LogoLight} alt="UniCord Logo" style={{ height: '40px', marginRight: '10px' }} preview={false} />
                UniCord
            </div>
            <div>
                <a className='links' href="#" style={{ marginRight: '20px', fontSize: '16px' }}>
                    <ProjectOutlined style={{marginRight: '5px'}} />
                    Dashboard
                </a>
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
                }}>
                    <LogoutOutlined style={{ marginRight: 8 }} />
                    Logout
                </Button>
            </div>
        </div>
    )
}


export default NavBar;