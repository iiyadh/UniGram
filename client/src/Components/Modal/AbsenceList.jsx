import { Table, Select, Button, Modal, message } from 'antd';
import { useState,useEffect } from 'react';
import api from '../../api/interceptor';
const { Option } = Select;


const AbsenceList = ({ isOpen, onClose, sessionData }) => {
    const [data,setData] = useState([]);
    const [attendanceData, setAttendanceData] = useState([]);
    const [loading, setLoading] = useState(false);


    useEffect(()=>{
        if (sessionData?.groupId && isOpen) {
            loadData();
        }
    },[sessionData?.groupId, isOpen]);


    const loadData = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/sched/api/schedule/students-groupe/${sessionData?.groupId}`);
            let studentsData = res.data.data.map((item, index) => ({
                key: index,
                id: item.id,
                studentName: item.name,
                status: 'Present',
            }));
            const currentDate = new Date().toISOString().split('T')[0];
            try {
                const existingAttendance = await api.get(`/sched/api/schedule/attendance/${sessionData.id}/${currentDate}`);
                if (existingAttendance.data.success && existingAttendance.data.data.length > 0) {
                    const attendanceMap = {};
                    existingAttendance.data.data.forEach(record => {
                        attendanceMap[record.student_id] = record.status;
                    });
                    
                    studentsData = studentsData.map(student => ({
                        ...student,
                        status: attendanceMap[student.id] || 'Present'
                    }));
                }
            } catch (attendanceError) {
                console.log('No existing attendance found, using defaults');
            }

            setData(studentsData);
            setAttendanceData(studentsData);
        } catch (error) {
            console.error('Error loading students data:', error);
            message.error('Failed to load students data');
        } finally {
            setLoading(false);
        }
    }

    const handleOk = async () => {
        try {
            setLoading(true);
            const res = await api.post('/sched/api/schedule/submit-attendance', {
                schedule_entry_id: sessionData.id,
                students: attendanceData.map(item => ({
                    student_id: item.id,
                    status: item.status
                }))
            });
            
            if (res.data.success) {
                message.success(`Attendance submitted successfully! ${res.data.recorded_absences || 0} absences recorded.`);
                onClose();
            }
        } catch (error) {
            console.error('Error submitting attendance:', error);
            message.error('Failed to submit attendance. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        onClose();
    };

    const handleStatusChange = (key, newStatus) => {
        setAttendanceData(prev => 
            prev.map(student => 
                student.key === key 
                    ? { ...student, status: newStatus }
                    : student
            )
        );
    };

    const columns = [
        {
            title: 'Student Name',
            dataIndex: 'studentName',
            key: 'studentName',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status, record) =>
                <Select
                    value={status}
                    style={{ width: 120 }}
                    onChange={(value) => handleStatusChange(record.key, value)}
                >
                    <Option value="Present">Present</Option>
                    <Option value="Absent">Absent</Option>
                    <Option value="Excused">Excused</Option>
                </Select>
        }
    ];
    return (
        <Modal
            title={`Absence List - ${sessionData?.subjectName || 'Session'} (${sessionData?.groupName || 'Group'})`}
            open={isOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            okText="Submit Attendance"
            cancelText="Cancel"
            width={600}
            confirmLoading={loading}
        >
            <div style={{ marginBottom: 16 }}>
                <p><strong>Subject:</strong> {sessionData?.subjectName}</p>
                <p><strong>Group:</strong> {sessionData?.groupName}</p>
                <p><strong>Classroom:</strong> {sessionData?.classRoom}</p>
            </div>
            <Table
                columns={columns}
                dataSource={attendanceData}
                pagination={false}
                loading={loading}
                scroll={attendanceData.length > 6 ? { y: 6 * 54 } : undefined}
            />
        </Modal>
    )
}

export default AbsenceList;