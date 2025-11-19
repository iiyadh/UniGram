import { useState, useEffect } from "react"
import { Table, Input, Button, Select, Tag, Space, Card, message, Popconfirm, Dropdown ,Modal  } from "antd"
import { PlusOutlined, EditOutlined, DeleteOutlined ,BookOutlined ,MoreOutlined  } from '@ant-design/icons'
import { useHumanStore } from '../store/humanStore';
import api from '../api/interceptor';
import '../styles/dashboard.scss';
import ManageSubjectsModal from "./Modal/ManageSubjectsModal";

const { Option } = Select

const TeacherTable = () => {
  const {
    teachers,
    loading,
    getAllTeachers,
    createTeacher,
    updateTeacher,
    deleteTeacher,
  } = useHumanStore()

  const [editId, setEditId] = useState(null)
  const [editRow, setEditRow] = useState({});
  const [subjects, setSubjects] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedTeacherId, setSelectedTeacherId] = useState(null)
  const [newTeacher, setNewTeacher] = useState({
    cin: "",
    name: "",
    email: "",
    account_status: "Active",
  })

  useEffect(() => {
    loadTeachers();
    loadSubjects();
  }, [])

  const loadTeachers = async () => {
    try {
      await getAllTeachers()
    } catch (error) {
      message.error("Failed to load teachers")
    }
  }

  const loadSubjects = async () =>{
    try{
      const res = await api.get('/ref/api/ref/coreacademy/subjects');
      if(res.data.success){
        setSubjects(res.data.data);
        console.log(res.data.data);
      }
    }catch(err){
      message.error("Failed to load subjects");
    }
  }

  const handleEdit = (row) => {
    setEditId(row.teacher_id)
    setEditRow({ ...row })
  }

  const handleSave = async () => {
    if (!editRow.cin?.trim() || !editRow.name?.trim() || !editRow.email?.trim()) {
      message.warning("Please fill all required fields")
      return
    }
    try {
      await updateTeacher(editId, {
        cin: editRow.cin.trim(),
        name: editRow.name.trim(),
        email: editRow.email.trim(),
        account_status: editRow.account_status,

      })
      setEditId(null)
      setEditRow({})
      message.success("Teacher updated successfully")
    } catch (error) {
      message.error("Failed to update teacher")
    }
  }

  const handleCancel = () => {
    setEditId(null)
    setEditRow({})
  }

  const handleDelete = async (id) => {
    try {
      await deleteTeacher(id)
      message.success("Teacher deleted successfully")
    } catch (error) {
      message.error("Failed to delete teacher")
    }
  }

  const handleAdd = async () => {
    const { cin, name, email, account_status } = newTeacher;

    console.log(newTeacher);
    if (!cin.trim() || !name.trim() || !email.trim()) {
      message.warning("Please fill all required fields")
      return
    }

    try {
      await createTeacher({
        cin: cin.trim(),
        name: name.trim(),
        email: email.trim(),
        account_status,
      })
      loadTeachers();
      setNewTeacher({
        cin: "",
        name: "",
        email: "",
        account_status: "Active",
      })
      message.success("Teacher added successfully")
    } catch (error) {
      message.error("Failed to add teacher")
    }
  }

  const handleManageSubjects = (teacherId) => {
    setSelectedTeacherId(teacherId)
    setModalVisible(true)
  }

  const handleCloseModal = () => {
    setModalVisible(false)
    setSelectedTeacherId(null)
  }

  const columns = [
    { 
      title: "ID", 
      dataIndex: "teacher_id", 
      key: "teacher_id", 
      width: 80,
      align: 'center'
    },
    { 
      title: "CIN", 
      dataIndex: "cin", 
      key: "cin",
      width: 120,
      render: (_, record) =>
        editId === record.teacher_id ? (
          <Input
            value={editRow.cin}
            onChange={(e) => setEditRow({ ...editRow, cin: e.target.value })}
            size="small"
            className="edit-input"
          />
        ) : (
          <span className="cin">{record.cin}</span>
        ),
    },
    { 
      title: "Name", 
      dataIndex: "name", 
      key: "name",
      render: (_, record) =>
        editId === record.teacher_id ? (
          <Input
            value={editRow.name}
            onChange={(e) => setEditRow({ ...editRow, name: e.target.value })}
            size="small"
            className="edit-input"
          />
        ) : (
          <span className="name">{record.name}</span>
        ),
    },
    { 
      title: "Email", 
      dataIndex: "email", 
      key: "email",
      render: (_, record) =>
        editId === record.teacher_id ? (
          <Input
            value={editRow.email}
            onChange={(e) => setEditRow({ ...editRow, email: e.target.value })}
            size="small"
            className="edit-input"
          />
        ) : (
          <span className="email">{record.email}</span>
        ),
    },
    {
      title: "Status",
      dataIndex: "account_status",
      key: "account_status",
      width: 120,
      render: (_, record) =>
        editId === record.teacher_id ? (
          <Select
            value={editRow.account_status}
            onChange={(value) => setEditRow({ ...editRow, account_status: value })}
            style={{ width: 120 }}
            size="small"
            className="status-select"
          >
            <Option value="active">Active</Option>
            <Option value="inactive">Inactive</Option>
          </Select>
        ) : (
          <Tag 
            color={record.account_status.toUpperCase() === "ACTIVE" ? "green" : "red"} 
            className="status-tag"
          >
            {record.account_status.toUpperCase()}
          </Tag>
        ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      align: 'center',
      render: (_, record) =>
        editId === record.teacher_id ? (
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
              title="Delete this teacher?"
              description="Are you sure you want to delete this teacher?"
              okText="Yes"
              cancelText="No"
              onConfirm={() => handleDelete(record.teacher_id)}
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
          <Dropdown
              trigger={["click"]}
              placement="bottomRight"
              menu={{
                items: [
                  { 
                    key: "manage-subjects", 
                    label: "Manage subjects",
                    icon : <BookOutlined />
                   },
                ],
                onClick: () => handleManageSubjects(record.teacher_id),
              }}
            >
              <Button
                type="text"
                size="small"
                icon={<MoreOutlined style={{ rotate: "90deg" }} />}
              />
            </Dropdown>
          </Space>
        ),
    },
  ]

  return (
    <Card 
      title="Teachers Management" 
      className="teachers-card"
      extra={
        <span className="total-count">{teachers.length} teachers</span>
      }
    >

      <div className="table-toolbar">
        <Space wrap size="middle" className="toolbar-actions">
          <Input
            placeholder="CIN"
            value={newTeacher.cin}
            onChange={(e) => setNewTeacher({ ...newTeacher, cin: e.target.value })}
            className="add-input"
            allowClear
            style={{ width: 120 }}
          />
          <Input
            placeholder="Name"
            value={newTeacher.name}
            onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
            className="add-input"
            allowClear
            style={{ width: 200 }}
          />
          <Input
            placeholder="Email"
            value={newTeacher.email}
            onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })}
            className="add-input"
            allowClear
            style={{ width: 200 }}
          />
          <Select
            placeholder="Status"
            value={newTeacher.account_status}
            onChange={(value) => setNewTeacher({ ...newTeacher, account_status: value })}
            style={{ width: 120 }}
            className="add-select"
          >
            <Option value="Active">Active</Option>
            <Option value="Inactive">Inactive</Option>
          </Select>
          <Button 
            type="primary" 
            onClick={handleAdd} 
            icon={<PlusOutlined />}
            className="add-btn"
          >
            Add Teacher
          </Button>
        </Space>
      </div>

      <Table
        dataSource={teachers}
        columns={columns}
        rowKey="teacher_id"
        className="teachers-table"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} of ${total} items`
        }}
        size="middle"
        scroll={{ x: 1000 }}
      />

      {modalVisible && (
        <ManageSubjectsModal 
          teacherId={selectedTeacherId} 
          subjects={subjects}
          open={modalVisible}
          onClose={handleCloseModal}
        />
      )}
    </Card>
  )
}

export default TeacherTable;
