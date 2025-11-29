import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const RoleProtection = ({ children, allowedRoles }) => {
    const navigate = useNavigate();
    const { role } = useAuthStore();

    useEffect(() => {
        if (!allowedRoles.includes(role)) {
            navigate('/');
            return;
        }
    }, [role, navigate, allowedRoles]);

    if (!allowedRoles.includes(role)) {
        return null;
    }

    return children;
};

export default RoleProtection;
