import { Modal, Form, Select, Button, message, Spin } from "antd";
import '../../styles/generalstyle.scss';
import { CloseOutlined, LoadingOutlined } from '@ant-design/icons';
import { useState , useEffect, useCallback } from "react";
import { useHumanStore } from "../../store/humanStore";
import api from "../../api/interceptor";

const ManageSubjectsModal = ({teacherId, subjects , onClose, open}) =>{
    const { addSubjectsToTeacher, removeSubjectFromTeacher } = useHumanStore();
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const [ownedSubjects, setOwnedSubjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [operationLoading, setOperationLoading] = useState(false);

    const loadOwnedSubjects = useCallback(async () =>{
        if (!teacherId) return;
        
        setLoading(true);
        try{
            const response = await api.get(`/ref/api/ref/coreacademy/teacher-subject/${teacherId}`);
            if(response.data.success){
                setOwnedSubjects(response.data.data || []);
            } else {
                setOwnedSubjects([]);
                message.error("Failed to load teacher subjects");
            }
        }catch(err){
            console.error("Error loading owned subjects:", err);
            setOwnedSubjects([]);
            message.error("Error loading teacher subjects");
        } finally {
            setLoading(false);
        }
    }, [teacherId]);

    useEffect(() =>{
        if (open && teacherId) {
            loadOwnedSubjects();
            setSelectedSubjects([]);
        }
    }, [loadOwnedSubjects, open, teacherId]);

    const handleSubjectsChange = (values) => {
        setSelectedSubjects(values);
    };

    const handleSave = async () => {
        if (selectedSubjects.length === 0) {
            message.warning("Please select at least one subject");
            return;
        }
        
        setOperationLoading(true);
        try {
            const response = await addSubjectsToTeacher(teacherId, selectedSubjects);
            
            if (response && (response.success || response.data?.success)) {
                message.success("Subjects added successfully");
                setSelectedSubjects([]);
                await loadOwnedSubjects(); 
            } else {
                message.error("Failed to add subjects");
            }
        } catch (err) {
            console.error("Error saving subjects:", err);
            message.error(err.response?.data?.message || "Error adding subjects");
        } finally {
            setOperationLoading(false);
        }
    };

    const handleRemoveSubject = async(subjectId) =>{
        setOperationLoading(true);
        try{
            const response = await removeSubjectFromTeacher(teacherId, subjectId);
            if (response && (response.success || response.data?.success)) {
                message.success("Subject removed successfully");
                await loadOwnedSubjects();
            } else {
                message.error("Failed to remove subject");
            }
        }catch(err){
            console.error("Error removing subject:", err);
            message.error(err.response?.data?.message || "Error removing subject");
        } finally {
            setOperationLoading(false);
        }
    };
    const availableSubjects = subjects?.filter(subject => 
        !ownedSubjects.some(owned => owned.id === subject.id)
    ) || [];



    return(
        <Modal
            title={`Manage Subjects`}
            open={open}
            onCancel={onClose}
            footer={[
                <Button key="cancel" onClick={onClose} disabled={operationLoading}>
                    Cancel
                </Button>,
                <Button 
                    key="submit" 
                    type="primary" 
                    onClick={handleSave}
                    loading={operationLoading}
                    disabled={selectedSubjects.length === 0 || loading}
                >
                    Add Selected Subjects
                </Button>
            ]}
            width={700}
            destroyOnClose
        >
            <Spin spinning={loading} tip="Loading subjects...">
                <div style={{ marginBottom: 24 }}>
                    <strong>Currently Assigned Subjects:</strong>
                    <div style={{ 
                        display: 'flex', 
                        gap: '8px', 
                        flexWrap: 'wrap', 
                        marginTop: '12px',
                        minHeight: '60px',
                        border: '1px solid #d9d9d9',
                        borderRadius: 8,
                        padding: 12,
                        backgroundColor: '#fafafa'
                    }}>
                        {loading ? (
                            <div style={{ 
                                width: '100%',
                                textAlign: 'center',
                                color: '#888'
                            }}>
                                <LoadingOutlined /> Loading assigned subjects...
                            </div>
                        ) : ownedSubjects?.length > 0 ? (
                            ownedSubjects.map(subject => (
                                <span 
                                    key={subject.id} 
                                    className="subject-box"
                                >
                                    {subject.name_subject} 
                                    <CloseOutlined 
                                        onClick={() => handleRemoveSubject(subject.id)}
                                        style={{ 
                                            cursor: 'pointer',
                                            fontSize: '10px',
                                            opacity: operationLoading ? 0.5 : 1,
                                            pointerEvents: operationLoading ? 'none' : 'auto'
                                        }}
                                    />
                                </span>
                            ))
                        ) : (
                            <div style={{ 
                                width: '100%',
                                textAlign: 'center',
                                color: '#888'
                            }}>
                                No subjects assigned yet.
                            </div>
                        )}
                    </div>
                </div>

                <Form layout="vertical">
                    <Form.Item label="Add New Subjects">
                        <Select
                            mode="multiple"
                            placeholder="Select subjects to add"
                            style={{ width: '100%' }}
                            value={selectedSubjects}
                            onChange={handleSubjectsChange}
                            disabled={loading || operationLoading}
                            options={availableSubjects.map(subject => ({
                                label: subject.name_subject,
                                value: subject.id
                            }))}
                            notFoundContent={availableSubjects.length === 0 ? "All subjects are already assigned" : "No subjects found"}
                        />
                    </Form.Item>
                    {availableSubjects.length === 0 && (
                        <div style={{
                            padding: '8px 12px',
                            backgroundColor: '#f0f0f0',
                            borderRadius: 4,
                            color: '#666',
                            fontSize: '12px'
                        }}>
                            All available subjects are already assigned to this teacher.
                        </div>
                    )}
                </Form>
            </Spin>
        </Modal>
    )
}


export default ManageSubjectsModal;