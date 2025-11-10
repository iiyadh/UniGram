import { useState } from "react"
import { Table, Input, Button, Select, Tag, Space, Modal, Form, Card } from "antd"
import { PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import '../styles/dashboard.scss'

const { Option } = Select

const StudentsTable = () => {
  const [data, setData] = useState([
    { id: 1, cin: "12345678", name: "John Doe", email: "john.doe@example.com", accountStatus: "Active", group_id: "G1" },
    { id: 2, cin: "87654321", name: "Jane Smith", email: "jane.smith@example.com", accountStatus: "Inactive", group_id: "G2" },
  ])

  const [editId, setEditId] = useState(null)
  const [editRow, setEditRow] = useState({})
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isViewModalVisible, setIsViewModalVisible] = useState(false)
  const [viewRecord, setViewRecord] = useState(null)
  const [form] = Form.useForm()

  const handleEdit = (row) => {
    setEditId(row.id)
    setEditRow({ ...row })
  }

  const handleSave = () => {
    if (!editRow.cin?.trim() || !editRow.name?.trim() || !editRow.email?.trim()) {
      message.warning("Please fill all required fields")
      return
    }
    setData(prev => prev.map(item => (item.id === editId ? editRow : item)))
    setEditId(null)
    message.success("Student updated successfully")
  }

  const handleCancel = () => {
    setEditId(null)
  }

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this student?',
      className: 'delete-confirm-modal',
      onOk: () => {
        setData(prev => prev.filter(item => item.id !== id))
        message.success("Student deleted successfully")
      }
    })
  }

  const handleView = (record) => {
    setViewRecord(record)
    setIsViewModalVisible(true)
  }

  const handleAdd = () => {
    form.resetFields()
    setIsModalVisible(true)
  }

  const handleAddSubmit = (values) => {
    const newStudent = {
      id: data.length > 0 ? Math.max(...data.map(item => item.id)) + 1 : 1,
      ...values
    }
    setData(prev => [...prev, newStudent])
    setIsModalVisible(false)
    form.resetFields()
    message.success("Student added successfully")
  }

  const columns = [
    { 
      title: "CIN", 
      dataIndex: "cin", 
      key: "cin",
      width: 120 
    },
    { 
      title: "Name", 
      dataIndex: "name", 
      key: "name" 
    },
    { 
      title: "Email", 
      dataIndex: "email", 
      key: "email" 
    },
    {
      title: "Status",
      dataIndex: "accountStatus",
      key: "accountStatus",
      width: 120,
      render: (_, record) =>
        editId === record.id ? (
          <Select
            value={editRow.accountStatus}
            onChange={(value) => setEditRow({ ...editRow, accountStatus: value })}
            style={{ width: 120 }}
            size="small"
            className="status-select"
          >
            <Option value="Active">Active</Option>
            <Option value="Inactive">Inactive</Option>
          </Select>
        ) : (
          <Tag 
            color={record.accountStatus === "Active" ? "green" : "red"} 
            className="status-tag"
          >
            {record.accountStatus}
          </Tag>
        ),
    },
    {
      title: "Group",
      dataIndex: "group_id",
      key: "group_id",
      width: 100,
      render: (_, record) =>
        editId === record.id ? (
          <Input
            value={editRow.group_id}
            onChange={(e) => setEditRow({ ...editRow, group_id: e.target.value })}
            size="small"
            className="edit-input"
          />
        ) : (
          <span className="group-id">{record.group_id}</span>
        ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 200,
      render: (_, record) =>
        editId === record.id ? (
          <Space size="small" className="action-buttons">
            <Button type="primary" onClick={handleSave} size="small" className="save-btn">
              Save
            </Button>
            <Button onClick={handleCancel} size="small" className="cancel-btn">
              Cancel
            </Button>
          </Space>
        ) : (
          <Space size="small" className="action-buttons">
            <Button 
              type="link" 
              onClick={() => handleView(record)}
              icon={<EyeOutlined />}
              className="view-btn"
            />
            <Button 
              type="link" 
              onClick={() => handleEdit(record)}
              icon={<EditOutlined />}
              className="edit-btn"
            />
            <Button 
              type="link" 
              danger 
              onClick={() => handleDelete(record.id)}
              icon={<DeleteOutlined />}
              className="delete-btn"
            />
          </Space>
        ),
    },
  ]

  return (
    <Card 
      title="Students Management" 
      className="students-card"
      extra={
        <span className="total-count">{data.length} students</span>
      }
    >
      <div className="table-toolbar">
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={handleAdd}
          className="add-btn"
        >
          Add Student
        </Button>
      </div>

      <Table 
        dataSource={data} 
        columns={columns} 
        rowKey="id" 
        className="students-table"
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

      {/* Add Modal */}
      <Modal
        title="Add New Student"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        className="add-modal"
      >
        <Form form={form} onFinish={handleAddSubmit} layout="vertical">
          <Form.Item name="cin" label="CIN" rules={[{ required: true }]}>
            <Input className="modal-input" />
          </Form.Item>
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input className="modal-input" />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input className="modal-input" />
          </Form.Item>
          <Form.Item name="accountStatus" label="Status" rules={[{ required: true }]}>
            <Select className="modal-select">
              <Option value="Active">Active</Option>
              <Option value="Inactive">Inactive</Option>
            </Select>
          </Form.Item>
          <Form.Item name="group_id" label="Group" rules={[{ required: true }]}>
            <Input className="modal-input" />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" className="modal-submit-btn">
                Add Student
              </Button>
              <Button onClick={() => setIsModalVisible(false)} className="modal-cancel-btn">
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* View Modal */}
      <Modal
        title="Student Details"
        open={isViewModalVisible}
        onCancel={() => setIsViewModalVisible(false)}
        footer={[
          <Button 
            key="close" 
            onClick={() => setIsViewModalVisible(false)}
            className="modal-close-btn"
          >
            Close
          </Button>
        ]}
        className="view-modal"
      >
        {viewRecord && (
          <div className="student-details">
            <p><strong>CIN:</strong> {viewRecord.cin}</p>
            <p><strong>Name:</strong> {viewRecord.name}</p>
            <p><strong>Email:</strong> {viewRecord.email}</p>
            <p>
              <strong>Status:</strong>{" "}
              <Tag color={viewRecord.accountStatus === "Active" ? "green" : "red"}>
                {viewRecord.accountStatus}
              </Tag>
            </p>
            <p><strong>Group:</strong> {viewRecord.group_id}</p>
          </div>
        )}
      </Modal>
    </Card>
  )
}

export default StudentsTable