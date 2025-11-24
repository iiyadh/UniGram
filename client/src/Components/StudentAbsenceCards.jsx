import api from '../api/interceptor';
import { Card, Empty, Spin, Alert } from 'antd';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/generalstyle.scss';

const StudentAbsenceCards = () => {
    const { idstudent } = useParams();
    const [absenceData, setAbsenceData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (idstudent) {
            fetchAbsenceData();
        }
    }, [idstudent]);

    const fetchAbsenceData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get(`/sched/api/schedule/absences-student/${idstudent}`);
            if (response.data.success) {
                setAbsenceData(response.data.data || []);
            }
        } catch (err) {
            console.error('Error fetching absence data:', err);
            setError('Failed to load absence data. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const getAbsenceStatus = (absenceCount) => {
        const statusConfig = {
            0: { color: '#52c41a', text: 'Safe' },
            1: { color: '#a0d911', text: 'Good' },
            2: { color: '#fadb14', text: 'Warning' },
            3: { color: '#fa8c16', text: 'Critical' },
            default: { color: '#f5222d', text: 'Danger' }
        };

        return statusConfig[absenceCount] || statusConfig.default;
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                <Spin size="large" tip="Loading absence data..." />
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ padding: '20px' }}>
                <Alert
                    message="Error"
                    description={error}
                    type="error"
                    showIcon
                    action={
                        <button 
                            onClick={fetchAbsenceData}
                            style={{ border: 'none', background: 'transparent', color: '#1890ff', cursor: 'pointer' }}
                        >
                            Retry
                        </button>
                    }
                />
            </div>
        );
    }

    return (
        <div style={{ padding: '20px' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '20px' }} className="report-title">
                Student Absence Report
            </h1>

            {!idstudent ? (
                <Alert
                    message="Missing Student ID"
                    description="Student ID is required to load absence data."
                    type="warning"
                    showIcon
                />
            ) : absenceData.length === 0 ? (
                <Empty 
                    description="No absence data available" 
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
            ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
                    {absenceData.map(({ name_subject, absence_count }) => {
                        const maxAbsences = 4;
                        const progressPercentage = Math.min((absence_count / maxAbsences) * 100, 100);
                        const { color: statusColor, text: statusText } = getAbsenceStatus(absence_count);

                        return (
                            <Card
                                key={name_subject}
                                style={{
                                    width: 240,
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                    border: 'none',
                                    overflow: 'hidden',
                                    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                                }}
                                bodyStyle={{ padding: '20px' }}
                                hoverable
                            >
                                <h3
                                    style={{
                                        color: '#262626',
                                        marginBottom: '16px',
                                        fontSize: '16px',
                                        fontWeight: '600',
                                        textAlign: 'center',
                                        minHeight: '48px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                    title={name_subject}
                                >
                                    {name_subject}
                                </h3>

                                <div style={{ marginBottom: '16px' }}>
                                    <div
                                        style={{
                                            width: '100%',
                                            height: '20px',
                                            backgroundColor: '#f5f5f5',
                                            borderRadius: '10px',
                                            overflow: 'hidden',
                                            marginBottom: '8px'
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: `${progressPercentage}%`,
                                                height: '100%',
                                                backgroundColor: statusColor,
                                                transition: 'width 0.3s ease',
                                                borderRadius: '10px'
                                            }}
                                        />
                                    </div>

                                    <div
                                        style={{
                                            fontSize: '14px',
                                            color: '#595959',
                                            textAlign: 'center',
                                            fontWeight: '500'
                                        }}
                                    >
                                        {absence_count} / {maxAbsences} Absences
                                    </div>
                                </div>

                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        padding: '6px 16px',
                                        borderRadius: '16px',
                                        backgroundColor: `${statusColor}15`,
                                        color: statusColor,
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        border: `1px solid ${statusColor}30`
                                    }}
                                >
                                    {statusText}
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default StudentAbsenceCards;