import { useState } from "react"
import { Table, Input, Button, Popconfirm, message, Space, Card, Select } from "antd"
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import '../styles/dashboard.scss'

const { Option } = Select

const SpecialtyTable = () => {
  const [data, setData] = useState([
    { id: 1, code_speciality: "INF", name_speciality: "Informatique", departement_id: "D001" },
    { id: 2, code_speciality: "MATH", name_speciality: "Mathématiques", departement_id: "D002" },
  ])

  const [departments] = useState([
    { id: "D001", name: "Informatique" },
    { id: "D002", name: "Mathématiques" },
  ])

  const [editId, setEditId] = useState(null)
  const [editRow, setEditRow] = useState({})
  const [newSpecialty, setNewSpecialty] = useState({ code_speciality: "", name_speciality: "", departement_id: "" })
  const [isModalVisible, setIsModalVisible] = useState(false)

  const handleEdit = (row) => {
    setEditId(row.id)
    setEditRow({ ...row })
  }

  const handleSave = () => {
    if (!editRow.code_speciality?.trim() || !editRow.name_speciality?.trim() || !editRow.departement_id) {
      message.warning("All fields are required")
      return
    }
    setData(prev => prev.map(item => 
      item.id === editId ? { 
        ...editRow, 
        code_speciality: editRow.code_speciality.trim(),
        name_speciality: editRow.name_speciality.trim()
      } : item
    ))
    setEditId(null)
    setEditRow({})
    message.success("Specialty updated successfully")
  }

  const handleCancel = () => {
    setEditId(null)
    setEditRow({})
  }

  const handleDelete = (id) => {
    setData(prev => prev.filter(item => item.id !== id))
    message.success("Specialty deleted successfully")
  }

  const handleAdd = () => {
    const code = newSpecialty.code_speciality.trim()
    const name = newSpecialty.name_speciality.trim()
    const deptId = newSpecialty.departement_id

    if (!code || !name || !deptId) {
      message.warning("Please fill all fields")
      return
    }

    const nextId = data.length ? Math.max(...data.map(d => d.id)) + 1 : 1
    setData(prev => [...prev, { 
      id: nextId, 
      code_speciality: code, 
      name_speciality: name, 
      departement_id: deptId 
    }])
    setNewSpecialty({ code_speciality: "", name_speciality: "", departement_id: "" })
    message.success("Specialty added successfully")
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
      dataIndex: "code_speciality",
      key: "code_speciality",
      width: 120,
      render: (_, record) =>
        editId === record.id ? (
          <Input
            value={editRow.code_speciality}
            onChange={(e) => setEditRow({ ...editRow, code_speciality: e.target.value })}
            placeholder="Specialty code"
            size="small"
            className="edit-input"
          />
        ) : (
          <span className="specialty-code">{record.code_speciality}</span>
        ),
    },
    {
      title: "Name",
      dataIndex: "name_speciality",
      key: "name_speciality",
      render: (_, record) =>
        editId === record.id ? (
          <Input
            value={editRow.name_speciality}
            onChange={(e) => setEditRow({ ...editRow, name_speciality: e.target.value })}
            placeholder="Specialty name"
            size="small"
            className="edit-input"
          />
        ) : (
          <span className="specialty-name">{record.name_speciality}</span>
        ),
    },
    {
      title: "Department",
      dataIndex: "departement_id",
      key: "departement_id",
      width: 150,
      render: (_, record) =>
        editId === record.id ? (
          <Select
            value={editRow.departement_id}
            onChange={(value) => setEditRow({ ...editRow, departement_id: value })}
            style={{ width: '100%' }}
            size="small"
            className="edit-select"
          >
            {departments.map(dept => (
              <Option key={dept.id} value={dept.id}>{dept.name}</Option>
            ))}
          </Select>
        ) : (
          <span className="department-id">
            {departments.find(d => d.id === record.departement_id)?.name || record.departement_id}
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
              title="Delete this specialty?"
              description="Are you sure you want to delete this specialty?"
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
      title="Specialties Management" 
      className="specialty-card"
      extra={
        <span className="total-count">{data.length} specialties</span>
      }
    >
      <div className="table-toolbar">
        <Space wrap size="middle" className="toolbar-actions">
          <Input
            placeholder="Specialty Code"
            value={newSpecialty.code_speciality}
            onChange={(e) => setNewSpecialty({ ...newSpecialty, code_speciality: e.target.value })}
            className="add-input"
            allowClear
            style={{ width: 150 }}
          />
          <Input
            placeholder="Specialty Name"
            value={newSpecialty.name_speciality}
            onChange={(e) => setNewSpecialty({ ...newSpecialty, name_speciality: e.target.value })}
            className="add-input"
            allowClear
            style={{ width: 200 }}
          />
          <Select
            placeholder="Select Department"
            value={newSpecialty.departement_id}
            onChange={(value) => setNewSpecialty({ ...newSpecialty, departement_id: value })}
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
            Add Specialty
          </Button>
        </Space>
      </div>

      <Table
        dataSource={data}
        columns={columns}
        rowKey="id"
        className="specialty-table"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} of ${total} items`
        }}
        size="middle"
        scroll={{ x: 700 }}
      />
    </Card>
  )
}

export default SpecialtyTable;