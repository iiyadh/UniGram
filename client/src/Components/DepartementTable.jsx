import { useState } from "react"
import { Table, Input, Button, Popconfirm, message, Space, Card } from "antd"
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import '../styles/dashboard.scss'

const DepartementTable = () => {
  const [data, setData] = useState([
    { id: 1, name: "Informatique", chef_id: "C001" },
    { id: 2, name: "Mathématiques", chef_id: "C002" },
  ])

  const [editId, setEditId] = useState(null)
  const [editRow, setEditRow] = useState({})
  const [newDept, setNewDept] = useState({ name: "", chef_id: "" })

  const handleEdit = (row) => {
    setEditId(row.id)
    setEditRow({ ...row })
  }

  const handleSave = () => {
    if (!editRow.name?.trim() || !editRow.chef_id?.trim()) {
      message.warning("Both Name and Chef ID are required")
      return
    }
    setData(prev => prev.map(item => 
      item.id === editId ? { 
        ...editRow, 
        name: editRow.name.trim(), 
        chef_id: editRow.chef_id.trim() 
      } : item
    ))
    setEditId(null)
    setEditRow({})
    message.success("Department updated successfully")
  }

  const handleCancel = () => {
    setEditId(null)
    setEditRow({})
  }

  const handleDelete = (id) => {
    setData(prev => prev.filter(item => item.id !== id))
    message.success("Department deleted successfully")
  }

  const handleAdd = () => {
    const name = newDept.name.trim()
    const chefId = newDept.chef_id.trim()
    if (!name || !chefId) {
      message.warning("Please fill out both Name and Chef ID")
      return
    }
    const nextId = data.length ? Math.max(...data.map(d => d.id)) + 1 : 1
    setData(prev => [...prev, { id: nextId, name, chef_id: chefId }])
    setNewDept({ name: "", chef_id: "" })
    message.success("Department added successfully")
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
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (_, record) =>
        editId === record.id ? (
          <Input
            value={editRow.name}
            onChange={(e) => setEditRow({ ...editRow, name: e.target.value })}
            placeholder="Department name"
            size="small"
          />
        ) : (
          <span className="department-name">{record.name}</span>
        ),
    },
    {
      title: "Chef ID",
      dataIndex: "chef_id",
      key: "chef_id",
      width: 120,
      render: (_, record) =>
        editId === record.id ? (
          <Input
            value={editRow.chef_id}
            onChange={(e) => setEditRow({ ...editRow, chef_id: e.target.value })}
            placeholder="Chef ID"
            size="small"
          />
        ) : (
          <span className="chef-id">{record.chef_id}</span>
        ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      align: 'center',
      render: (_, record) =>
        editId === record.id ? (
          <Space size="small">
            <Button 
              type="primary" 
              onClick={handleSave} 
              size="small"
            >
              Save
            </Button>
            <Button 
              onClick={handleCancel}
              size="small"
            >
              Cancel
            </Button>
          </Space>
        ) : (
          <Space size="small">
            <Button
              type="link"
              onClick={() => handleEdit(record)}
              icon={<EditOutlined />}
              className="edit-btn"
              size="small"
            />
            <Popconfirm
              title="Delete this department?"
              description="Are you sure you want to delete this department?"
              okText="Yes"
              cancelText="No"
              onConfirm={() => handleDelete(record.id)}
              okType="danger"
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
      title="Departments Management" 
      className="department-card"
      extra={
        <span className="total-count">{data.length} departments</span>
      }
    >
      <div className="table-toolbar">
        <Space wrap size="middle" className="toolbar-actions">
          <Input
            placeholder="Department Name"
            value={newDept.name}
            onChange={(e) => setNewDept({ ...newDept, name: e.target.value })}
            style={{ width: 200 }}
            allowClear
            onPressEnter={handleAdd}
          />
          <Input
            placeholder="Chef ID"
            value={newDept.chef_id}
            onChange={(e) => setNewDept({ ...newDept, chef_id: e.target.value })}
            style={{ width: 150 }}
            allowClear
            onPressEnter={handleAdd}
          />
          <Button 
            type="primary" 
            onClick={handleAdd} 
            disabled={!!editId}
            icon={<PlusOutlined />}
            className="add-btn"
          >
            Add Department
          </Button>
        </Space>
      </div>

      <Table
        dataSource={data}
        columns={columns}
        rowKey="id"
        className="department-table"
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

export default DepartementTable