import { Form, Input, Button, Card, Image } from "antd";
import { UserOutlined } from "@ant-design/icons";
import LogoLight from '../../assets/LogoLight.png';
import '../../styles/auth.scss';

const ForgotPasswordPage = () => {
    return (
        <div className="login-container">
            <div className="login-wrapper">
                <div className="login-presentation">
                    <h1>Forgot Your Password?</h1>
                    <p>Enter your email and we’ll send you instructions to reset your password</p>
                    <Image src={LogoLight} style={{ width: 400 }} alt="UniCord" preview={false} />
                </div>
                <Card className="login-card">
                    <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Forgot Password</h2>
                    <Form layout="vertical">
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[{ required: true, message: 'Please input your email!' }]}
                        >
                            <Input prefix={<UserOutlined />} placeholder="Email" />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="signbutton">
                                Send Reset Link
                            </Button>
                        </Form.Item>
                        <Form.Item>
                            <a href="/login" style={{ float: 'right' }}>
                                Back to Login
                            </a>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
