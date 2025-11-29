import { useState, useEffect } from 'react';
import { Card, Button, Tabs, Empty, Spin, message } from 'antd';
import { CalendarOutlined, FileTextOutlined } from '@ant-design/icons';
import { useAuthStore } from '../../store/authStore';
import '../../styles/studentdashboard.scss';

const StudentHome = () => {
    const { id: studentId } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [studentData, setStudentData] = useState(null);
    const [absenceCards, setAbsenceCards] = useState([]);

    useEffect(() => {
        loadStudentData();
    }, [studentId]);

    const loadStudentData = async () => {
        try {
            setLoading(true);
            // You can add API calls to fetch student-specific data
            // const response = await api.get(`/ref/api/coreacademy/students/${studentId}`);
            // setStudentData(response.data.data);
        } catch (error) {
            console.error('Error loading student data:', error);
            message.error('Failed to load student data');
        } finally {
            setLoading(false);
        }
    };

    const tabItems = [
        {
            key: '1',
            label: (
                <span>
                    <FileTextOutlined />
                    Absence Cards
                </span>
            ),
            children: (
                <Card>
                    <Empty
                        description="Your absence cards will appear here"
                        style={{ marginTop: '24px' }}
                    />
                </Card>
            ),
        },
        {
            key: '2',
            label: (
                <span>
                    <CalendarOutlined />
                    Schedule
                </span>
            ),
            children: (
                <Card>
                    <Empty
                        description="Your groupe schedule will appear here"
                        style={{ marginTop: '24px' }}
                    />
                </Card>
            ),
        },
    ];

    return (
        <div className="student-dashboard" style={{ padding: '24px' }}>
            <Card style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ margin: 0, marginBottom: '8px' }}>Student Dashboard</h1>
                        <p style={{ margin: 0, color: '#666' }}>View your academic information</p>
                    </div>
                </div>
            </Card>

            <Spin spinning={loading}>
                <Tabs defaultActiveKey="1" items={tabItems} />
            </Spin>
        </div>
    );
};

export default StudentHome;
