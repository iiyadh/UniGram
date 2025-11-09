import { Layout, Button, Typography, Row, Col, Card, Image } from 'antd';
import { TeamOutlined, CalendarOutlined, FileTextOutlined,MoonOutlined,SunOutlined } from '@ant-design/icons';
import LogoLight from '../assets/LogoLight.png';
const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;
import { useState } from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    return (
        <Layout style={{ minHeight: '100vh', background: '#ffffff' }}>
            <Header style={{ 
                background: '#ffffff', 
                padding: '0 50px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '2px solid #016FB9'
            }}>
                <div className='logo' style={{ color: '#000', fontSize: '24px', fontWeight: 'bold' }}>
                    <Image src={LogoLight} alt="UniCord Logo" style={{ height: '40px', marginRight: '10px' }} preview={false}/>
                    UniCord
                </div>
                <div>
                    <Button 
                        onClick={() => {
                            setIsDarkMode(!isDarkMode);
                        }}
                        style={{ marginRight: '10px' }}
                        icon={isDarkMode ? <SunOutlined />:<MoonOutlined />}
                    >
                        {isDarkMode ? "Dark" : "Light"}
                    </Button>
                    <Link to='/login'>
                        <Button type="primary" style={{ 
                            background: '#016FB9', 
                            borderColor: '#016FB9',
                            marginRight: '10px'
                        }}>
                            Login
                        </Button>
                    </Link>
                </div>
            </Header>

            <Content style={{ padding: '80px 50px', background: '#ffffff' }}>
                {/* Hero Section */}
                <Row justify="center" style={{ marginBottom: '80px', textAlign: 'center' }}>
                    <Col span={16}>
                        <Title style={{ color: '#016FB9', fontSize: '48px', marginBottom: '20px' }}>
                            University Management System
                        </Title>
                        <Paragraph style={{ color: '#182825', fontSize: '20px', marginBottom: '40px' }}>
                            Streamline your academic journey with our comprehensive management platform
                        </Paragraph>
                        <Link to='/login'>
                            <Button size="large" type="primary" style={{ 
                                background: '#016FB9', 
                                borderColor: '#016FB9',
                                height: '50px',
                                fontSize: '18px',
                                paddingLeft: '40px',
                                paddingRight: '40px'
                            }}>
                                Get Started
                            </Button>
                        </Link>
                    </Col>
                </Row>

                {/* Features Section */}
                <Row gutter={[32, 32]} justify="center">
                    <Col xs={24} sm={12} lg={6}>
                        <Card 
                            hoverable
                            style={{ 
                                background: '#f0f8ff', 
                                borderColor: '#016FB9',
                                textAlign: 'center',
                                height: '100%'
                            }}
                        >
                            <TeamOutlined style={{ fontSize: '48px', color: '#016FB9', marginBottom: '20px' }} />
                            <Title level={4} style={{ color: '#182825' }}>Student Portal</Title>
                            <Paragraph style={{ color: '#182825' }}>
                                Access grades, schedules, and communicate with faculty
                            </Paragraph>
                        </Card>
                    </Col>

                    <Col xs={24} sm={12} lg={6}>
                        <Card 
                            hoverable
                            style={{ 
                                background: '#f0f8ff', 
                                borderColor: '#016FB9',
                                textAlign: 'center',
                                height: '100%'
                            }}
                        >
                            <CalendarOutlined style={{ fontSize: '48px', color: '#016FB9', marginBottom: '20px' }} />
                            <Title level={4} style={{ color: '#182825' }}>Schedule Planning</Title>
                            <Paragraph style={{ color: '#182825' }}>
                                Plan and organize academic schedules with ease
                            </Paragraph>
                        </Card>
                    </Col>

                    <Col xs={24} sm={12} lg={6}>
                        <Card 
                            hoverable
                            style={{ 
                                background: '#f0f8ff', 
                                borderColor: '#016FB9',
                                textAlign: 'center',
                                height: '100%'
                            }}
                        >
                            <FileTextOutlined style={{ fontSize: '48px', color: '#016FB9', marginBottom: '20px' }} />
                            <Title level={4} style={{ color: '#182825' }}>Reports & Analytics</Title>
                            <Paragraph style={{ color: '#182825' }}>
                                Generate comprehensive reports and track performance
                            </Paragraph>
                        </Card>
                    </Col>
                </Row>
            </Content>

            <Footer style={{ 
                textAlign: 'center', 
                background: '#ffffff',
                color: '#016FB9',
                borderTop: '2px solid #016FB9',
                fontWeight: 'bold'
            }}>
                UniCord ©2025 - University Management System
            </Footer>
        </Layout>
    );
};

export default LandingPage;