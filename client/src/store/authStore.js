import api from '../api/interceptor';
import { create } from 'zustand';

export const useAuthStore = create((set) => ({
    token: null,

    
    login: async (data)=>{
        try{
            const res = await api.post('/auth/api/auth/login', data);
            set({ token: res.data.token });
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