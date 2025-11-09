import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import '../styles/generalstyle.scss';
import api from '../api/interceptor';

const AuthProtection = ({ children }) => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthStore();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try{
                if (!isAuthenticated) {
                    navigate('/login');
                }
                setLoading(false);

            }catch(err){

            }finally{
                setLoading(false);
                navigate('/login');
            }
        };
        checkAuth();
    }, [isAuthenticated, navigate]);

    if (loading) {
        return (
            <div
                className="not-found"
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    flexDirection: 'column'
                }}
            >
                Loading <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
            </div>
        );
    }
    return isAuthenticated ? children : null;
};

export default AuthProtection;
