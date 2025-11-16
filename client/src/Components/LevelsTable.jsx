import { useState, useEffect } from "react";
import {
  Table,
  InputNumber,
  Button,
  Popconfirm,
  message,
  Space,
  Card,
  Dropdown,
} from "antd";
import {
  DeleteOutlined,
  PlusOutlined,
  BookOutlined,
  TeamOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { useAcademyStore } from "../store/academyStore";
import "../styles/dashboard.scss";
import { useParams, useNavigate } from "react-router-dom";

const LevelsTable = () => {
  const { levels = [], fetchLevels, createLevel, deleteLevel } = useAcademyStore();
  const { specid } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [newLevel, setNewLevel] = useState({
    num_level: null,
    speciality_id: specid ? Number(specid) : null,
  });

  // ─────────────────── FETCH LEVELS
  useEffect(() => {
    if (!specid) return;
    fetchLevels(specid);
  }, [specid, fetchLevels]);

  // ─────────────────── DELETE LEVEL
  const handleDelete = async (id) => {
    setLoading(true);
    const result = await deleteLevel(id);

    if (result.success) {
      message.success("Level deleted successfully");
      await fetchLevels(specid);
    } else {
      message.error(result.error || "Failed to delete level");
    }
    setLoading(false);
  };

  // ─────────────────── ADD LEVEL
  const handleAdd = async () => {
    const { num_level, speciality_id } = newLevel;

    if (!num_level || !speciality_id) {
      return message.warning("Please enter a valid level number");
    }

    setLoading(true);
    const result = await createLevel(speciality_id, { num_level });

    if (result.success) {
      message.success("Level added");
      setNewLevel({ num_level: null, speciality_id });
      await fetchLevels(specid);
    } else {
      message.error(result.error);
    }

    setLoading(false);
  };

  // ─────────────────── TABLE COLUMNS
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      width: 60,
      align: "center",
    },
    {
      title: "Level",
      dataIndex: "num_level",
      render: (v) => <b>Level {v}</b>,
    },
    {
      title: "Actions",
      align: "center",
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Popconfirm
            title="Delete this level?"
            onConfirm={() => handleDelete(record.id)}
            okType="danger"
          >
            <Button danger type="link" icon={<DeleteOutlined />} />
          </Popconfirm>

          <Dropdown
            trigger={["click"]}
            menu={{
              items: [
                {
                  key: "subjects",
                  label: "Manage Subjects",
                  icon: <BookOutlined />,
                },
                {
                  key: "groupes",
                  label: "Manage Groupes",
                  icon: <TeamOutlined />,
                },
              ],
              onClick: ({ key }) => {
                navigate(
                  key === "subjects"
                    ? `/dashboard/subjects/${record.id}`
                    : `/dashboard/groupes/${record.id}`
                );
              },
            }}
          >
            <Button
              type="text"
              size="small"
              icon={<MoreOutlined rotate={90} />}
            />
          </Dropdown>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="Levels Management"
      extra={<span>{levels.length} levels</span>}
      className="levels-card"
    >
      <div className="table-toolbar">
        <Space>
          <InputNumber
            placeholder="Level Number"
            min={1}
            max={10}
            value={newLevel.num_level}
            onChange={(v) =>
              setNewLevel((prev) => ({ ...prev, num_level: Number(v) }))
            }
          />

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
            loading={loading}
          >
            Add Level
          </Button>
        </Space>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={levels}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </Card>
  );
};

export default LevelsTable;