import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api/authService';
import './Auth.css';

const Login: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const handleSubmit = async (values: { login: string; password: string }) => {
        try {
            setLoading(true);
            await login(values);
            message.success('Вход выполнен успешно');
            window.location.href = '/';
        } catch (error: any) {
            console.error('Login error in component:', error);
            message.error(error.message || 'Ошибка при входе');
            form.setFields([
                {
                    name: 'password',
                    errors: [error.message || 'Ошибка при входе']
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <Form
                form={form}
                name="login"
                onFinish={handleSubmit}
                className="auth-form"
            >
                <h2>Вход в систему</h2>
                <Form.Item
                    name="login"
                    rules={[
                        { required: true, message: 'Пожалуйста, введите логин' },
                        { min: 3, message: 'Логин должен быть не менее 3 символов' }
                    ]}
                >
                    <Input
                        prefix={<UserOutlined />}
                        placeholder="Логин"
                        disabled={loading}
                    />
                </Form.Item>

                <Form.Item
                    name="password"
                    rules={[{ required: true, message: 'Пожалуйста, введите пароль' }]}
                >
                    <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="Пароль"
                        disabled={loading}
                    />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} block>
                        {loading ? 'Вход...' : 'Войти'}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default Login; 