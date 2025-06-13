import React, { useEffect, useState } from 'react';
import { Table, Select, message, Card, Spin } from 'antd';
import { User } from '../../models/User';
import { getAllUsers, updateUser } from '../../api/users';
import { getAllRoles } from '../../api/roles';
import { getCurrentUser } from '../../api/authService';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const UserRolesPage: React.FC = () => {
	const [users, setUsers] = useState<User[]>([]);
	const [roles, setRoles] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [currentUser, setCurrentUser] = useState<any>(null);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchCurrentUser = async () => {
			const user = await getCurrentUser();
			setCurrentUser(user);

			if (!user || user.roleId !== 'admin') {
				message.error('Доступ запрещен');
				navigate('/');
			}
		};

		fetchCurrentUser();
	}, [navigate]);

	const fetchData = async () => {
		setLoading(true);
		try {
			const [usersData, rolesData] = await Promise.all([
				getAllUsers(),
				getAllRoles(),
			]);

			const filteredUsers = usersData.filter((user: User) => user.id !== currentUser?.id);

			setUsers(filteredUsers);
			setRoles(rolesData);
		} catch (error) {
			message.error('Ошибка при загрузке данных');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (currentUser) {
			fetchData();
		}
	}, [currentUser]);

	const handleRoleChange = async (userId: string, newRole: string) => {
		if (!newRole) {
			message.error('Выберите роль');
			return;
		}
		try {
			setLoading(true);
			const userToUpdate = users.find(user => user.id === userId);
			if (!userToUpdate) return;

			const updatedUser = {
				...userToUpdate,
				roleId: newRole,
			};

			await updateUser(userId, updatedUser);

			setUsers(
				users.map(user =>
					user.id === userId ? { ...user, roleId: newRole } : user
				)
			);

			message.success('Роль пользователя успешно изменена');
		} catch (error) {
			message.error('Ошибка при изменении роли');
			console.error('Error updating role:', error);
		} finally {
			setLoading(false);
		}
	};

	const columns = [
		{
			title: 'ФИО',
			dataIndex: 'name',
			key: 'name',
			render: (_: any, record: User) =>
				`${record.surname} ${record.name} ${record.patronymic || ''}`.trim(),
		},
		{
			title: 'Логин',
			dataIndex: 'login',
			key: 'login',
		},
		{
			title: 'Email',
			dataIndex: 'email',
			key: 'email',
		},
		{
			title: 'Роль',
			dataIndex: 'roleId',
			key: 'role',
			render: (roleId: string, user: User) => (
				<Select
					style={{ width: 150 }}
					defaultValue={roleId}
					onChange={(value) => handleRoleChange(user.id, value)}
					disabled={loading}
				>
					{roles.map(role => (
						<Select.Option key={role.id} value={role.id}>
							{role.name}
						</Select.Option>
					))}
				</Select>
			),
		},
	];

	if (loading && !users.length) {
		return (
			<Spin
				size='large'
				style={{ display: 'flex', justifyContent: 'center', marginTop: '20%' }}
			/>
		);
	}

	return (
		<Card title='Управление ролями пользователей' style={{ margin: '20px' }}>
			<Table
				columns={columns}
				dataSource={users}
				rowKey='id'
				loading={loading}
				pagination={{ pageSize: 10 }}
			/>
		</Card>
	);
};

export default UserRolesPage;