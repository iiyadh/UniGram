import { useState } from "react"
import { Table, Input, Button, Popconfirm, message, Space, Card, Select, InputNumber } from "antd"
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import '../styles/dashboard.scss'

const { Option } = Select

const LevelsTable = () => {
  const [data, setData] = useState([
    { id: 1, num_level: 1, speciality_id: "INF" },
    { id: 2, num_level: 2, speciality_id: "INF" },
    { id: 3, num_level: 1, speciality_id: "MATH" },
  ])

  const [specialties] = useState([
    { id: "INF", name: "Informatique" },
    { id: "MATH", name: "Mathématiques" },
  ])

  const [editId, setEditId] = useState(null)
  const [editRow, setEditRow] = useState({})
  const [newLevel, setNewLevel] = useState({ num_level: "", speciality_id: "" })

  const handleEdit = (row) => {
    setEditId(row.id)
    setEditRow({ ...row })
  }

  const handleSave = () => {
    if (!editRow.num_level || !editRow.speciality_id) {
      message.warning("All fields are required")
      return
    }
    setData(prev => prev.map(item => 
      item.id === editId ? editRow : item
    ))
    setEditId(null)
    setEditRow({})
    message.success("Level updated successfully")
  }

  const handleCancel = () => {
    setEditId(null)
    setEditRow({})
  }

  const handleDelete = (id) => {
    setData(prev => prev.filter(item => item.id !== id))
    message.success("Level deleted successfully")
  }

  const handleAdd = () => {
    if (!newLevel.num_level || !newLevel.speciality_id) {
      message.warning("Please fill all fields")
      return
    }

    const nextId = data.length ? Math.max(...data.map(d => d.id)) + 1 : 1
    setData(prev => [...prev, { 
      id: nextId, 
      num_level: newLevel.num_level, 
      speciality_id: newLevel.speciality_id 
    }])
    setNewLevel({ num_level: "", speciality_id: "" })
    message.success("Level added successfully")
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
      title: "Level Number",
      dataIndex: "num_level",
      key: "num_level",
      width: 120,
      render: (_, record) =>
        editId === record.id ? (
          <InputNumber
            value={editRow.num_level}
            onChange={(value) => setEditRow({ ...editRow, num_level: value })}
            placeholder="Level number"
            min={1}
            max={10}
            size="small"
            className="edit-input"
          />
        ) : (
          <span className="level-number">Level {record.num_level}</span>
        ),
    },
    {
      title: "Specialty",
      dataIndex: "speciality_id",
      key: "speciality_id",
      render: (_, record) =>
        editId === record.id ? (
          <Select
            value={editRow.speciality_id}
            onChange={(value) => setEditRow({ ...editRow, speciality_id: value })}
            style={{ width: '100%' }}
            size="small"
            className="edit-select"
          >
            {specialties.map(spec => (
              <Option key={spec.id} value={spec.id}>{spec.name}</Option>
            ))}
          </Select>
        ) : (
          <span className="specialty-name">
            {specialties.find(s => s.id === record.speciality_id)?.name || record.speciality_id}
          </span>
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
              title="Delete this level?"
              description="Are you sure you want to delete this level?"
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
      title="Levels Management" 
      className="levels-card"
      extra={
        <span className="total-count">{data.length} levels</span>
      }
    >
      <div className="table-toolbar">
        <Space wrap size="middle" className="toolbar-actions">
          <InputNumber
            placeholder="Level Number"
            value={newLevel.num_level}
            onChange={(value) => setNewLevel({ ...newLevel, num_level: value })}
            min={1}
            max={10}
            className="add-input"
            style={{ width: 150 }}
          />
          <Select
            placeholder="Select Specialty"
            value={newLevel.speciality_id}
            onChange={(value) => setNewLevel({ ...newLevel, speciality_id: value })}
            style={{ width: 200 }}
            className="add-select"
          >
            {specialties.map(spec => (
              <Option key={spec.id} value={spec.id}>{spec.name}</Option>
            ))}
          </Select>
          <Button 
            type="primary" 
            onClick={handleAdd} 
            icon={<PlusOutlined />}
            className="add-btn"
          >
            Add Level
          </Button>
        </Space>
      </div>

      <Table
        dataSource={data}
        columns={columns}
        rowKey="id"
        className="levels-table"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} of ${total} items`
        }}
        size="middle"
        scroll={{ x: 600 }}
      />
    </Card>
  )
}

export default LevelsTable;