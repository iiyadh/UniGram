import { useState } from "react"
import { Table, Input, Button, Popconfirm, message, Space, Card, Select, InputNumber ,Tag } from "antd"
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import '../styles/dashboard.scss'

const { Option } = Select

const SubjectsTable = () => {
  const [data, setData] = useState([
    { id: 1, type_subject: "Theory", name_subject: "Algorithms", id_level: 1, credits: 4, coefficient: 3 },
    { id: 2, type_subject: "Practical", name_subject: "Programming Lab", id_level: 1, credits: 2, coefficient: 2 },
  ])

  const [levels] = useState([
    { id: 1, num_level: 1, speciality: "Informatique" },
    { id: 2, num_level: 2, speciality: "Informatique" },
  ])

  const [subjectTypes] = useState(["Theory", "Practical", "Project", "Seminar"])

  const [editId, setEditId] = useState(null)
  const [editRow, setEditRow] = useState({})
  const [newSubject, setNewSubject] = useState({ 
    type_subject: "", 
    name_subject: "", 
    id_level: "", 
    credits: "", 
    coefficient: "" 
  })

  const handleEdit = (row) => {
    setEditId(row.id)
    setEditRow({ ...row })
  }

  const handleSave = () => {
    if (!editRow.type_subject || !editRow.name_subject?.trim() || !editRow.id_level || !editRow.credits || !editRow.coefficient) {
      message.warning("All fields are required")
      return
    }
    setData(prev => prev.map(item => 
      item.id === editId ? { 
        ...editRow, 
        name_subject: editRow.name_subject.trim()
      } : item
    ))
    setEditId(null)
    setEditRow({})
    message.success("Subject updated successfully")
  }

  const handleCancel = () => {
    setEditId(null)
    setEditRow({})
  }

  const handleDelete = (id) => {
    setData(prev => prev.filter(item => item.id !== id))
    message.success("Subject deleted successfully")
  }

  const handleAdd = () => {
    const { type_subject, name_subject, id_level, credits, coefficient } = newSubject
    if (!type_subject || !name_subject.trim() || !id_level || !credits || !coefficient) {
      message.warning("Please fill all fields")
      return
    }

    const nextId = data.length ? Math.max(...data.map(d => d.id)) + 1 : 1
    setData(prev => [...prev, { 
      id: nextId, 
      type_subject, 
      name_subject: name_subject.trim(), 
      id_level, 
      credits, 
      coefficient 
    }])
    setNewSubject({ type_subject: "", name_subject: "", id_level: "", credits: "", coefficient: "" })
    message.success("Subject added successfully")
  }

  const getLevelDisplay = (levelId) => {
    const level = levels.find(l => l.id === levelId)
    return level ? `Level ${level.num_level} - ${level.speciality}` : levelId
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
          <Tag color={record.type_subject === "Theory" ? "blue" : "green"} className="subject-type">
            {record.type_subject}
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
      title: "Level",
      dataIndex: "id_level",
      key: "id_level",
      width: 200,
      render: (_, record) =>
        editId === record.id ? (
          <Select
            value={editRow.id_level}
            onChange={(value) => setEditRow({ ...editRow, id_level: value })}
            style={{ width: '100%' }}
            size="small"
            className="edit-select"
          >
            {levels.map(level => (
              <Option key={level.id} value={level.id}>
                Level {level.num_level} - {level.speciality}
              </Option>
            ))}
          </Select>
        ) : (
          <span className="level-info">{getLevelDisplay(record.id_level)}</span>
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
        <span className="total-count">{data.length} subjects</span>
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
          <Select
            placeholder="Level"
            value={newSubject.id_level}
            onChange={(value) => setNewSubject({ ...newSubject, id_level: value })}
            style={{ width: 200 }}
            className="add-select"
          >
            {levels.map(level => (
              <Option key={level.id} value={level.id}>
                Level {level.num_level} - {level.speciality}
              </Option>
            ))}
          </Select>
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
        dataSource={data}
        columns={columns}
        rowKey="id"
        className="subjects-table"
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