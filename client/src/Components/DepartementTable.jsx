import { useState } from "react"
import { Table, Input, Button } from "antd"
import { DeleteOutlined , EditOutlined } from '@ant-design/icons';
import '../styles/dashboard.scss'

const DepartementTable = () => {
  const [data, setData] = useState([
    { id: 1, name: "Informatique", chef_id: "C001" },
    { id: 2, name: "Mathématiques", chef_id: "C002" },
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
    { title: "ID", dataIndex: "id", key: "id" },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (_, record) =>
        editId === record.id ? (
          <Input
            value={editRow.name}
            onChange={(e) => setEditRow({ ...editRow, name: e.target.value })}
          />
        ) : (
          record.name
        ),
    },
    {
      title: "Chef ID",
      dataIndex: "chef_id",
      key: "chef_id",
      render: (_, record) =>
        editId === record.id ? (
          <Input
            value={editRow.chef_id}
            onChange={(e) => setEditRow({ ...editRow, chef_id: e.target.value })}
          />
        ) : (
          record.chef_id
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
            <Button type="link" onClick={() => handleEdit(record)} style={{ marginRight: 8 }} className="edit-btn">
              <EditOutlined />
            </Button>
            <Button type="link" danger onClick={() => handleDelete(record.id)} className="delete-btn">
              <DeleteOutlined />
            </Button>
          </>
        ),
    },
  ]

  return (
    <Table dataSource={data} columns={columns} rowKey="id" className="dashboard-table" />
  )
}

export default DepartementTable;