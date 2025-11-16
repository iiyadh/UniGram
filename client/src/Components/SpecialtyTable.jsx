import { useState, useEffect } from "react";
import { Table, Input, Button, Popconfirm, message, Space, Card, Select,Dropdown } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined ,UnorderedListOutlined ,MoreOutlined } from '@ant-design/icons';
import { useAcademyStore } from '../store/academyStore';
import { useParams } from "react-router-dom";
import '../styles/dashboard.scss';
import { useNavigate } from "react-router-dom";

const SpecialtyTable = () => {
  const { 
    specialties,
    fetchSpecialties, 
    createSpecialty, 
    updateSpecialty, 
    deleteSpecialty 
  } = useAcademyStore()
  const [loading, setLoading] = useState(false)
  const { depid } = useParams();
  const navigate = useNavigate();

  const [editId, setEditId] = useState(null)
  const [editRow, setEditRow] = useState({})
  const [newSpecialty, setNewSpecialty] = useState({ code_speciality: "", name_speciality: "" , departement_id: depid ? parseInt(depid) : "" })

  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    setLoading(true)
    await fetchSpecialties(depid),
    setLoading(false)
  }

  const handleEdit = (row) => {
    setEditId(row.id)
    setEditRow({ ...row })
  }

  const handleSave = async () => {
    if (!editRow.code_speciality?.trim() || !editRow.name_speciality?.trim()) {
      message.warning("All fields are required")
      return
    }
    setLoading(true)
    const result = await updateSpecialty(editId, {
      code_speciality: editRow.code_speciality.trim(),
      name_speciality: editRow.name_speciality.trim(),
    });
    console.log(result);
    if (result.success) {
      setEditId(null)
      setEditRow({})
      message.success("Specialty updated successfully")
    } else {
      message.error(result.error)
    }
    setLoading(false)
  }

  const handleCancel = () => {
    setEditId(null)
    setEditRow({})
  }

  const handleDelete = async (id) => {
    setLoading(true)
    const result = await deleteSpecialty(id)
    if (result.success) {
      message.success("Specialty deleted successfully")
    } else {
      message.error(result.error)
    }
    setLoading(false)
  }

  const handleAdd = async () => {
    const code = newSpecialty.code_speciality.trim()
    const name = newSpecialty.name_speciality.trim()
    const deptId = newSpecialty.departement_id

    if (!code || !name || !deptId) {
      message.warning("Please fill all fields")
      return
    }

    setLoading(true)
    const result = await createSpecialty(deptId, {
      code_speciality: code,
      name_speciality: name
    })
    if (result.success) {
      setNewSpecialty({ code_speciality: "", name_speciality: "", departement_id: "" })
      message.success("Specialty added successfully")
    } else {
      message.error(result.error)
    }
    setLoading(false)
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
            <Dropdown
              trigger={["click"]}
              placement="bottomRight"
              menu={{
                items: [
                  { 
                    key: "manage-levels", 
                    label: "Manage Levels",
                    icon: <UnorderedListOutlined />
                  },
                ],
                onClick: ({ key }) => {
                    navigate(`/dashboard/levels/${record.id}`);
                },
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
      title="Specialties Management" 
      className="specialty-card"
      extra={
        <span className="total-count">{specialties.length} specialties</span>
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
        dataSource={specialties}
        columns={columns}
        rowKey="id"
        className="specialty-table"
        loading={loading}
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