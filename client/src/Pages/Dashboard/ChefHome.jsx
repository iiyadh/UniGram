import { useEffect, useState } from 'react';
import { Card, Button, Empty, Spin, message, Table } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useAuthStore } from '../../store/authStore';
import api from '../../api/interceptor';
import '../../styles/chefdashboard.scss';

const ChefHome = () => {
    const { department_id: departmentId } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [specialties, setSpecialties] = useState([]);

    useEffect(() => {
        if (departmentId) {
            loadSpecialties();
        }
    }, [departmentId]);

    const loadSpecialties = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/ref/api/coreacademy/specialties/${departmentId}`);
            if (response.data.success) {
                setSpecialties(response.data.data);
            }
        } catch (error) {
            console.error('Error loading specialties:', error);
            message.error('Failed to load specialties');
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: 'Code',
            dataIndex: 'code_speciality',
            key: 'code_speciality',
        },
        {
            title: 'Name',
            dataIndex: 'name_speciality',
            key: 'name_speciality',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: () => (
                <span>
                    <Button type="link">Edit</Button>
                    <Button type="link" danger>Delete</Button>
                </span>
            ),
        },
    ];

    return (
        <div className="chef-dashboard" style={{ padding: '24px' }}>
            <Card style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ margin: 0, marginBottom: '8px' }}>Department Head Dashboard</h1>
                        <p style={{ margin: 0, color: '#666' }}>Manage your department's specialties</p>
                    </div>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => message.info('Create specialty feature can be implemented')}
                    >
                        Create Specialty
                    </Button>
                </div>
            </Card>

            <Spin spinning={loading}>
                <Card title={`Specialties in Your Department`}>
                    {specialties.length === 0 ? (
                        <Empty description="No specialties found in your department" />
                    ) : (
                        <Table
                            columns={columns}
                            dataSource={specialties}
                            rowKey="id"
                            pagination={false}
                        />
                    )}
                </Card>
            </Spin>
        </div>
    );
};

export default ChefHome;
