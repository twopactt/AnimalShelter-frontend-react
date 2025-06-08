import React, { useEffect, useState } from 'react';
import { Layout, Menu, Button, message } from 'antd';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { logout, getCurrentUser, isAuthenticated } from '../../api/authService';
import styles from './Layout.module.css';

const { Header: AntHeader } = Layout;

const Header: React.FC = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const [currentUser, setCurrentUser] = useState<any>(null);
	const [loading, setLoading] = useState(true);

	const fetchUser = async () => {
		try {
			const user = await getCurrentUser();
			console.log('Fetched user:', user);
			setCurrentUser(user);
		} catch (error) {
			console.error('Error fetching user:', error);
			setCurrentUser(null);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		const userStr = localStorage.getItem('user');
		if (userStr) {
			try {
				const user = JSON.parse(userStr);
				console.log('Setting user from localStorage:', user);
				setCurrentUser(user);
			} catch (error) {
				console.error('Error parsing user from localStorage:', error);
				setCurrentUser(null);
			}
		}
		setLoading(false);
	}, []);

	useEffect(() => {
		if (location.pathname === '/login' || location.pathname === '/register') {
			fetchUser();
		}
	}, [location.pathname]);

	const handleLogout = async () => {
		try {
			await logout();
			setCurrentUser(null);
			message.success('Выход выполнен успешно');
			navigate('/');
		} catch (error) {
			message.error('Ошибка при выходе');
		}
	};

	const menuItems = [
		{
			key: 'home',
			label: <Link to="/">Главная</Link>
		},
		{
			key: 'animals',
			label: <Link to="/animals">Животные</Link>
		}
	];

	return (
		<AntHeader className={styles.header}>
			<div className={styles.logo}>
				<Link to="/">Приют для животных</Link>
			</div>
			<Menu theme="dark" mode="horizontal" items={menuItems} className={styles.menu}/>
			<div className={styles['auth-buttons']}>
				{!loading && (
					currentUser ? (
						<>
							<span className={styles['user-info']}>
								<UserOutlined /> Профиль ({currentUser.login})
							</span>
							<Button type="primary" danger onClick={handleLogout} style={{ margin: '0' }}>
								<LogoutOutlined /> Выйти
							</Button>
						</>
					) : (
						<>
							<Button type="primary">
								<Link to="/login">Войти</Link>
							</Button>
							<Button>
								<Link to="/register">Регистрация</Link>
							</Button>
						</>
					)
				)}
			</div>
		</AntHeader>
	);
};

export default Header;