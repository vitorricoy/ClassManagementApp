import Icon from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import React from 'react';
import './Login.css';

export const Login = () => {
    const handleSubmit = () => {
        return;
    };

    return (
        <div>
            <h2>Entrar na plataforma</h2>
            <div style={{ marginBottom: '24px' }}>
                É novo na plataforma? <a href="">Cadastra-se agora.</a>
            </div>
            <Form onFinish={handleSubmit} className="login-form">
                <Form.Item
                    required
                >
                    <Input
                        prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        placeholder="E-mail"
                    />
                </Form.Item>
                <Form.Item
                    required
                >
                    <Input
                        prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        type="password"
                        placeholder="Senha"
                    />
                </Form.Item>
                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        className="login-form-button"
                    >
                        Entrar
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};