import React from "react";
import "./NavigationMenu.css";
import { Menu, MenuProps } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

export const NavigationMenu = () => {
  const navigate = useNavigate();

  const getCurrentItem = () => {
    const pathname = window.location.pathname;
    const item = pathname.slice(11);
    if (item === "") {
      return "item1";
    }
    return item;
  };

  const [current, setCurrent] = React.useState<string>(getCurrentItem());

  const items: MenuProps["items"] = [
    {
      label: "Entregas",
      key: "deliveries",
      icon: <MailOutlined />,
      onClick: () => navigate("/dashboard/deliveries"),
    },
    {
      label: "Notas",
      key: "grades",
      icon: <MailOutlined />,
      onClick: () => navigate("/dashboard/grades"),
    },
    {
      label: "Módulos",
      key: "modules",
      icon: <MailOutlined />,
      onClick: () => navigate("/dashboard/modules"),
    },
    {
      label: "Progresso no curso",
      key: "progress",
      icon: <MailOutlined />,
      onClick: () => navigate("/dashboard/progress"),
    },
    {
      label: "Frequência no curso",
      key: "frequency",
      icon: <MailOutlined />,
      onClick: () => navigate("/dashboard/frequency"),
    },
    {
      label: "Estimativa de aprovação",
      key: "approval",
      icon: <MailOutlined />,
      onClick: () => navigate("/dashboard/approval"),
    },
  ];

  const onClick: MenuProps["onClick"] = (e) => {
    console.log("click ", e);
    setCurrent(e.key);
  };

  return (
    <Menu
      onClick={onClick}
      selectedKeys={[current]}
      mode="horizontal"
      items={items}
    />
  );
};
