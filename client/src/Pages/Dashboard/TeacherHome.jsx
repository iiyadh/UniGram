import { useState } from 'react';
import { Button, Card, Statistic, Empty, message } from 'antd';
import { PlusOutlined, CalendarOutlined } from '@ant-design/icons';
import { useAuthStore } from '../../store/authStore';
import ExcusedAbsenceModal from '../../Components/Modal/ExcusedAbsenceModal';
import '../../styles/teacherdashboard.scss';

const TeacherHome = () => {
    const { id: teacherId } = useAuthStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [excusedAbsences, setExcusedAbsences] = useState([]);

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const handleExcuseCreated = () => {
        message.info('Feature to load excused absences can be implemented here');
    };

    return (
        <div className="teacher-dashboard" style={{ padding: '24px' }}>
            <Card className="teacher-header-card" style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ margin: 0, marginBottom: '8px' }}>Teacher Dashboard</h1>
                        <p style={{ margin: 0, color: '#666' }}>Welcome to your teaching portal</p>
                    </div>
                    <Button
                        type="primary"
                        size="large"
                        icon={<PlusOutlined />}
                        onClick={() => setIsModalOpen(true)}
                    >
                        Create Excused Absence
                    </Button>
                </div>
            </Card>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                <Card>
                    <Statistic
                        title="Quick Action"
                        prefix={<CalendarOutlined />}
                        value="Manage Schedule"
                    />
                </Card>
            </div>

            <Card title="Excused Absences">
                {excusedAbsences.length === 0 ? (
                    <Empty
                        description="No excused absences yet"
                        style={{ marginTop: '24px' }}
                    />
                ) : (
                    <div>
                        {excusedAbsences.map((absence) => (
                            <Card key={absence.id} style={{ marginBottom: '12px' }}>
                                <p><strong>Date:</strong> {absence.date}</p>
                                <p><strong>Reason:</strong> {absence.reason}</p>
                            </Card>
                        ))}
                    </div>
                )}
            </Card>

            <ExcusedAbsenceModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                teacherId={teacherId}
                onSuccess={handleExcuseCreated}
            />
        </div>
    );
};

export default TeacherHome;
