import React, { useState } from 'react';
import { Layout, Menu, Image } from 'antd';
import {
  HomeOutlined,
  UserOutlined,
  SettingOutlined,
  MessageOutlined,
  TeamOutlined,
  BellOutlined,
  ApartmentOutlined,
  BarsOutlined,
  GroupOutlined,
  BookOutlined,
  BankOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import LightLogo from '../assets/LogoLight.png';

const { Sider } = Layout;

const SideBar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Define menu items with navigation keys matching your routes
  const menuItems = [
    // { key: '/dashboard', icon: <HomeOutlined />, label: 'Dashboard' },
    { key: '/dashboard/dep', icon: <ApartmentOutlined />, label: 'Departments' },
    { key: '/dashboard/specialties', icon: <BarsOutlined />, label: 'Specialties' },
    { key: '/dashboard/levels', icon: <TeamOutlined />, label: 'Levels' },
    { key: '/dashboard/groupes', icon: <GroupOutlined />, label: 'Groups' },
    { key: '/dashboard/subjects', icon: <BookOutlined />, label: 'Subjects' },
    { key: '/dashboard/classrooms', icon: <BankOutlined />, label: 'Classrooms' },
    { key: '/dashboard/students', icon: <UserOutlined />, label: 'Students' },
    { key: '/dashboard/messages', icon: <MessageOutlined />, label: 'Messages' },
    { key: '/dashboard/notifications', icon: <BellOutlined />, label: 'Notifications' },
    { key: '/dashboard/settings', icon: <SettingOutlined />, label: 'Settings' },
  ];

  // Handle navigation
  const onMenuClick = (e) => {
    navigate(e.key);
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      style={{
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        background: '#ffffff',
        boxShadow: '2px 0 8px rgba(0, 0, 0, 0.1)',
        borderRight: '1px solid #f0f0f0',
        zIndex: 1000,
      }}
      theme="light"
      width={250}
      breakpoint="lg"
      onBreakpoint={(broken) => {
        if (broken) {
          setCollapsed(true);
        }
      }}
    >
      <div
        style={{
          height: '64px',
          margin: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Image src={LightLogo} alt="UniCord Logo" style={{ height: '40px', marginRight: '10px' }} preview={false} />
      </div>

      <Menu
        theme="light"
        selectedKeys={[location.pathname]} // highlight active page
        mode="inline"
        items={menuItems}
        onClick={onMenuClick} // handle navigation
        style={{
          border: 'none',
          background: 'transparent',
        }}
        className="sidebar-menu"
      />
    </Sider>
  );
};

export default SideBar;
