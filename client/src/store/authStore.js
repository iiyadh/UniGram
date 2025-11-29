import api from '../api/interceptor';
import { create } from 'zustand';

export const useAuthStore = create((set) => ({
    token: null,
    role: null,
    id : null,
    department_id: null,

    
    login: async (data)=>{
        try{
            const res = await api.post('/auth/api/auth/login', data);
            console.log(res.data);
            set({ token: res.data.token });
            set({ role: res.data.role });
            set({ id: res.data.id });
            set({ department_id: res.data.department_id });
            return { success: true, data: res.data };
        }catch(err){
            return {
                success: false,
                error: err.response?.data?.message || "Something went wrong",
            };
        }
    },

    logout: async () => {
        set({ token: null });
        set({ role: null });
        set({ id: null });
        set({ department_id: null });
        try{
            const res = await api.post('/auth/api/auth/logout');
            return { success: true, data: res.data };
        }catch(err){
            return {
                success: false,
                error: err.response?.data?.message || "Something went wrong",
            };
        }
    },

    isAuthenticated: () =>{
        return !!useAuthStore.getState().token;
    }
    
}));