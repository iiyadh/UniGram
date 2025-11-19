import api from '../api/interceptor';
import { create } from 'zustand';

export const useHumanStore = create((set, get) => ({
    students: [],
    teachers: [],
    loading: false,
    error: null,

    // Students CRUD Operations
    createStudent: async (studentData) => {
        try {
            set({ loading: true, error: null });
            const response = await api.post('/ref/api/ref/coreacademy/students', studentData);
            if (response.data.success) {
                set((state) => ({
                    students: [...state.students, response.data.data],
                    loading: false
                }));
                return response.data.data;
            }
        } catch (error) {
            set({ loading: false, error: error.response?.data?.message || error.message });
            throw error;
        }
    },

    getAllStudents: async () => {
        try {
            set({ loading: true, error: null });
            const response = await api.get('/ref/api/ref/coreacademy/students');
            if (response.data.success) {
                set({
                    students: response.data.data,
                    loading: false
                });
                return response.data.data;
            }
        } catch (error) {
            set({ loading: false, error: error.response?.data?.message || error.message });
            throw error;
        }
    },

    updateStudent: async (studentId, studentData) => {
        try {
            set({ loading: true, error: null });
            const response = await api.put(`/ref/api/ref/coreacademy/students/${studentId}`, studentData);
            if (response.data.success) {
                set((state) => ({
                    students: state.students.map(student =>
                        student.id === studentId ? response.data.data : student
                    ),
                    loading: false
                }));
                return response.data.data;
            }
        } catch (error) {
            set({ loading: false, error: error.response?.data?.message || error.message });
            throw error;
        }
    },

    deleteStudent: async (studentId) => {
        try {
            set({ loading: true, error: null });
            const response = await api.delete(`/ref/api/ref/coreacademy/students/${studentId}`);
            if (response.data.success) {
                set((state) => ({
                    students: state.students.filter(student => student.id !== studentId),
                    loading: false
                }));
                return response.data.data;
            }
        } catch (error) {
            set({ loading: false, error: error.response?.data?.message || error.message });
            throw error;
        }
    },

    // Students CSV Operations
    importStudentsCsv: async (file) => {
        try {
            set({ loading: true, error: null });
            const formData = new FormData();
            formData.append('file', file);
            
            const response = await api.post('/ref/api/ref/coreacademy/students/import', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            
            if (response.data.success) {
                set({ loading: false });
                await get().getAllStudents();
                return response.data.data;
            }
        } catch (error) {
            set({ loading: false, error: error.response?.data?.message || error.message });
            throw error;
        }
    },

    exportStudentsCsv: async () => {
        try {
            set({ loading: true, error: null });
            const response = await api.get('/ref/api/ref/coreacademy/students/export', {
                responseType: 'blob'
            });
            
            // Create download link
            set({ loading: false });
            return response.data;
        } catch (error) {
            set({ loading: false, error: error.response?.data?.message || error.message });
            throw error;
        }
    },

    // Teachers CRUD Operations
    createTeacher: async (teacherData) => {
        try {
            set({ loading: true, error: null });
            const response = await api.post('/ref/api/ref/coreacademy/teachers', teacherData);
            if (response.data.success) {
                set((state) => ({
                    teachers: [...state.teachers, response.data.data],
                    loading: false
                }));
                return response.data.data;
            }
        } catch (error) {
            set({ loading: false, error: error.response?.data?.message || error.message });
            throw error;
        }
    },

    getAllTeachers: async () => {
        try {
            set({ loading: true, error: null });
            const response = await api.get('/ref/api/ref/coreacademy/teachers');
            if (response.data.success) {
                set({
                    teachers: response.data.data,
                    loading: false
                });
                return response.data.data;
            }
        } catch (error) {
            set({ loading: false, error: error.response?.data?.message || error.message });
            throw error;
        }
    },

    updateTeacher: async (teacherId, teacherData) => {
        try {
            set({ loading: true, error: null });
            const response = await api.put(`/ref/api/ref/coreacademy/teachers/${teacherId}`, teacherData);
            if (response.data.success) {
                set((state) => ({
                    teachers: state.teachers.map(teacher =>
                        teacher.teacher_id === teacherId ? response.data.data : teacher
                    ),
                    loading: false
                }));
                return response.data.data;
            }
        } catch (error) {
            set({ loading: false, error: error.response?.data?.message || error.message });
            throw error;
        }
    },

    deleteTeacher: async (teacherId) => {
        try {
            set({ loading: true, error: null });
            const response = await api.delete(`/ref/api/ref/coreacademy/teachers/${teacherId}`);
            if (response.data.success) {
                set((state) => ({
                    teachers: state.teachers.filter(teacher => teacher.teacher_id !== teacherId),
                    loading: false
                }));
                return response.data.data;
            }
        } catch (error) {
            set({ loading: false, error: error.response?.data?.message || error.message });
            throw error;
        }
    },

    addSubjectsToTeacher: async (id_teacher, subjects) => {
        try{
            set({ loading: true, error: null });
            const response = await api.post(`/ref/api/ref/coreacademy/teacher-subject/${id_teacher}`, { subjects });
            set({ loading: false });
            
            if(response.data.success){
                return { success: true, data: response.data };
            } else {
                return { success: false, error: response.data.message };
            }
        }catch(err){
            set({ loading: false, error: err.response?.data?.message || err.message });
            throw err;
        }
    },

    removeSubjectFromTeacher: async (id_teacher, id_subject) => {
        try{
            set({ loading: true, error: null });
            const response = await api.delete(`/ref/api/ref/coreacademy/teacher-subject/${id_teacher}/${id_subject}`);
            set({ loading: false });
            
            if(response.data.success){
                return { success: true, data: response.data };
            } else {
                return { success: false, error: response.data.message };
            }
        }catch(err){
            set({ loading: false, error: err.response?.data?.message || err.message });
            throw err;
        }
    },

    // Utility functions
    clearError: () => set({ error: null }),
    
    setLoading: (loading) => set({ loading }),

    // Reset store
    resetStore: () => set({
        students: [],
        teachers: [],
        loading: false,
        error: null
    })
}));