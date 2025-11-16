import { useState, useEffect } from "react";
import { 
  Table, Input, Button, Popconfirm, message, Space, Card, Dropdown  ,Select 
} from "antd";
import { 
  DeleteOutlined, EditOutlined, PlusOutlined, MoreOutlined ,ApartmentOutlined, BookOutlined
} from "@ant-design/icons";
import { useAcademyStore } from "../store/academyStore";
import "../styles/dashboard.scss";
import api from "../api/interceptor";
import { useNavigate } from "react-router-dom";

const DepartementTable = () => {
  const {
    departments,
    fetchDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
  } = useAcademyStore();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [editId, setEditId] = useState(null);
  const [editRow, setEditRow] = useState({});
  const [newDept, setNewDept] = useState({ name: "" });
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    loadDepartments();
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const res = await api.get('ref/api/ref/coreacademy/departments/teachers');
      console.log(res.data.data);
      setTeachers(res.data.data);
    } catch (err) {
      console.error("Error fetching teachers:", err);
    }
  };

  const loadDepartments = async () => {
    setLoading(true);
    const result = await fetchDepartments();
    if (!result.success) message.error(result.error);
    setLoading(false);
  };

  const handleEdit = (row) => {
    setEditId(row.id);
    setEditRow({ ...row });
  };

  const handleSave = async () => {
    if (!editRow.name?.trim()) {
      message.warning("Name must be selected");
      return;
    }

    setLoading(true);
    const result = await updateDepartment(editId, {
      name: editRow.name.trim(),
      chef_id: editRow.chef_id,
    });

    if (result.success) {
      setEditId(null);
      setEditRow({});
      message.success("Department updated successfully");
      loadDepartments();
    } else {
      message.error(result.error);
    }

    setLoading(false);
  };

  const handleCancel = () => {
    setEditId(null);
    setEditRow({});
  };

  const handleDelete = async (id) => {
    setLoading(true);
    const result = await deleteDepartment(id);
    if (result.success) {
      message.success("Department deleted successfully");
    } else {
      message.error(result.error);
    }
    setLoading(false);
  };

  const handleAdd = async () => {
    const name = newDept.name.trim();

    if (!name) {
      message.warning("Please fill out both Name and Chef ID");
      return;
    }

    setLoading(true);
    const result = await createDepartment({ name});
    if (result.success) {
      setNewDept({ name: ""});
      message.success("Department added successfully");
    } else {
      message.error(result.error);
    }
    setLoading(false);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
      align: "center",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (_, record) =>
        editId === record.id ? (
          <Input
            value={editRow.name}
            onChange={(e) =>
              setEditRow({ ...editRow, name: e.target.value })
            }
            size="small"
            placeholder="Department name"
          />
        ) : (
          <span className="department-name">{record.name}</span>
        ),
    },
    {
      title: "Chef",
      dataIndex: "chef_id",
      key: "chef_id",
      width: 180,
      render: (_, record) =>
        editId === record.id ? (
          <Select
            value={editRow.chef_id}
            onChange={(value) => setEditRow({ ...editRow, chef_id: value })}
            placeholder="Select a teacher"
            style={{ width: "100%" }}
            allowClear
            options={[
              { label: "None", value: null },
              ...teachers.map((teacher) => ({
                label: teacher.name,
                value: teacher.id,
              }))
            ]}
          />
        ) : (
          <span className="chef-id">
            {teachers.find((t) => t.id === record.uid)?.name || (
              <p className="none-tag">None</p>
            )}
          </span>
        ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      align: "center",
      render: (_, record) =>
        editId === record.id ? (
          <Space size="small">
            <Button type="primary" onClick={handleSave} size="small">
              Save
            </Button>
            <Button onClick={handleCancel} size="small">
              Cancel
            </Button>
          </Space>
        ) : (
          <Space size="small">
            <Button
              type="link"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />

            <Popconfirm
              title="Delete this department?"
              onConfirm={() => handleDelete(record.id)}
              okText="Yes"
              cancelText="No"
              okType="danger"
            >
              <Button
                type="link"
                danger
                size="small"
                icon={<DeleteOutlined />}
              />
            </Popconfirm>

            <Dropdown
              trigger={["click"]}
              placement="bottomRight"
              menu={{
                items: [
                  { 
                    key: "manage-classroom", 
                    label: "Manage classroom",
                    icon: <ApartmentOutlined />
                  },
                  { 
                    key: "manage-specialites", 
                    label: "Manage specialites",
                    icon : <BookOutlined />
                   },
                ],
                onClick: ({ key }) => {
                  if (key === "manage-classroom") {
                    navigate(`/dashboard/classrooms/${record.id}`);
                  }else{
                    navigate(`/dashboard/specialties/${record.id}`);
                  }
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
  ];

  return (
    <Card
      title="Departments Management"
      className="department-card"
      extra={<span>{departments.length} departments</span>}
    >
      <div className="table-toolbar">
        <Space wrap size="middle">
          <Input
            placeholder="Department Name"
            value={newDept.name}
            onChange={(e) =>
              setNewDept({ ...newDept, name: e.target.value })
            }
            style={{ width: 200 }}
            allowClear
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
            disabled={!!editId}
          >
            Add Department
          </Button>
        </Space>
      </div>

      <Table
        dataSource={departments}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
        size="middle"
        scroll={{ x: 600 }}
      />
    </Card>
  );
};

export default DepartementTable;
