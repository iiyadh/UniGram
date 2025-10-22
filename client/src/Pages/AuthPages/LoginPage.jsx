import { Form, Input, Button, Card , Image } from "antd"
import { LockOutlined, UserOutlined } from "@ant-design/icons"
import LogoLight from '../../assets/LogoLight.png'
import '../../styles/auth.scss'


const LoginPage = () => {
    return (
        <div className="login-container">
            <div className="login-wrapper">
                <div className="login-presentation">
                    <h1>Welcome Back to Unicord</h1>
                    <p>We don’t come here to learn — we come to conquer ignorance</p>
                    <Image src={LogoLight} style={{ width: 400 }} alt="UniCord" preview={false}/>
                </div>
                <Card className="login-card">
                    <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Login</h2>
                    <Form layout="vertical">
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[{ required: true, message: 'Please input your email!' }]}
                        >
                            <Input prefix={<UserOutlined />} placeholder="Email" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            label="Password"
                            rules={[{ required: true, message: 'Please input your password!' }]}
                        >
                            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="signbutton">
                                Sign In
                            </Button>
                        </Form.Item>
                        <Form.Item>
                            <a href="/forgot-password" style={{ float: 'right' }}>
                                Forgot password?
                            </a>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        </div>
    )
}

export default LoginPage