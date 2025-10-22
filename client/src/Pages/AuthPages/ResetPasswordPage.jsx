import { Form, Input, Button, Card, Image } from "antd";
import { LockOutlined } from "@ant-design/icons";
import LogoLight from '../../assets/LogoLight.png';
import '../../styles/auth.scss';

const ResetPasswordPage = () => {
    return (
        <div className="login-container">
            <div className="login-wrapper">
                <div className="login-presentation">
                    <h1>Reset Your Password</h1>
                    <p>Enter a new password to regain access to your account</p>
                    <Image src={LogoLight} style={{ width: 400 }} alt="UniCord" preview={false} />
                </div>
                <Card className="login-card">
                    <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Reset Password</h2>
                    <Form layout="vertical">
                        <Form.Item
                            name="password"
                            label="New Password"
                            rules={[{ required: true, message: 'Please input your new password!' }]}
                        >
                            <Input.Password prefix={<LockOutlined />} placeholder="New Password" />
                        </Form.Item>
                        <Form.Item
                            name="confirmPassword"
                            label="Confirm Password"
                            dependencies={['password']}
                            rules={[
                                { required: true, message: 'Please confirm your password!' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Passwords do not match!'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password prefix={<LockOutlined />} placeholder="Confirm Password" />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="signbutton">
                                Reset Password
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

export default ResetPasswordPage;
