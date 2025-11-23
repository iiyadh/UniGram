import { useState, useEffect } from "react";
import {
  Table,
  Input,
  Button,
  Popconfirm,
  message,
  Space,
  Card,
  Select,
  InputNumber,
  Tag,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ScheduleOutlined,
} from "@ant-design/icons";
import { useAcademyStore } from "../store/academyStore";
import "../styles/dashboard.scss";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

const ClassroomsTable = () => {
  const {
    classrooms,
    departments,
    fetchClassrooms,
    fetchDepartments,
    createClassroom,
    updateClassroom,
    deleteClassroom,
  } = useAcademyStore();

  const { depid } = useParams();
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editRow, setEditRow] = useState({});

  const [newClassroom, setNewClassroom] = useState({
    code_classroom: "",
    capacity: "",
    type_classroom: "",
    id_departement: depid ? parseInt(depid) : "",
  });

  /** CLASSROOM TYPE MAPPER **/
  const typeMap = {
    amphi: "Lecture Hall",
    special: "Specialized Room",
    general: "General Classroom",
  };

  const reverseMap = Object.fromEntries(
    Object.entries(typeMap).map(([k, v]) => [v, k])
  );

  const classroomTypes = Object.values(typeMap);

  /** INITIAL LOAD **/
  useEffect(() => {
    (async () => {
      setLoading(true);
      await Promise.all([fetchClassrooms(depid), fetchDepartments()]);
      setLoading(false);
    })();
  }, []);

  /** ACTIONS **/

  const handleEdit = (row) => {
    setEditId(row.id);
    setEditRow({
      ...row,
      type_classroom: typeMap[row.type_classroom] ?? row.type_classroom,
    });
  };

  const handleSave = async () => {
    if (
      !editRow.code_classroom?.trim() ||
      !editRow.capacity ||
      !editRow.type_classroom ||
      !editRow.id_departement
    ) {
      message.warning("All fields are required");
      return;
    }

    setLoading(true);
    const result = await updateClassroom(editId, {
      code_classroom: editRow.code_classroom.trim(),
      capacity: Number(editRow.capacity),
      type_classroom: reverseMap[editRow.type_classroom],
      id_departement: Number(editRow.id_departement),
    });

    if (result.success) {
      message.success("Classroom updated successfully");
      setEditId(null);
      setEditRow({});
    } else message.error(result.error || "Update failed");

    setLoading(false);
  };

  const handleCancel = () => {
    setEditId(null);
    setEditRow({});
  };

  const handleDelete = async (id) => {
    setLoading(true);
    const result = await deleteClassroom(id);
    result.success
      ? message.success("Classroom deleted")
      : message.error(result.error);
    setLoading(false);
  };

  const handleAdd = async () => {
    const { code_classroom, capacity, type_classroom, id_departement } =
      newClassroom;

    if (!code_classroom || !capacity || !type_classroom || !id_departement) {
      message.warning("All fields required");
      return;
    }

    setLoading(true);
    const result = await createClassroom({
      code_classroom: code_classroom.trim(),
      capacity: Number(capacity),
      type_classroom,
      id_departement: Number(id_departement),
    });

    if (result.success) {
      message.success("Classroom added");
      setNewClassroom({
        code_classroom: "",
        capacity: "",
        type_classroom: "",
        id_departement: depid ? parseInt(depid) : "",
      });
    } else message.error(result.error);

    setLoading(false);
  };

  const getDepartmentName = (id) =>
    departments.find((d) => d.id === id)?.name ?? id;

  /** TABLE COLUMNS **/

  const columns = [
    { title: "ID", dataIndex: "id", width: 70 },

    {
      title: "Code",
      dataIndex: "code_classroom",
      render: (_, r) =>
        editId === r.id ? (
          <Input
            value={editRow.code_classroom}
            onChange={(e) =>
              setEditRow({ ...editRow, code_classroom: e.target.value })
            }
            size="small"
          />
        ) : (
          r.code_classroom
        ),
    },

    {
      title: "Capacity",
      dataIndex: "capacity",
      align: "center",
      render: (_, r) =>
        editId === r.id ? (
          <InputNumber
            min={1}
            max={500}
            value={editRow.capacity}
            onChange={(v) => setEditRow({ ...editRow, capacity: v })}
            size="small"
          />
        ) : (
          `${r.capacity} seats`
        ),
    },

    {
      title: "Type",
      dataIndex: "type_classroom",
      render: (_, r) =>
        editId === r.id ? (
          <Select
            value={editRow.type_classroom}
            onChange={(v) => setEditRow({ ...editRow, type_classroom: v })}
            size="small"
          >
            {classroomTypes.map((t) => (
              <Select.Option key={t} value={t}>
                {t}
              </Select.Option>
            ))}
          </Select>
        ) : (
        <Tag
          color={
            r.type_classroom === "amphi"
              ? "blue"
              : r.type_classroom === "special"
              ? "green"
              : r.type_classroom === "general"
              ? "orange"
              : "default"
          }
        >
          {typeMap[r.type_classroom] ?? r.type_classroom}
        </Tag>
        ),
    },

    {
      title: "Department",
      dataIndex: "id_departement",
      render: (_, r) =>
        editId === r.id ? (
          <Select
            value={editRow.id_departement}
            onChange={(v) =>
              setEditRow({ ...editRow, id_departement: v })
            }
            size="small"
          >
            {departments.map((d) => (
              <Select.Option key={d.id} value={d.id}>
                {d.name}
              </Select.Option>
            ))}
          </Select>
        ) : (
          getDepartmentName(r.id_departement)
        ),
    },

    {
      title: "Actions",
      width: 120,
      render: (_, r) =>
        editId === r.id ? (
          <Space>
            <Button size="small" type="primary" onClick={handleSave}>
              Save
            </Button>
            <Button size="small" onClick={handleCancel}>
              Cancel
            </Button>
          </Space>
        ) : (
          <Space>
            <Button
              size="small"
              type="link"
              icon={<EditOutlined />}
              onClick={() => handleEdit(r)}
            />
            <Popconfirm
              title="Delete?"
              onConfirm={() => handleDelete(r.id)}
            >
              <Button
                size="small"
                type="link"
                danger
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
            <Link to={`/dashboard/scheduleclassroom/${r.id}`}>
            <Button
              size="small"
              type="link"
              icon={<ScheduleOutlined />}
            ></Button>
            </Link>
          </Space>
        ),
    },
  ];

  return (
    <Card
      title="Classrooms Management"
      extra={<b>{classrooms.length} classrooms</b>}
    >
      <Space style={{ marginBottom: 12 }}>
        <Input
          placeholder="Classroom Code"
          style={{ width: 140 }}
          value={newClassroom.code_classroom}
          onChange={(e) =>
            setNewClassroom({ ...newClassroom, code_classroom: e.target.value })
          }
        />

        <InputNumber
          placeholder="Capacity"
          min={1}
          max={500}
          style={{ width: 100 }}
          value={newClassroom.capacity}
          onChange={(v) =>
            setNewClassroom({ ...newClassroom, capacity: v })
          }
        />

        <Select
          placeholder="Type"
          style={{ width: 160 }}
          value={newClassroom.type_classroom}
          onChange={(v) =>
            setNewClassroom({ ...newClassroom, type_classroom: reverseMap[v] })
          }
        >
          {classroomTypes.map((type) => (
            <Select.Option key={type} value={type}>
              {type}
            </Select.Option>
          ))}
        </Select>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          Add
        </Button>
      </Space>

      <Table
        rowKey="id"
        dataSource={classrooms}
        columns={columns}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </Card>
  );
};

export default ClassroomsTable;
