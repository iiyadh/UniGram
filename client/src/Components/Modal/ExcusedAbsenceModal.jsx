import { useState } from 'react';
import { Modal, Form, Input, DatePicker, Button, message, Spin } from 'antd';
import dayjs from 'dayjs';
import api from '../../api/interceptor';

const ExcusedAbsenceModal = ({ isOpen, onClose, teacherId, onSuccess }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values) => {
        try {
            setLoading(true);
            const excusedAbsenceData = {
                teacher_id: teacherId,
                schedule_entry_id: null,
                reason: values.reason,
                date: values.date.format('YYYY-MM-DD')
            };

            const response = await api.post('/schedule/api/schedule/excused-absence', excusedAbsenceData);

            if (response.data.success) {
                message.success('Excused absence created successfully');
                form.resetFields();
                onClose();
                if (onSuccess) onSuccess();
            }
        } catch (error) {
            console.error('Error creating excused absence:', error);
            message.error(error.response?.data?.error || 'Failed to create excused absence');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        onClose();
    };

    return (
        <Modal
            title="Create Excused Absence"
            open={isOpen}
            onCancel={handleCancel}
            footer={null}
            centered
        >
            <Spin spinning={loading}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    style={{ marginTop: '20px' }}
                >
                    <Form.Item
                        label="Date"
                        name="date"
                        rules={[
                            { required: true, message: 'Please select a date' },
                        ]}
                    >
                        <DatePicker
                            style={{ width: '100%' }}
                            placeholder="Select date"
                            disabledDate={(current) => {
                                return current && current < dayjs().startOf('day');
                            }}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Reason"
                        name="reason"
                        rules={[
                            { required: true, message: 'Please provide a reason' },
                            { min: 10, message: 'Reason must be at least 10 characters' },
                            { max: 500, message: 'Reason must not exceed 500 characters' }
                        ]}
                    >
                        <Input.TextArea
                            rows={4}
                            placeholder="Explain why you will not be coming..."
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block loading={loading}>
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Spin>
        </Modal>
    );
};

export default ExcusedAbsenceModal;
