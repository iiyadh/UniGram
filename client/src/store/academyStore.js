import api from '../api/interceptor';
import { create } from 'zustand';


export const useAcademyStore = create((set) => ({
    departments: [],
    specialties: [],
    levels: [],
    groups: [],
    subjects: [],
    classrooms: [],

    // Fetch 
    fetchDepartments: async () => {
        try {
            const res = await api.get('ref/api/ref/coreacademy/departments');
            set({ departments: res.data.data });
            return { success: true, data: res.data.data };
        } catch (err) {
            return {
                success: false, 
                error: err.response?.data?.message || "Something went wrong",
            };
        }
    },

    fetchSpecialties: async (dep_id) => {
        try {
            const res = await api.get(`/ref/api/ref/coreacademy/specialties/${dep_id}`);
            console.log(res.data);
            set({ specialties: res.data.data });
            return { success: true, data: res.data.data };
        } catch (err) {
            return {
                success: false,
                error: err.response?.data?.message || "Something went wrong",
            };
        }
    },

    fetchLevels: async (speciality_id) => {
        try{
            const res = await api.get(`/ref/api/ref/coreacademy/levels/${speciality_id}`);
            set({ levels: res.data.data });
            return { success: true, data: res.data.data };
        }catch(err){
            return {
                success: false,
                error: err.response?.data?.message || "Something went wrong",
            };
        } 
    },

    fetchGroups: async (level_id) => {
        try{
            const res = await api.get(`/ref/api/ref/coreacademy/groups/${level_id}`);
            set({ groups: res.data.data });
            return { success: true, data: res.data.data };
        }catch(err){
            return {
                success: false,
                error: err.response?.data?.message || "Something went wrong",
            };
        }
    },

    fetchSubjects: async (id_level) => {
        try{
            const res = await api.get(`/ref/api/ref/coreacademy/subjects/${id_level}`);
            set({ subjects: res.data.data });
            return { success: true, data: res.data.data };
        }catch(err){
            return {
                success: false,
                error: err.response?.data?.message || "Something went wrong",
            };
        }
    },

    fetchClassrooms: async (depid) => {
        try{
            const res = await api.get(`ref/api/ref/coreacademy/classrooms/${depid}`);
            set({ classrooms: res.data.data });
            return { success: true, data: res.data.data };
        }catch(err){
            return {
                success: false,
                error: err.response?.data?.message || "Something went wrong",
            };
        }
    },


    // Create
    createDepartment: async (data) => {
        try {
            const res = await api.post('ref/api/ref/coreacademy/departments', data);
            set((state) => ({ departments: [...state.departments, res.data.data] }));
            return { success: true, data: res.data };
        } catch (err) {
            return {
                success: false,
                error: err.response?.data?.message || "Something went wrong",
            };
        }
    },

    createSpecialty: async (dep_id, data) => {
        try {
            const res = await api.post(`ref/api/ref/coreacademy/specialties`, {...data, departement_id : dep_id});
            set((state) => ({ specialties: [...state.specialties, res.data.data] }));
            return { success: true, data: res.data.data };
        } catch (err) {
            return {
                success: false,
                error: err.response?.data?.message || "Something went wrong",
            };
        }
    },

    createLevel: async (speciality_id, data) => {
        try {
            const res = await api.post(`/ref/api/ref/coreacademy/levels`, {...data, speciality_id}); 
            set((state) => ({ levels: [...state.levels, res.data.data] }));
            return { success: true, data: res.data.data };
        } catch (err) {
            return {
                success: false,
                error: err.response?.data?.message || "Something went wrong",
            };
        }
    },

    createGroup: async (data) => {
        try {
            const res = await api.post(`/ref/api/ref/coreacademy/groups`, data);
            set((state) => ({ groups: [...state.groups, res.data.data] }));
            return { success: true, data: res.data.data };
        } catch (err) {
            return {
                success: false,
                error: err.response?.data?.message || "Something went wrong",
            };
        }
    },

    createSubject: async (data) => {
        try {
            console.log(data);
            const res = await api.post(`/ref/api/ref/coreacademy/subjects`, data);
            set((state) => ({ subjects: [...state.subjects, res.data.data] }));
            return { success: true, data: res.data.data };
        } catch (err) {
            return {
                success: false,
                error: err.response?.data?.message || "Something went wrong",
            };
        }
    },

    createClassroom: async (data) => {
        try {
            console.log(data);
            const res = await api.post('ref/api/ref/coreacademy/classrooms', data);
            set((state) => ({ classrooms: [...state.classrooms, res.data.data] }));
            return { success: true, data: res.data.data };
        } catch (err) {
            return {
                success: false,
                error: err.response?.data?.message || "Something went wrong",
            };
        }
    },


    // Update
    updateDepartment: async (id, data) => {
        try {
            const res = await api.put(`ref/api/ref/coreacademy/departments/${id}`, data);
            set((state) => ({
                departments: state.departments.map((item) =>
                    item.id === id ? res.data : item
                ),
            }));
            return { success: true, data: res.data };
        } catch (err) {
            return {
                success: false,
                error: err.response?.data?.message || "Something went wrong",
            };
        }
    },

    updateSpecialty: async (id, data) => {
        try {
            const res = await api.put(`ref/api/ref/coreacademy/specialties/${id}`, data);
            set((state) => ({
                specialties: state.specialties.map((item) =>
                    item.id === id ? res.data.data : item
                ),
            }));
            return { success: true, data: res.data.data };
        } catch (err) {
            return {
                success: false,
                error: err.response?.data?.message || "Something went wrong",
            };
        }
    },

    updateGroup: async (id, data) => {
        try {
            const res = await api.put(`/ref/api/ref/coreacademy/groups/${id}`, data);
            set((state) => ({
                groups: state.groups.map((item) =>
                    item.id === id ? res.data.data : item
                ),
            }));
            return { success: true, data: res.data.data };
        } catch (err) {
            return {
                success: false,
                error: err.response?.data?.message || "Something went wrong",
            };
        }
    },

    updateSubject: async (id, data) => {
        try {
            const res = await api.put(`ref/api/ref/coreacademy/subjects/${id}`, data);
            set((state) => ({
                subjects: state.subjects.map((item) =>
                    item.id === id ? res.data.data : item
                ),
            }));
            return { success: true, data: res.data.data };
        } catch (err) {
            return {
                success: false,
                error: err.response?.data?.message || "Something went wrong",
            };
        }
    },

    updateClassroom: async (id, data) => {
        try {
            const res = await api.put(`/ref/api/ref/coreacademy/classrooms/${id}`, data);
            set((state) => ({
                classrooms: state.classrooms.map((item) =>
                    item.id === id ? res.data.data : item
                ),
            }));
            return { success: true, data: res.data.data };
        } catch (err) {
            return {
                success: false,
                error: err.response?.data?.message || "Something went wrong",
            };
        }
    },

    // Delete
    deleteDepartment: async (id) => {
        try {
            await api.delete(`ref/api/ref/coreacademy/departments/${id}`);
            set((state) => ({
                departments: state.departments.filter((item) => item.id !== id),
            }));
            return { success: true, data: id };
        } catch (err) {
            return {
                success: false,
                error: err.response?.data?.message || "Something went wrong",
            };
        }
    },

    deleteSpecialty: async (id) => {
        try {
            await api.delete(`/ref/api/ref/coreacademy/specialties/${dep_id}`);
            set((state) => ({
                specialties: state.specialties.filter((item) => item.id !== id),
            }));
            return { success: true, data: id };
        } catch (err) {
            return {
                success: false,
                error: err.response?.data?.message || "Something went wrong",
            };
        }
    },

    deleteLevel: async (id) => {
        try {
            await api.delete(`/ref/api/ref/coreacademy/levels/${id}`);
            set((state) => ({
                levels: state.levels.filter((item) => item.id !== id),
            }));
            return { success: true, data: id };
        } catch (err) {
            return {
                success: false,
                error: err.response?.data?.message || "Something went wrong",
            };
        }
    },

    deleteGroup: async (id) => {
        try {
            await api.delete(`/ref/api/ref/coreacademy/groups/${id}`);
            set((state) => ({
                groups: state.groups.filter((item) => item.id !== id),
            }));
            return { success: true, data: id };
        } catch (err) {
            return {
                success: false,
                error: err.response?.data?.message || "Something went wrong",
            };
        }
    },

    deleteSubject: async (id) => {
        try {
            await api.delete(`/ref/api/ref/coreacademy/subjects/${id}`);
            set((state) => ({
                subjects: state.subjects.filter((item) => item.id !== id),
            }));
            return { success: true, data: id };
        } catch (err) {
            return {
                success: false,
                error: err.response?.data?.message || "Something went wrong",
            };
        }
    },

    deleteClassroom: async (id) => {
        try {
            await api.delete(`/ref/api/ref/coreacademy/classrooms/${id}`);
            set((state) => ({
                classrooms: state.classrooms.filter((item) => item.id !== id),
            }));
            return { success: true, data: id };
        } catch (err) {
            return {
                success: false,
                error: err.response?.data?.message || "Something went wrong",
            };
        }
    }
}));