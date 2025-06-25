import React, { useEffect, useState } from 'react';
import { Card, Button, Tag, Popconfirm, Select, message } from 'antd';
import {
	getAllAdoptionApplications,
	deleteAdoptionApplication,
	updateAdoptionApplication,
} from '../../api/adoptionApplications';
import { getAllStatusAdoptions } from '../../api/statusAdoptions';
import { getAllAnimals, updateAnimal } from '../../api/animals';
import { getAllUsers } from '../../api/users';
import config from '../../api/config';
import { useNavigate } from 'react-router-dom';

const AllAdoptionApplicationsPage: React.FC = () => {
	const [applications, setApplications] = useState<any[]>([]);
	const [animals, setAnimals] = useState<any[]>([]);
	const [statuses, setStatuses] = useState<any[]>([]);
	const [users, setUsers] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const employeeId = `${config.api.rolesId.employeeId}`;
	const adminId = `${config.api.rolesId.adminId}`;
	const userStr = localStorage.getItem('user');
	const currentUser = userStr ? JSON.parse(userStr) : null;
	const navigate = useNavigate();
	const animalStatusesId = config.api.animalStatusesId;
	const statusIdApproved = config.api.statusAdoptionsId.approvedId;
	const statusIdPending = config.api.statusAdoptionsId.defaultStatusAdoptionId;

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
			const [apps, animalsData, statusesData, usersData] = await Promise.all([
				getAllAdoptionApplications(),
				getAllAnimals(),
				getAllStatusAdoptions(),
				getAllUsers(),
			]);
			setApplications(apps);
			setAnimals(animalsData);
			setStatuses(statusesData);
			setUsers(usersData);
			setLoading(false);
		};
		fetchData();
	}, []);

	const getAnimalName = (animalId: string) =>
		animals.find(a => a.id === animalId)?.name || 'Неизвестно';
	const getStatus = (statusId: string) =>
		statuses.find(s => s.id === statusId)?.name || 'Неизвестно';
	const getStatusIdByName = (name: string) =>
		statuses.find(s => s.name === name)?.id || '';
	const getStatusTag = (status: string) => {
		if (status === 'Одобрено') return <Tag color='green'>Одобрено</Tag>;
		if (status === 'Отклонено') return <Tag color='red'>Отклонено</Tag>;
		return <Tag color='blue'>На рассмотрении</Tag>;
	};
	const getUserName = (userId: string) => {
		const user = users.find(u => u.id === userId);
		if (!user) return 'Неизвестно';
		return `${user.surname} ${user.name}`;
	};

	const handleDelete = async (id: string) => {
		const appToDelete = applications.find(app => app.id === id);
		await deleteAdoptionApplication(id);
		const updatedApps = applications.filter(app => app.id !== id);
		setApplications(updatedApps);
		message.success('Заявка удалена');

		if (appToDelete) {
			const stillPending = updatedApps.some(
				app =>
					app.animalId === appToDelete.animalId &&
					getStatus(app.statusAdoptionId) === 'На рассмотрении'
			);
			if (!stillPending) {
				const animal = animals.find(a => a.id === appToDelete.animalId);
				if (animal) {
					await updateAnimal(animal.id, {
						...animal,
						animalStatusId: config.api.animalStatusesId.defaultAnimalStatusId,
					});
				}
			}
		}
	};

	const fetchAnimals = async () => {
		const animalsData = await getAllAnimals();
		setAnimals(animalsData);
	};

	const handleStatusChange = async (app: any, newStatusId: string) => {
		await updateAdoptionApplication(app.id, {
			...app,
			statusAdoptionId: newStatusId,
		});

		const refreshedApps = applications.map(a =>
			a.id === app.id ? { ...a, statusAdoptionId: newStatusId } : a
		);
		setApplications(refreshedApps);
		message.success('Статус обновлён');

		const animalId = app.animalId;
		const animalApps = refreshedApps.filter(a => a.animalId === animalId);
		const hasApproved = animalApps.some(
			a => a.statusAdoptionId === statusIdApproved
		);
		const hasPending = animalApps.some(
			a => a.statusAdoptionId === statusIdPending
		);
		let newAnimalStatusId = '';
		if (hasApproved) newAnimalStatusId = animalStatusesId.adoptedId;
		else if (hasPending) newAnimalStatusId = animalStatusesId.bookedId;
		else newAnimalStatusId = animalStatusesId.defaultAnimalStatusId;
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
			<h1>Все заявки на усыновление</h1>
			{applications.map(app => (
				<Card key={app.id} style={{ marginBottom: 16 }}>
					<b>Животное:</b> {getAnimalName(app.animalId)}
					<br />
					<b>Заявитель:</b> {getUserName(app.userId)}
					<br />
					<b>Дата подачи:</b>{' '}
					{new Date(app.applicationDate).toLocaleDateString()}
					<br />
					<b>Статус:</b> {getStatusTag(getStatus(app.statusAdoptionId))}
					<div
						style={{
							marginTop: 12,
							display: 'flex',
							justifyContent: 'center',
							gap: 16,
						}}
					>
						<Select
							value={app.statusAdoptionId}
							style={{ minWidth: 180 }}
							onChange={newStatusId => handleStatusChange(app, newStatusId)}
						>
							{statuses.map(status => (
								<Select.Option key={status.id} value={status.id}>
									{status.name}
								</Select.Option>
							))}
						</Select>
						<Popconfirm
							title='Удалить заявку?'
							onConfirm={() => handleDelete(app.id)}
							okText='Да'
							cancelText='Нет'
							placement='top'
							overlayClassName='popconfirm-center'
						>
							<Button
								danger
								style={{
									minWidth: 120,
									display: 'block',
									margin: '0 auto',
									maxWidth: 570,
								}}
							>
								Удалить
							</Button>
						</Popconfirm>
					</div>
				</Card>
			))}
			{!applications.length && !loading && (
				<div>Заявок на усыновление нет.</div>
			)}
		</div>
	);
};

export default AllAdoptionApplicationsPage;