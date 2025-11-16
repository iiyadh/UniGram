import { useState, useEffect } from "react"
import { Table, Input, Button, Popconfirm, message, Space, Card } from "antd"
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { useAcademyStore } from '../store/academyStore'
import '../styles/dashboard.scss';
import { useParams } from 'react-router-dom';


const GroupesTable = () => {
  const { 
    groups,
    fetchGroups, 
    createGroup, 
    updateGroup, 
    deleteGroup 
  } = useAcademyStore();

  const [loading, setLoading] = useState(false);
  const { levelid } = useParams();

  const [editId, setEditId] = useState(null);
  const [editRow, setEditRow] = useState({});
  const [newGroup, setNewGroup] = useState({ code_groupe: "", level_id: "" });

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    await fetchGroups(levelid);
    setLoading(false);
  };

  const handleEdit = (row) => {
    setEditId(row.id)
    setEditRow({ ...row })
  };

  const handleSave = async () => {
    if (!editRow.code_groupe?.trim()) {
      message.warning("All fields are required")
      return
    }
    setLoading(true)
    const result = await updateGroup(editId, {
      id : editId,
      code_groupe: editRow.code_groupe.trim(),
    });
    if (result.success) {
      setEditId(null)
      setEditRow({})
      message.success("Group updated successfully")
    } else {
      message.error(result.error)
    }
    setLoading(false)
  };

  const handleCancel = () => {
    setEditId(null)
    setEditRow({})
  };

  const handleDelete = async (id) => {
    setLoading(true)
    const result = await deleteGroup(id)
    if (result.success) {
      message.success("Group deleted successfully")
    } else {
      message.error(result.error)
    }
    setLoading(false)
  };

  const handleAdd = async () => {
    const code = newGroup.code_groupe.trim()
    const levelId = levelid

    if (!code || !levelId) {
      message.warning("Please fill all fields")
      return
    }

    setLoading(true)
    const result = await createGroup({
      code_groupe: code,
      level_id : levelId
    });

    if (result.success) {
      setNewGroup({ code_groupe: "", level_id: levelid })
      message.success("Group added successfully")
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
        <span className="total-count">{(groups || []).length} groups</span>
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
        dataSource={groups}
        columns={columns}
        rowKey="id"
        className="groups-table"
        loading={loading}
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