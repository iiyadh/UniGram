import { useState } from "react"
import { Table, Input, Button, Select } from "antd"
import '../styles/dashboard.scss'

const { Option } = Select

const StudentsTable = () => {
  const [data, setData] = useState([
    { id: 1, cin: "12345678", name: "John Doe", email: "john.doe@example.com", accountStatus: "Active", group_id: "G1" },
    { id: 2, cin: "87654321", name: "Jane Smith", email: "jane.smith@example.com", accountStatus: "Inactive", group_id: "G2" },
  ])

  const [editId, setEditId] = useState(null)
  const [editRow, setEditRow] = useState({})

  const handleEdit = (row) => {
    setEditId(row.id)
    setEditRow(row)
  }

  const handleSave = () => {
    setData(prev => prev.map(item => (item.id === editId ? editRow : item)))
    setEditId(null)
  }

  const handleCancel = () => {
    setEditId(null)
  }

  const handleDelete = (id) => {
    setData(prev => prev.filter(item => item.id !== id))
  }

  const columns = [
    { title: "CIN", dataIndex: "cin", key: "cin" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Status",
      dataIndex: "accountStatus",
      key: "accountStatus",
      render: (_, record) =>
        editId === record.id ? (
          <Select
            value={editRow.accountStatus}
            onChange={(value) => setEditRow({ ...editRow, accountStatus: value })}
            style={{ width: 120 }}
          >
            <Option value="Active">Active</Option>
            <Option value="Inactive">Inactive</Option>
          </Select>
        ) : (
          record.accountStatus
        ),
    },
    {
      title: "Group",
      dataIndex: "group_id",
      key: "group_id",
      render: (_, record) =>
        editId === record.id ? (
          <Input
            value={editRow.group_id}
            onChange={(e) => setEditRow({ ...editRow, group_id: e.target.value })}
          />
        ) : (
          record.group_id
        ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) =>
        editId === record.id ? (
          <>
            <Button type="primary" onClick={handleSave} style={{ marginRight: 8 }}>
              Save
            </Button>
            <Button onClick={handleCancel}>Cancel</Button>
          </>
        ) : (
          <>
            <Button type="link" onClick={() => handleEdit(record)} style={{ marginRight: 8 }}>
              Edit
            </Button>
            <Button type="link" danger onClick={() => handleDelete(record.id)}>
              Delete
            </Button>
          </>
        ),
    },
  ]

  return (
    <Table dataSource={data} columns={columns} rowKey="id" className="dashboard-table"/>
  )

}

export default StudentsTable
