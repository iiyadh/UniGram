import { useState } from "react"
import { Table, Input, Button, Popconfirm, message, Space, Card, Select, InputNumber ,Tag  } from "antd"
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import '../styles/dashboard.scss'

const { Option } = Select

const ClassroomsTable = () => {
  const [data, setData] = useState([
    { id: 1, code_classroom: "A101", capacity: 30, type_classroom: "Lecture Hall", id_departement: "D001" },
    { id: 2, code_classroom: "LAB1", capacity: 20, type_classroom: "Laboratory", id_departement: "D001" },
    { id: 3, code_classroom: "B201", capacity: 25, type_classroom: "Classroom", id_departement: "D002" },
  ])

  const [departments] = useState([
    { id: "D001", name: "Informatique" },
    { id: "D002", name: "Mathématiques" },
  ])

  const [classroomTypes] = useState(["Lecture Hall", "Laboratory", "Classroom", "Conference Room", "Computer Lab"])

  const [editId, setEditId] = useState(null)
  const [editRow, setEditRow] = useState({})
  const [newClassroom, setNewClassroom] = useState({ 
    code_classroom: "", 
    capacity: "", 
    type_classroom: "", 
    id_departement: "" 
  })

  const handleEdit = (row) => {
    setEditId(row.id)
    setEditRow({ ...row })
  }

  const handleSave = () => {
    if (!editRow.code_classroom?.trim() || !editRow.capacity || !editRow.type_classroom || !editRow.id_departement) {
      message.warning("All fields are required")
      return
    }
    setData(prev => prev.map(item => 
      item.id === editId ? { 
        ...editRow, 
        code_classroom: editRow.code_classroom.trim()
      } : item
    ))
    setEditId(null)
    setEditRow({})
    message.success("Classroom updated successfully")
  }

  const handleCancel = () => {
    setEditId(null)
    setEditRow({})
  }

  const handleDelete = (id) => {
    setData(prev => prev.filter(item => item.id !== id))
    message.success("Classroom deleted successfully")
  }

  const handleAdd = () => {
    const { code_classroom, capacity, type_classroom, id_departement } = newClassroom
    if (!code_classroom.trim() || !capacity || !type_classroom || !id_departement) {
      message.warning("Please fill all fields")
      return
    }

    const nextId = data.length ? Math.max(...data.map(d => d.id)) + 1 : 1
    setData(prev => [...prev, { 
      id: nextId, 
      code_classroom: code_classroom.trim(), 
      capacity, 
      type_classroom, 
      id_departement 
    }])
    setNewClassroom({ code_classroom: "", capacity: "", type_classroom: "", id_departement: "" })
    message.success("Classroom added successfully")
  }

  const getDepartmentName = (deptId) => {
    const dept = departments.find(d => d.id === deptId)
    return dept ? dept.name : deptId
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
      title: "Code",
      dataIndex: "code_classroom",
      key: "code_classroom",
      width: 120,
      render: (_, record) =>
        editId === record.id ? (
          <Input
            value={editRow.code_classroom}
            onChange={(e) => setEditRow({ ...editRow, code_classroom: e.target.value })}
            placeholder="Classroom code"
            size="small"
            className="edit-input"
          />
        ) : (
          <span className="classroom-code">{record.code_classroom}</span>
        ),
    },
    {
      title: "Capacity",
      dataIndex: "capacity",
      key: "capacity",
      width: 100,
      align: 'center',
      render: (_, record) =>
        editId === record.id ? (
          <InputNumber
            value={editRow.capacity}
            onChange={(value) => setEditRow({ ...editRow, capacity: value })}
            min={1}
            max={500}
            size="small"
            className="edit-input"
          />
        ) : (
          <span className="capacity">{record.capacity} seats</span>
        ),
    },
    {
      title: "Type",
      dataIndex: "type_classroom",
      key: "type_classroom",
      width: 150,
      render: (_, record) =>
        editId === record.id ? (
          <Select
            value={editRow.type_classroom}
            onChange={(value) => setEditRow({ ...editRow, type_classroom: value })}
            style={{ width: '100%' }}
            size="small"
            className="edit-select"
          >
            {classroomTypes.map(type => (
              <Option key={type} value={type}>{type}</Option>
            ))}
          </Select>
        ) : (
          <Tag color={
            record.type_classroom === "Laboratory" ? "green" : 
            record.type_classroom === "Lecture Hall" ? "blue" : "orange"
          } className="classroom-type">
            {record.type_classroom}
          </Tag>
        ),
    },
    {
      title: "Department",
      dataIndex: "id_departement",
      key: "id_departement",
      render: (_, record) =>
        editId === record.id ? (
          <Select
            value={editRow.id_departement}
            onChange={(value) => setEditRow({ ...editRow, id_departement: value })}
            style={{ width: '100%' }}
            size="small"
            className="edit-select"
          >
            {departments.map(dept => (
              <Option key={dept.id} value={dept.id}>{dept.name}</Option>
            ))}
          </Select>
        ) : (
          <span className="department-name">{getDepartmentName(record.id_departement)}</span>
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
              title="Delete this classroom?"
              description="Are you sure you want to delete this classroom?"
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
      title="Classrooms Management" 
      className="classrooms-card"
      extra={
        <span className="total-count">{data.length} classrooms</span>
      }
    >
      <div className="table-toolbar">
        <Space wrap size="middle" className="toolbar-actions">
          <Input
            placeholder="Classroom Code"
            value={newClassroom.code_classroom}
            onChange={(e) => setNewClassroom({ ...newClassroom, code_classroom: e.target.value })}
            className="add-input"
            allowClear
            style={{ width: 150 }}
          />
          <InputNumber
            placeholder="Capacity"
            value={newClassroom.capacity}
            onChange={(value) => setNewClassroom({ ...newClassroom, capacity: value })}
            min={1}
            max={500}
            className="add-input"
            style={{ width: 120 }}
          />
          <Select
            placeholder="Type"
            value={newClassroom.type_classroom}
            onChange={(value) => setNewClassroom({ ...newClassroom, type_classroom: value })}
            style={{ width: 150 }}
            className="add-select"
          >
            {classroomTypes.map(type => (
              <Option key={type} value={type}>{type}</Option>
            ))}
          </Select>
          <Select
            placeholder="Department"
            value={newClassroom.id_departement}
            onChange={(value) => setNewClassroom({ ...newClassroom, id_departement: value })}
            style={{ width: 180 }}
            className="add-select"
          >
            {departments.map(dept => (
              <Option key={dept.id} value={dept.id}>{dept.name}</Option>
            ))}
          </Select>
          <Button 
            type="primary" 
            onClick={handleAdd} 
            icon={<PlusOutlined />}
            className="add-btn"
          >
            Add Classroom
          </Button>
        </Space>
      </div>

      <Table
        dataSource={data}
        columns={columns}
        rowKey="id"
        className="classrooms-table"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} of ${total} items`
        }}
        size="middle"
        scroll={{ x: 800 }}
      />
    </Card>
  )
}

export default ClassroomsTable;