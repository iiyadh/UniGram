import { Form, Input, Button, Card , Image } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import LogoLight from '../../assets/LogoLight.png';
import '../../styles/auth.scss';
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";


const LoginPage = () => {

    const [form] = Form.useForm();
    const { login } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (values) => {
        try{
            const res = await login(values);
            if(res.success){
                console.log("Login successful:", res.data);
                if( res.data.role === 'admin' ) navigate('/dashboard');
                else if( res.data.role === 'chef' ) navigate('/chef-dashboard');
                else if( res.data.role === 'teacher' ) navigate('/teacher-dashboard');
                else if( res.data.role === 'student' ) navigate('/student-dashboard');
                else navigate('/');
            }else{
                console.log("Login failed:", res.error);
            }
        }catch(err){
            console.log(err);
        }
    }

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
                    <Form layout="vertical" form={form} onFinish={handleSubmit} initialValues={{ cin: "", password: "" }}>
                        <Form.Item
                            name="cin"
                            label="CIN"
                            rules={[{ required: true, message: 'Please input your Cin!' }]}
                        >
                            <Input prefix={<UserOutlined />} placeholder="********" />
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
                            <Link to="/forget-password" style={{ float: 'right' }}>
                                Forgot password?
                            </Link>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        </div>
    )
}

export default LoginPage