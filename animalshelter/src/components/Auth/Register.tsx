import React, { useState } from 'react';
import { Form, Input, Button, DatePicker, message } from 'antd';
import { UserOutlined, LockOutlined, PhoneOutlined, MailOutlined, CalendarOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { register, RegisterRequest } from '../../api/authService';
import './Auth.css';

const Register: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const handleSubmit = async (values: any) => {
        try {
            setLoading(true);
            console.log('Form values:', values);
            console.log('Date of birth:', values.dateOfBirth);
            
            const registerData: RegisterRequest = {
                surname: values.surname.trim(),
                name: values.name.trim(),
                patronymic: values.patronymic ? values.patronymic.trim() : '',
                dateOfBirth: values.dateOfBirth ? values.dateOfBirth.format('YYYY-MM-DD') : '',
                phone: values.phone.trim(),
                email: values.email.trim(),
                login: values.login.trim(),
                password: values.password.trim(),
                confirmPassword: values.confirmPassword.trim(),
                roleId: 'a84c6cc3-27c0-4d1c-a956-6d51ac514e68'
            };
            
            console.log('Sending registration data:', JSON.stringify(registerData, null, 2));
            await register(registerData);
            message.success('Регистрация выполнена успешно');
            window.location.href = '/';
        } catch (error: any) {
            console.error('Registration error:', error);
            message.error(error.message || 'Ошибка при регистрации');
            if (error.message?.toLowerCase().includes('логин')) {
                form.setFields([
                    {
                        name: 'login',
                        errors: [error.message]
                    }
                ]);
            }
            if (error.message?.toLowerCase().includes('email')) {
                form.setFields([
                    {
                        name: 'email',
                        errors: [error.message]
                    }
                ]);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='auth-container'>
            <Form
                form={form}
                name='register'
                onFinish={handleSubmit}
                className='auth-form'
                initialValues={{
                    surname: '',
                    name: '',
                    patronymic: '',
                    dateOfBirth: null,
                    phone: '',
                    email: '',
                    login: '',
                    password: '',
                    confirmPassword: '',
                }}
            >
                <h2>Регистрация</h2>

                <Form.Item
                    name='surname'
                    rules={[{ required: true, message: 'Пожалуйста, введите фамилию' }]}
                >
                    <Input
                        placeholder='Фамилия'
                        disabled={loading}
                    />
                </Form.Item>

                <Form.Item
                    name='name'
                    rules={[{ required: true, message: 'Пожалуйста, введите имя' }]}
                >
                    <Input placeholder='Имя' disabled={loading} />
                </Form.Item>

                <Form.Item name='patronymic'>
                    <Input placeholder='Отчество' disabled={loading} />
                </Form.Item>

                <Form.Item
                    name='dateOfBirth'
                    rules={[
                        { required: true, message: 'Пожалуйста, выберите дату рождения' },
                    ]}
                >
                    <DatePicker
                        format='DD.MM.YYYY'
                        placeholder='Дата рождения'
                        disabled={loading}
                        style={{ width: '100%' }}
                        prefix={<CalendarOutlined />}
                    />
                </Form.Item>

                <Form.Item
                    name='phone'
                    rules={[
                        { required: true, message: 'Пожалуйста, введите номер телефона' },
                        {
                            pattern: /^(7|8)\d{10}$/,
                            message: 'Введите номер в формате +7XXXXXXXXXX или 8XXXXXXXXXX',
                        },
                    ]}
                >
                    <Input
                        placeholder='Телефон'
                        maxLength={12}
                        disabled={loading}
                        prefix={<PhoneOutlined />}
                    />
                </Form.Item>

                <Form.Item
                    name='email'
                    rules={[
                        { required: true, message: 'Пожалуйста, введите email' },
                        { type: 'email', message: 'Введите корректный email' },
                    ]}
                >
                    <Input
                        placeholder='Email'
                        disabled={loading}
                        prefix={<MailOutlined />}
                    />
                </Form.Item>

                <Form.Item
                    name='login'
                    rules={[
                        { required: true, message: 'Пожалуйста, введите логин' },
                        { min: 3, message: 'Логин должен быть не менее 3 символов' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') !== value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Логин и пароль не должны совпадать'));
                            },
                        }),
                    ]}
                >
                    <Input
                        prefix={<UserOutlined />}
                        placeholder='Логин'
                        disabled={loading}
                    />
                </Form.Item>

                <Form.Item
                    name='password'
                    rules={[
                        { required: true, message: 'Пожалуйста, введите пароль' },
                        { min: 8, message: 'Пароль должен быть не менее 8 символов' },
                        {
                            pattern:
                                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/,
                            message:
                                'Пароль: минимум 8 символов, строчная, заглавная, цифра, спецсимвол',
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('login') !== value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Логин и пароль не должны совпадать'));
                            },
                        }),
                    ]}
                >
                    <Input.Password
                        placeholder='Пароль'
                        disabled={loading}
                        prefix={<LockOutlined />}
                    />
                </Form.Item>

                <Form.Item
                    name='confirmPassword'
                    dependencies={['password']}
                    rules={[
                        { required: true, message: 'Пожалуйста, подтвердите пароль' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Пароли не совпадают'));
                            },
                        }),
                    ]}
                >
                    <Input.Password
                        placeholder='Подтвердите пароль'
                        disabled={loading}
                        prefix={<LockOutlined />}
                    />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} block>
                        {loading ? 'Регистрация...' : 'Зарегистрироваться'}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default Register; 