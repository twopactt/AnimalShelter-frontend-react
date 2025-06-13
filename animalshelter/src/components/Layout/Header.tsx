import React, { useEffect, useState } from 'react';
import { Layout, Menu, Button, message } from 'antd';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { logout, getCurrentUser, isAuthenticated } from '../../api/authService';
import styles from './Layout.module.css';
import config from '../../api/config';

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

	let menuItems = [
		{
			key: 'home',
			label: <Link to="/">Главная</Link>
		},
		{
			key: 'animals',
			label: <Link to="/animals">Животные</Link>
		}
	];

	const volunteerId = `${config.api.rolesId.volunteerId}`;
	const employeeId = `${config.api.rolesId.employeeId}`;
	const adminId = `${config.api.rolesId.adminId}`;

	if (!employeeId || !adminId) {
		console.warn('employeeId или adminId не определены в config.api.rolesId!');
	}

	console.log('currentUser:', currentUser);
	console.log('employeeId:', employeeId, 'adminId:', adminId);

	if (currentUser) {
		menuItems.push({
			key: 'my-adoption-applications',
			label: <Link to="/my-adoption-applications">Мои заявки на усыновление</Link>
		});
		if ([volunteerId, employeeId, adminId].includes(currentUser.roleId)) {
			menuItems.push({
				key: 'my-temporary-accommodations',
				label: <Link to="/my-temporary-accommodations">Мои заявки на передержку</Link>
			});
		}
		if (currentUser.roleId === employeeId || currentUser.roleId === adminId) {
			menuItems.push({
				key: 'adoption-applications',
				label: <Link to="/adoption-applications">Все заявки на усыновление</Link>
			});
			menuItems.push({
				key: 'all-temporary-accommodations',
				label: <Link to="/all-temporary-accommodations">Все заявки на передержку</Link>
			});
		}
		if (currentUser.roleId === adminId) {
			menuItems.push({
				key: 'user-roles',
				label: <Link to="/user-roles">Управление ролями</Link>
			});
		}
	}

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