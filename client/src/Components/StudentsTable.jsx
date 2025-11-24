import { useState, useEffect } from "react"
import { Table, Input, Button, Select, Tag, Space, Card, message, Popconfirm, Upload } from "antd"
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined, DownloadOutlined ,IssuesCloseOutlined} from '@ant-design/icons'
import { useHumanStore } from '../store/humanStore'
import '../styles/dashboard.scss';
import api from "../api/interceptor";
import { Link } from "react-router-dom"

const { Option } = Select

const StudentsTable = () => {
  const {
    students,
    loading,
    getAllStudents,
    createStudent,
    updateStudent,
    deleteStudent,
    exportStudentsCsv,
    importStudentsCsv
  } = useHumanStore()

  const [editId, setEditId] = useState(null)
  const [editRow, setEditRow] = useState({});
  const [groups, setGroups] = useState([]);
  const [newStudent, setNewStudent] = useState({
    cin: "",
    name: "",
    email: "",
    account_status: "active",
    group_id: ""
  })

  useEffect(() => {
    loadStudents();
    fetchGroups();
  }, [])

  const fetchGroups = async () => {
    try {
      const response = await api.get('/ref/api/ref/coreacademy/groups');
      if (response.data.success) {
        setGroups(response.data.data);
      }
      console.log(groups);
    } catch (err) {
      console.log(err)
      message.error("Failed to load groups")
    }
  }

  const loadStudents = async () => {
    try {
      await getAllStudents()
    } catch (error) {
      message.error("Failed to load students")
    }
  }

  const handleEdit = (row) => {
    setEditId(row.id)
    setEditRow({ ...row })
  }

  const handleSave = async () => {
    if (!editRow.cin?.trim() || !editRow.name?.trim() || !editRow.email?.trim()) {
      message.warning("Please fill all required fields")
      return
    }
    try {
      await updateStudent(editId, {
        cin: editRow.cin.trim(),
        name: editRow.name.trim(),
        email: editRow.email.trim(),
        account_status: editRow.account_status,
        group_id: editRow.group_id
      })
      setEditId(null)
      setEditRow({})
      message.success("Student updated successfully")
      loadStudents();
    } catch (error) {
      message.error("Failed to update student")
    }
  }

  const handleCancel = () => {
    setEditId(null)
    setEditRow({})
  }

  const handleDelete = async (id) => {
    try {
      await deleteStudent(id)
      message.success("Student deleted successfully")
    } catch (error) {
      message.error("Failed to delete student")
    }
  }

  const handleAdd = async () => {
    const { cin, name, email, account_status, group_id } = newStudent
    if (!cin.trim() || !name.trim() || !email.trim()) {
      message.warning("Please fill all required fields")
      return
    }

    try {
      await createStudent({
        cin: cin.trim(),
        name: name.trim(),
        email: email.trim(),
        account_status,
        group_id
      })
      loadStudents();
      setNewStudent({
        cin: "",
        name: "",
        email: "",
        account_status: "active",
        group_id: ""
      })
      message.success("Student added successfully")
    } catch (error) {
      message.error("Failed to add student")
    }
  }

  const handleImport = async (file) => {
    try{
      await importStudentsCsv(file);
      message.success('Import successful');
      loadStudents();
      return false;
    }catch(err){
      message.error('Import failed');
    }
  }

  const handleExport = async () => {
    try{
      const file = await exportStudentsCsv();
      const blob = new Blob([file], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.setAttribute('download', 'students.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      message.success('Export successful');
    }catch(err){
      message.error('Export failed');
    }
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
      title: "CIN", 
      dataIndex: "cin", 
      key: "cin",
      width: 120,
      render: (_, record) =>
        editId === record.id ? (
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
        editId === record.id ? (
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
        editId === record.id ? (
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
        editId === record.id ? (
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
            color={
              record.account_status?.toLowerCase() === "active"
                ? "green"
                : "red"
            }
            className="status-tag"
          >
            {record.account_status?.toUpperCase()}
          </Tag>
        ),
    },
    {
      title: "Group",
      dataIndex: "group_id",
      key: "group_id",
      width: 140,
      render: (_, record) =>
        editId === record.id ? (
          <Select
            showSearch
            size="small"
            style={{ width: 140 }}
            value={editRow.group_id}
            onChange={(value) => setEditRow({ ...editRow, group_id: value })}
            optionFilterProp="children"
          >
            <Option value={null}>None</Option>
            {groups.map((g) => (
              <Option key={g.id} value={g.id}>
                {g.code_groupe}
              </Option>
            ))}
          </Select>
        ) : (
          <span className="group-id">
            {record.code_groupe || 'N/A'}
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
              title="Delete this student?"
              description="Are you sure you want to delete this student?"
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
            <Link to={`/dashboard/absences-student/${record.id}`}>
              <Button
                type="link"
                icon={<IssuesCloseOutlined />}
                className="view-absences-btn"
                size="small"
              >
                View Absences
              </Button>
            </Link>
          </Space>
        ),
    },
  ]

  return (
    <Card 
      title="Students Management" 
      className="students-card"
      extra={
        <span className="total-count">{students.length} students</span>
      }
    >
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
        <Upload
          accept=".csv,text/csv"
          beforeUpload={handleImport}
          showUploadList={false}
          maxCount={1}
        >
          <Button icon={<UploadOutlined />}>Choose CSV file</Button>
        </Upload>

        <Button
          type="primary"
          icon={<DownloadOutlined />}
          onClick={handleExport}
          disabled={!students || students.length === 0}
        >
          Export CSV
        </Button>
      </div>

      <div className="table-toolbar">
        <Space wrap size="middle" className="toolbar-actions">
          <Input
            placeholder="CIN"
            value={newStudent.cin}
            onChange={(e) => setNewStudent({ ...newStudent, cin: e.target.value })}
            className="add-input"
            allowClear
            style={{ width: 120 }}
          />
          <Input
            placeholder="Name"
            value={newStudent.name}
            onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
            className="add-input"
            allowClear
            style={{ width: 200 }}
          />
          <Input
            placeholder="Email"
            value={newStudent.email}
            onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
            className="add-input"
            allowClear
            style={{ width: 200 }}
          />
          <Select
            placeholder="Status"
            value={newStudent.account_status}
            onChange={(value) => setNewStudent({ ...newStudent, account_status: value })}
            style={{ width: 120 }}
            className="add-select"
          >
            <Option value="active">Active</Option>
            <Option value="inactive">Inactive</Option>
          </Select>
          <Select
            showSearch
            placeholder="Select Group"
            value={newStudent.group_id}
            onChange={(value) => setNewStudent({ ...newStudent, group_id: value })}
            style={{ width: 150 }}
            className="add-select"
            optionFilterProp="children"
            allowClear
          >
            {groups.map((g) => (
              <Option key={g.id} value={g.id}>
                {g.code_groupe}
              </Option>
            ))}
          </Select>
          <Button 
            type="primary" 
            onClick={handleAdd} 
            icon={<PlusOutlined />}
            className="add-btn"
          >
            Add Student
          </Button>
        </Space>
      </div>

      <Table
        dataSource={students}
        columns={columns}
        rowKey="id"
        className="students-table"
        loading={loading}
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

export default StudentsTable;