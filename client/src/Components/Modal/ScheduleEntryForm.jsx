import { Modal, Form, Input, Select, message } from 'antd';
import { useEffect, useState } from 'react';
import api from '../../api/interceptor';

const ScheduleEntryForm = ({ open, setOpen, setEntries, days, timeSlots, entries, editingEntry, setEditingEntry, groupeId }) => {
    const [form] = Form.useForm();
    const [teachers, setTeachers] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [classRooms, setClassRooms] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [selectedClassRoom, setSelectedClassRoom] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (editingEntry) {
            form.setFieldsValue({
                teacherId: editingEntry.teacher_id,
                subjectId: editingEntry.subject_id,
                classroomId: editingEntry.classroom_id,
                day: editingEntry.day,
                timeSlot: editingEntry.time_slot
            });
            setSelectedSubject(editingEntry.subject_id);
            setSelectedTeacher(editingEntry.teacher_id);
            setSelectedClassRoom(editingEntry.classroom_id);
        } else {
            form.resetFields();
            setSelectedSubject(null);
            setSelectedTeacher(null);
            setSelectedClassRoom(null);
        }
    }, [editingEntry, form]);

    useEffect(() => {
        loadSubjects();
        loadClassRooms();
    }, []);

    useEffect(() => {
        if (selectedSubject) {
            loadTeachers();
        }
    }, [selectedSubject]);

    const loadTeachers = async () => {
        if (!selectedSubject) return;
        try {
            const response = await api.get(`/sched/api/schedule/teachers-subject/${selectedSubject}`);
            setTeachers(response.data.data);
        } catch (error) {
            console.error('Error loading teachers:', error);
        }
    };

    const loadSubjects = async () => {
        try {
            const response = await api.get('/sched/api/schedule/subjects');
            setSubjects(response.data.data);
        } catch (error) {
            console.error('Error loading subjects:', error);
        }
    };

    const loadClassRooms = async () => {
        try {
            const response = await api.get('/sched/api/schedule/classrooms');
            setClassRooms(response.data.data);
        } catch (error) {
            console.error('Error loading classrooms:', error);
        }
    };

    const handleFinish = async (values) => {
        setLoading(true);
        try {
            const selectedTimeSlots = Array.isArray(values.timeSlot) ? values.timeSlot : [values.timeSlot];
            const day = values.day;
            
            // Check for conflicts (excluding current entry if editing)
            const hasConflict = selectedTimeSlots.some(timeSlot => {
                const slotKey = day + timeSlot;
                return entries.some(entry => 
                    entry.slotKeys && entry.slotKeys.includes(slotKey) && 
                    (!editingEntry || entry.id !== editingEntry.id)
                );
            });
            
            if (hasConflict) {
                message.warning('Time slot conflict detected! Please choose different time slots.');
                setLoading(false);
                return;
            }

            if (editingEntry) {
                // Update existing entry
                const updateData = {
                    subjectId: values.subjectId,
                    teacherId: values.teacherId,
                    classroomId: values.classroomId,
                    groupeId: groupeId,
                    day: values.day,
                    timeSlot: values.timeSlot
                };

                await api.put(`/sched/api/schedule/schedule-entries/${editingEntry.id}`, updateData);
                message.success('Schedule entry updated successfully');
            } else {
                // Create new entries
                const createData = {
                    subjectId: values.subjectId,
                    teacherId: values.teacherId,
                    classroomId: values.classroomId,
                    groupeId: groupeId,
                    day: values.day,
                    timeSlots: selectedTimeSlots
                };
                console.log(createData)
                await api.post('/sched/api/schedule/schedule-entries', createData);
                message.success('Schedule entries created successfully');
            }

            // Reload entries
            await loadEntries();
            
            setOpen(false);
            setEditingEntry(null);
            form.resetFields();
        } catch (error) {
            console.error('Error saving schedule entry:', error);
            message.error('Failed to save schedule entry');
        } finally {
            setLoading(false);
        }
    };

    const loadEntries = async () => {
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
            setEntries(formattedEntries);
        } catch (error) {
            console.error('Error loading entries:', error);
        }
    };

    return (
        <Modal
            open={open}
            onCancel={() => {
                setOpen(false);
                setEditingEntry(null);
                form.resetFields();
            }}
            onOk={() => form.submit()}
            title={editingEntry ? "Edit Schedule Entry" : "Add Schedule Entry"}
            destroyOnClose
            confirmLoading={loading}
        >
            <Form form={form} layout="vertical" onFinish={handleFinish}>
                <Form.Item name="subjectId" label="Subject" rules={[{ required: true }]}>
                    <Select 
                        showSearch
                        placeholder="Select subject"
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        onChange={(value) => setSelectedSubject(value)}
                        options={subjects.map(s => ({ value: s.id, label: s.name_subject }))} 
                    />
                </Form.Item>
                
                <Form.Item name="teacherId" label="Teacher" rules={[{ required: true }]}>
                    <Select 
                        showSearch
                        placeholder="Select teacher"
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        onChange={(value) => setSelectedTeacher(value)}
                        options={teachers.map(t => ({ value: t.id, label: t.name }))} 
                        disabled={!selectedSubject}
                    />
                </Form.Item>
                
                <Form.Item name="classroomId" label="Class Room" rules={[{ required: true }]}>
                    <Select 
                        showSearch
                        placeholder="Select classroom"
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        onChange={(value) => setSelectedClassRoom(value)}
                        options={classRooms.map(c => ({ value: c.id, label: c.code_classroom }))} 
                    />
                </Form.Item>
                
                <Form.Item name="day" label="Day" rules={[{ required: true }]}>
                    <Select placeholder="Select day" options={days.map(d => ({ value: d, label: d }))} />
                </Form.Item>
                
                <Form.Item name="timeSlot" label="Time Slot" rules={[{ required: true }]}>
                    <Select 
                        mode={editingEntry ? undefined : "multiple"}
                        placeholder="Select time slot(s)"
                        options={timeSlots.map(t => ({ value: t, label: t }))} 
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ScheduleEntryForm;