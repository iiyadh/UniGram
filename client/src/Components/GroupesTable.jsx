import { useState } from "react"
import { Table, Input, Button, Popconfirm, message, Space, Card, Select } from "antd"
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import '../styles/dashboard.scss'

const { Option } = Select

const GroupesTable = () => {
  const [data, setData] = useState([
    { id: 1, code_groupe: "G1-INF", level_id: 1 },
    { id: 2, code_groupe: "G2-INF", level_id: 1 },
    { id: 3, code_groupe: "G1-MATH", level_id: 3 },
  ])

  const [levels] = useState([
    { id: 1, num_level: 1, speciality: "Informatique" },
    { id: 2, num_level: 2, speciality: "Informatique" },
    { id: 3, num_level: 1, speciality: "Mathématiques" },
  ])

  const [editId, setEditId] = useState(null)
  const [editRow, setEditRow] = useState({})
  const [newGroup, setNewGroup] = useState({ code_groupe: "", level_id: "" })

  const handleEdit = (row) => {
    setEditId(row.id)
    setEditRow({ ...row })
  }

  const handleSave = () => {
    if (!editRow.code_groupe?.trim() || !editRow.level_id) {
      message.warning("All fields are required")
      return
    }
    setData(prev => prev.map(item => 
      item.id === editId ? { 
        ...editRow, 
        code_groupe: editRow.code_groupe.trim()
      } : item
    ))
    setEditId(null)
    setEditRow({})
    message.success("Group updated successfully")
  }

  const handleCancel = () => {
    setEditId(null)
    setEditRow({})
  }

  const handleDelete = (id) => {
    setData(prev => prev.filter(item => item.id !== id))
    message.success("Group deleted successfully")
  }

  const handleAdd = () => {
    const code = newGroup.code_groupe.trim()
    const levelId = newGroup.level_id

    if (!code || !levelId) {
      message.warning("Please fill all fields")
      return
    }

    const nextId = data.length ? Math.max(...data.map(d => d.id)) + 1 : 1
    setData(prev => [...prev, { 
      id: nextId, 
      code_groupe: code, 
      level_id: levelId 
    }])
    setNewGroup({ code_groupe: "", level_id: "" })
    message.success("Group added successfully")
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
      title: "Group Code",
      dataIndex: "code_groupe",
      key: "code_groupe",
      width: 150,
      render: (_, record) =>
        editId === record.id ? (
          <Input
            value={editRow.code_groupe}
            onChange={(e) => setEditRow({ ...editRow, code_groupe: e.target.value })}
            placeholder="Group code"
            size="small"
            className="edit-input"
          />
        ) : (
          <span className="group-code">{record.code_groupe}</span>
        ),
    },
    {
      title: "Level",
      dataIndex: "level_id",
      key: "level_id",
      render: (_, record) =>
        editId === record.id ? (
          <Select
            value={editRow.level_id}
            onChange={(value) => setEditRow({ ...editRow, level_id: value })}
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
          <span className="level-info">{getLevelDisplay(record.level_id)}</span>
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
              title="Delete this group?"
              description="Are you sure you want to delete this group?"
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
      title="Groups Management" 
      className="groups-card"
      extra={
        <span className="total-count">{data.length} groups</span>
      }
    >
      <div className="table-toolbar">
        <Space wrap size="middle" className="toolbar-actions">
          <Input
            placeholder="Group Code"
            value={newGroup.code_groupe}
            onChange={(e) => setNewGroup({ ...newGroup, code_groupe: e.target.value })}
            className="add-input"
            allowClear
            style={{ width: 180 }}
          />
          <Select
            placeholder="Select Level"
            value={newGroup.level_id}
            onChange={(value) => setNewGroup({ ...newGroup, level_id: value })}
            style={{ width: 250 }}
            className="add-select"
          >
            {levels.map(level => (
              <Option key={level.id} value={level.id}>
                Level {level.num_level} - {level.speciality}
              </Option>
            ))}
          </Select>
          <Button 
            type="primary" 
            onClick={handleAdd} 
            icon={<PlusOutlined />}
            className="add-btn"
          >
            Add Group
          </Button>
        </Space>
      </div>

      <Table
        dataSource={data}
        columns={columns}
        rowKey="id"
        className="groups-table"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} of ${total} items`
        }}
        size="middle"
        scroll={{ x: 650 }}
      />
    </Card>
  )
}

export default GroupesTable;