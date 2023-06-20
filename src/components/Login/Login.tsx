import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import React from "react";
import "./Login.css";
import { login } from "../../api/user";
import { useNavigate } from "react-router-dom";

type FormFields = {
  email: string;
  password: string;
};

export const Login = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = React.useState(false);

  const handleSubmit = (values: FormFields) => {
    setLoading(true);
    login(values.email, values.password).then((token) => {
      if (token) {
        setLoading(false);
        localStorage.setItem("userToken", token);
        navigate("/class/choose");
      }
    });
  };

  return (
    <div>
      <h2>Entrar na plataforma</h2>
      <div style={{ marginBottom: "24px" }}>
        É novo na plataforma? <a href="/register">Cadastre-se agora.</a>
      </div>
      <Form onFinish={handleSubmit} className="login-form">
        <Form.Item required name="email">
          <Input
            prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
            placeholder="E-mail"
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
            className="login-form-button"
            loading={loading}
          >
            Entrar
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
