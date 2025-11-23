import api from '../api/interceptor';
import { create } from 'zustand';

export const useScheduleStore = create((set, get) => ({
    scheduleEntries: [],
    scheduleEntriesgroupe: [],
    scheduleEntriesteacher: [],
    scheduleEntriesClassRoom: [],
    loading: false,
    error: null,

    createScheduleEntry: async (entryData) => {
        set({ loading: true, error: null });
        try {
            const response = await api.post('/sched/api/schedule', entryData);
            set(state => ({ 
                scheduleEntries: [...state.scheduleEntries, ...response.data.data], 
                loading: false 
            }));
            return response.data.data;
        } catch (error) {
            set({ error: error.response?.data?.error || error.message, loading: false });
            throw error;
        }
    },
    
    fetchScheduleByGroupe: async (groupeId) => {
        set({ loading: true, error: null });
        try {
            const response = await api.get(`/sched/api/schedule/groupe/${groupeId}`);
            const formattedEntries = response.data.data.map(entry => ({
                ...entry,
                slotKeys: [entry.day + entry.time_slot],
                colSpan: 1,
                subjectName: entry.subject_name,
                teacherName: entry.teacher_name,
                classRoom: entry.classroom_code
            }));
            set({ scheduleEntriesgroupe: formattedEntries, loading: false });
            return formattedEntries;
        } catch (error) {
            set({ error: error.response?.data?.error || error.message, loading: false });
            throw error;
        }
    },

    fetchScheduleByTeacher: async (teacherId) => {
        set({ loading: true, error: null });
        try {
            const response = await api.get(`/sched/api/schedule/teacher/${teacherId}`);
            set({ scheduleEntriesteacher: response.data.data, loading: false });
            return response.data.data;
        } catch (error) {
            set({ error: error.response?.data?.error || error.message, loading: false });
            throw error;
        }
    },

    fetchScheduleByClassRoom: async (classRoomId) => {
        set({ loading: true, error: null });
        try {
            const response = await api.get(`/sched/api/schedule/classroom/${classRoomId}`);
            set({ scheduleEntriesClassRoom: response.data.data, loading: false });
            return response.data.data;
        } catch (error) {
            set({ error: error.response?.data?.error || error.message, loading: false });
            throw error;
        }
    },

    updateScheduleEntry: async (entryId, updatedData) => {
        set({ loading: true, error: null });
        try {
            const response = await api.put(`/sched/api/schedule/${entryId}`, updatedData);
            const updatedEntries = get().scheduleEntries.map(entry =>
                entry.id === entryId ? { ...entry, ...response.data.data } : entry
            );
            set({ scheduleEntries: updatedEntries, loading: false });
            return response.data.data;
        } catch (error) {
            set({ error: error.response?.data?.error || error.message, loading: false });
            throw error;
        }
    },

    deleteScheduleEntry: async (entryId) => {
        set({ loading: true, error: null });
        try {
            await api.delete(`/sched/api/schedule/${entryId}`);
            const filteredEntries = get().scheduleEntries.filter(entry => entry.id !== entryId);
            set({ scheduleEntries: filteredEntries, loading: false });
        } catch (error) {
            set({ error: error.response?.data?.error || error.message, loading: false });
            throw error;
        }
    },

    convertFormat: (data) => {
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const schedule = {};
        days.forEach(day => {
            schedule[day] = data.filter(entry => entry.day === day);
        });
        return schedule;
    },
}));