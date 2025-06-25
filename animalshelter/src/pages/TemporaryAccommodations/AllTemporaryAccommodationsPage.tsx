import React, { useEffect, useState } from 'react';
import { Card, Button, Select, Popconfirm, message } from 'antd';
import {
	getAllTemporaryAccommodations,
	deleteTemporaryAccommodation,
	updateTemporaryAccommodation,
} from '../../api/temporaryAccommodations';
import { getAllAnimals, updateAnimal } from '../../api/animals';
import { getAllUsers } from '../../api/users';
import config from '../../api/config';
import { useNavigate } from 'react-router-dom';

const AllTemporaryAccommodationsPage: React.FC = () => {
	const [accommodations, setAccommodations] = useState<any[]>([]);
	const [animals, setAnimals] = useState<any[]>([]);
	const [users, setUsers] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const employeeId = `${config.api.rolesId.employeeId}`;
	const adminId = `${config.api.rolesId.adminId}`;
	const userStr = localStorage.getItem('user');
	const currentUser = userStr ? JSON.parse(userStr) : null;
	const navigate = useNavigate();

	useEffect(() => {
		if (
			!currentUser ||
			(currentUser.roleId !== employeeId && currentUser.roleId !== adminId)
		) {
			navigate('/');
			return;
		}
		const fetchData = async () => {
			setLoading(true);
			const [accs, animalsData, usersData] = await Promise.all([
				getAllTemporaryAccommodations(),
				getAllAnimals(),
				getAllUsers(),
			]);
			setAccommodations(accs);
			setAnimals(animalsData);
			setUsers(usersData);
			setLoading(false);
		};
		fetchData();
	}, [navigate]);

	const getAnimalName = (animalId: string) =>
		animals.find(a => a.id === animalId)?.name || 'Неизвестно';
	const getUserName = (userId: string) => {
		const user = users.find(u => u.id === userId);
		if (!user) return 'Неизвестно';
		return `${user.surname} ${user.name}`;
	};

	const handleDelete = async (id: string) => {
		await deleteTemporaryAccommodation(id);
		setAccommodations(accommodations.filter(acc => acc.id !== id));
		message.success('Заявка на передержку удалена');
	};

	const fetchAnimals = async () => {
		const animalsData = await getAllAnimals();
		setAnimals(animalsData);
	};

	const handleStatusChange = async (acc: any, newStatus: string) => {
		await updateTemporaryAccommodation(acc.id, { ...acc, status: newStatus });
		const refreshedAccs = accommodations.map(a =>
			a.id === acc.id ? { ...a, status: newStatus } : a
		);
		setAccommodations(refreshedAccs);
		message.success('Статус передержки обновлён');
		const animalId = acc.animalId;
		const animalAccs = refreshedAccs.filter(a => a.animalId === animalId);
		const hasActive = animalAccs.some(
			a => (a.status || 'Активна') === 'Активна'
		);
		let newAnimalStatusId = '';
		if (hasActive) newAnimalStatusId = config.api.animalStatusesId.fosterCareId;
		else newAnimalStatusId = config.api.animalStatusesId.defaultAnimalStatusId;
		const animal = animals.find(a => a.id === animalId);
		if (animal) {
			await updateAnimal(animal.id, {
				...animal,
				animalStatusId: newAnimalStatusId,
			});
			await fetchAnimals();
		}
	};

	return (
		<div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
			<h1>Все передержки</h1>
			{accommodations.map(acc => (
				<Card key={acc.id} style={{ marginBottom: 16 }}>
					<b>Животное:</b> {getAnimalName(acc.animalId)}
					<br />
					<b>Пользователь:</b> {getUserName(acc.userId)}
					<br />
					<b>Дата начала:</b>{' '}
					{new Date(acc.dateAnimalCapture).toLocaleDateString()}
					<br />
					<b>Дата окончания:</b>{' '}
					{acc.dateAnimalReturn
						? new Date(acc.dateAnimalReturn).toLocaleDateString()
						: '—'}
					<br />
					<b>Статус:</b> {acc.status || 'Активна'}
					<div
						style={{
							marginTop: 12,
							display: 'flex',
							gap: 16,
							justifyContent: 'center',
						}}
					>
						<Select
							value={acc.status || 'Активна'}
							style={{ minWidth: 160 }}
							onChange={newStatus => handleStatusChange(acc, newStatus)}
						>
							<Select.Option value='Активна'>Активна</Select.Option>
							<Select.Option value='Завершена'>Завершена</Select.Option>
							<Select.Option value='Отклонена'>Отклонена</Select.Option>
						</Select>
						<Popconfirm
							title='Удалить заявку на передержку?'
							onConfirm={() => handleDelete(acc.id)}
							okText='Да'
							cancelText='Нет'
							placement='top'
							overlayClassName='popconfirm-center'
						>
							<Button danger style={{ minWidth: 120 }}>
								Удалить
							</Button>
						</Popconfirm>
					</div>
				</Card>
			))}
			{!accommodations.length && !loading && (
				<div>Заявок на передержку нет.</div>
			)}
		</div>
	);
};

export default AllTemporaryAccommodationsPage;