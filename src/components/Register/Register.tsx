import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import React from "react";
import "./Register.css";
import { createUser } from "../../api/user";
import { useNavigate } from "react-router-dom";

type FormFields = {
  email: string;
  name: string;
  password: string;
};

export const Register = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = React.useState(false);

  const handleSubmit = (values: FormFields) => {
    setLoading(true);
    createUser(values.email, values.name, values.password).then((token) => {
      if (token) {
        setLoading(false);
        localStorage.setItem("userToken", token);
        navigate("/class/choose");
      }
    });
  };

  return (
    <div>
      <h2>Cadastrar na plataforma</h2>
      <div style={{ marginBottom: "24px" }}>
        Já possui conta? <a href="/login">Faça login.</a>
      </div>
      <Form onFinish={handleSubmit} className="register-form">
        <Form.Item required name="email">
          <Input
            prefix={<MailOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
            placeholder="E-mail"
          />
        </Form.Item>
        <Form.Item required name="name">
          <Input
            prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
            placeholder="Nome"
          />
        </Form.Item>
        <Form.Item required name="password">
          <Input
            prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
            type="password"
            placeholder="Senha"
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="register-form-button"
            loading={loading}
          >
            Entrar
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
