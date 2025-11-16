import { useState, useEffect } from "react"
import { Table, Input, Button, Popconfirm, message, Space, Card, Select, InputNumber ,Tag } from "antd"
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { useAcademyStore } from '../store/academyStore';
import '../styles/dashboard.scss';
import { useParams } from "react-router-dom";

const { Option } = Select

const SubjectsTable = () => {
  const { 
    subjects,  
    fetchSubjects, 
    createSubject, 
    updateSubject, 
    deleteSubject 
  } = useAcademyStore();
  const [loading, setLoading] = useState(false);
  const { levelid } = useParams();

  const [subjectTypes] = useState(["Course", "Practical", "Tutorial"])
  const [editId, setEditId] = useState(null)
  const [editRow, setEditRow] = useState({})
  const [newSubject, setNewSubject] = useState({ 
    type_subject: "", 
    name_subject: "", 
    id_level: levelid ? parseInt(levelid) : "",
    credits: "", 
    coefficient: "" 
  })
  const map = {
    "TD": "Tutorial",
    "TP": "Practical",
    "cours": "Course",
    "Tutorial": "TD",
    "Practical": "TP",
    "Course": "cours"
  }

  useEffect(() => {
    loadSubjects()
  }, [])

  const loadSubjects = async () => {
    setLoading(true)
    const result = await fetchSubjects(levelid);
    if (!result.success) {
      message.error(result.error)
    }
    setLoading(false)
  }

  const handleEdit = (row) => {
    setEditId(row.id)
    setEditRow({ ...row })
  }

  const handleSave = async () => {
    if (!editRow.type_subject || !editRow.name_subject?.trim() || !editRow.id_level || !editRow.credits || !editRow.coefficient) {
      message.warning("All fields are required")
      return
    }
    setLoading(true)
    const result = await updateSubject(editId, {
      type_subject: map[editRow.type_subject],
      name_subject: editRow.name_subject.trim(),
      id_level: levelid,
      credits: editRow.credits,
      coefficient: editRow.coefficient
    })
    if (result.success) {
      setEditId(null);
      setEditRow({});
      message.success("Subject updated successfully");
    } else {
      message.error(result.error);
    }
    setLoading(false)
  }

  const handleCancel = () => {
    setEditId(null);
    setEditRow({});
  }

  const handleDelete = async (id) => {
    setLoading(true);
    const result = await deleteSubject(id);
    if (result.success) {
      message.success("Subject deleted successfully");
    } else {
      message.error(result.error);
    }
    setLoading(false);
  }

  const handleAdd = async () => {
    const { type_subject, name_subject, credits, coefficient } = newSubject
    if (!type_subject || !name_subject.trim() || !credits || !coefficient) {
      message.warning("Please fill all fields");
      return
    }

    setLoading(true)
    const result = await createSubject({
      type_subject : map[type_subject],
      name_subject: name_subject.trim(),
      id_level : levelid,
      credits,
      coefficient
    })
    if (result.success) {
      setNewSubject({ type_subject: "", name_subject: "", id_level: "", credits: "", coefficient: "" })
      message.success("Subject added successfully")
    } else {
      message.error(result.error)
    }
    setLoading(false)
  }

  const columns = [
    { 
      title: "ID", 
      dataIndex: "id", 
      key: "id", 
      width: 80,
      align: 'center'
    },
    {
      title: "Type",
      dataIndex: "type_subject",
      key: "type_subject",
      width: 120,
      render: (_, record) =>
        editId === record.id ? (
          <Select
            value={editRow.type_subject}
            onChange={(value) => setEditRow({ ...editRow, type_subject: value })}
            style={{ width: '100%' }}
            size="small"
            className="edit-select"
          >
            {subjectTypes.map(type => (
              <Option key={type} value={type}>{type}</Option>
            ))}
          </Select>
        ) : (
          <Tag color={map[record.type_subject] === "Practical" ? "blue" 
            :
           map[record.type_subject] === "Course" ? "red" : "green"} className="subject-type">
            {map[record.type_subject]}
          </Tag>
        ),
    },
    {
      title: "Subject Name",
      dataIndex: "name_subject",
      key: "name_subject",
      render: (_, record) =>
        editId === record.id ? (
          <Input
            value={editRow.name_subject}
            onChange={(e) => setEditRow({ ...editRow, name_subject: e.target.value })}
            placeholder="Subject name"
            size="small"
            className="edit-input"
          />
        ) : (
          <span className="subject-name">{record.name_subject}</span>
        ),
    },
    {
      title: "Credits",
      dataIndex: "credits",
      key: "credits",
      width: 100,
      align: 'center',
      render: (_, record) =>
        editId === record.id ? (
          <InputNumber
            value={editRow.credits}
            onChange={(value) => setEditRow({ ...editRow, credits: value })}
            min={1}
            max={10}
            size="small"
            className="edit-input"
          />
        ) : (
          <span className="credits">{record.credits}</span>
        ),
    },
    {
      title: "Coefficient",
      dataIndex: "coefficient",
      key: "coefficient",
      width: 120,
      align: 'center',
      render: (_, record) =>
        editId === record.id ? (
          <InputNumber
            value={editRow.coefficient}
            onChange={(value) => setEditRow({ ...editRow, coefficient: value })}
            min={1}
            max={5}
            step={0.5}
            size="small"
            className="edit-input"
          />
        ) : (
          <span className="coefficient">{record.coefficient}</span>
        ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      align: 'center',
      render: (_, record) =>
        editId === record.id ? (
          <Space size="small" className="action-buttons">
            <Button 
              type="primary" 
              onClick={handleSave} 
              size="small"
              className="save-btn"
            >
              Save
            </Button>
            <Button 
              onClick={handleCancel}
              size="small"
              className="cancel-btn"
            >
              Cancel
            </Button>
          </Space>
        ) : (
          <Space size="small" className="action-buttons">
            <Button
              type="link"
              onClick={() => handleEdit(record)}
              icon={<EditOutlined />}
              className="edit-btn"
              size="small"
            />
            <Popconfirm
              title="Delete this subject?"
              description="Are you sure you want to delete this subject?"
              okText="Yes"
              cancelText="No"
              onConfirm={() => handleDelete(record.id)}
              okType="danger"
              className="delete-confirm"
            >
              <Button 
                type="link" 
                danger 
                icon={<DeleteOutlined />}
                className="delete-btn"
                size="small"
              />
            </Popconfirm>
          </Space>
        ),
    },
  ]

  return (
    <Card 
      title="Subjects Management" 
      className="subjects-card"
      extra={
        <span className="total-count">{subjects.length} subjects</span>
      }
    >
      <div className="table-toolbar">
        <Space wrap size="middle" className="toolbar-actions">
          <Select
            placeholder="Type"
            value={newSubject.type_subject}
            onChange={(value) => setNewSubject({ ...newSubject, type_subject: value })}
            style={{ width: 120 }}
            className="add-select"
          >
            {subjectTypes.map(type => (
              <Option key={type} value={type}>{type}</Option>
            ))}
          </Select>
          <Input
            placeholder="Subject Name"
            value={newSubject.name_subject}
            onChange={(e) => setNewSubject({ ...newSubject, name_subject: e.target.value })}
            className="add-input"
            allowClear
            style={{ width: 200 }}
          />
          <InputNumber
            placeholder="Credits"
            value={newSubject.credits}
            onChange={(value) => setNewSubject({ ...newSubject, credits: value })}
            min={1}
            max={10}
            className="add-input"
            style={{ width: 100 }}
          />
          <InputNumber
            placeholder="Coefficient"
            value={newSubject.coefficient}
            onChange={(value) => setNewSubject({ ...newSubject, coefficient: value })}
            min={1}
            max={5}
            step={0.5}
            className="add-input"
            style={{ width: 120 }}
          />
          <Button 
            type="primary" 
            onClick={handleAdd} 
            icon={<PlusOutlined />}
            className="add-btn"
          >
            Add Subject
          </Button>
        </Space>
      </div>

      <Table
        dataSource={subjects}
        columns={columns}
        rowKey="id"
        className="subjects-table"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} of ${total} items`
        }}
        size="middle"
        scroll={{ x: 900 }}
      />
    </Card>
  )
}

export default SubjectsTable;