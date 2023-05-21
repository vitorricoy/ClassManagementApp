import React from "react";
import "./NavigationMenu.css";
import { Button, Menu } from "antd";
import {
  CalendarOutlined,
  CheckSquareOutlined,
  PercentageOutlined,
  RiseOutlined,
  SendOutlined,
  TableOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

export const NavigationMenu = () => {
  const navigate = useNavigate();

  const getCurrentItem = () => {
    const pathname = window.location.pathname;
    const item = pathname.slice(11);
    if (item === "") {
      return "deliveries";
    }
    return item;
  };

  return (
    <Menu selectedKeys={[getCurrentItem()]} mode="horizontal" className="menu">
      <Menu.Item
        key="deliveries"
        icon={<SendOutlined />}
        onClick={() => navigate("/dashboard/deliveries")}
      >
        Entregas
      </Menu.Item>
      <Menu.Item
        key="grades"
        icon={<CheckSquareOutlined />}
        onClick={() => navigate("/dashboard/grades")}
      >
        Notas
      </Menu.Item>
      <Menu.Item
        key="modules"
        icon={<TableOutlined />}
        onClick={() => navigate("/dashboard/modules")}
      >
        Módulos
      </Menu.Item>
      <Menu.Item
        key="progress"
        icon={<RiseOutlined />}
        onClick={() => navigate("/dashboard/progress")}
      >
        Progresso no curso
      </Menu.Item>
      <Menu.Item
        key="frequency"
        icon={<CalendarOutlined />}
        onClick={() => navigate("/dashboard/frequency")}
      >
        Frequência no curso
      </Menu.Item>
      <Menu.Item
        key="approval"
        icon={<PercentageOutlined />}
        onClick={() => navigate("/dashboard/approval")}
      >
        Estimativa de aprovação
      </Menu.Item>
      <Menu.Item className="logout" key="logout">
        <Button type="link" size="small" onClick={() => navigate("/")}>
          Sair
        </Button>
      </Menu.Item>
    </Menu>
  );
};
