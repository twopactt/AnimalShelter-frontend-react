import React, { useEffect, useState } from 'react';
import { Button, Card, message, Select, Popconfirm, Tag } from 'antd';
import {
	getAllTemporaryAccommodations,
	updateTemporaryAccommodation,
	deleteTemporaryAccommodation,
} from '../../api/temporaryAccommodations';
import { getAllAnimals, updateAnimal } from '../../api/animals';
import { useNavigate } from 'react-router-dom';
import config from '../../api/config';

const MyTemporaryAccommodationsPage: React.FC = () => {
	const [accommodations, setAccommodations] = useState<any[]>([]);
	const [animals, setAnimals] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [currentUser, setCurrentUser] = useState<any>(null);
	const [statuses, setStatuses] = useState<any[]>([]);
	const navigate = useNavigate();

	const volunteerId = `${config.api.rolesId.volunteerId}`;
	const employeeId = `${config.api.rolesId.employeeId}`;
	const adminId = `${config.api.rolesId.adminId}`;

	useEffect(() => {
		const userStr = localStorage.getItem('user');
		if (!userStr) {
			navigate('/login');
			return;
		}
		const user = JSON.parse(userStr);
		setCurrentUser(user);
		if (![volunteerId, employeeId, adminId].includes(user.roleId)) {
			navigate('/');
			return;
		}
		const fetchData = async () => {
			setLoading(true);
			try {
				const [accs, animalsData] = await Promise.all([
					getAllTemporaryAccommodations(),
					getAllAnimals(),
				]);
				setAccommodations(accs);
				setAnimals(animalsData);
			} catch (error) {
				console.error('Error fetching data:', error);
				message.error('Ошибка при загрузке данных');
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, [navigate]);

	const myAccs = currentUser
		? accommodations.filter(acc => acc.userId === currentUser.id)
		: [];

	const getAnimalName = (animalId: string) =>
		animals.find(a => a.id === animalId)?.name || 'Неизвестно';
	const getStatus = (statusId: string) =>
		statuses.find(s => s.id === statusId)?.name || 'Неизвестно';
	const getStatusTag = (status: string) => {
		if (status === 'Активна') return <Tag color='green'>Активна</Tag>;
		if (status === 'Отклонена') return <Tag color='red'>Отклонена</Tag>;
		return <Tag color='blue'>На рассмотрении</Tag>;
	};

	const handleDelete = async (id: string) => {
		await deleteTemporaryAccommodation(id);
		setAccommodations(accommodations.filter(acc => acc.id !== id));
		message.success('Передержка удалена');
	};

	const updateTemporaryAccommodationStatus = async (
		id: string,
		newStatus: string,
		animalId: string,
		currentAccommodation: any
	) => {
		try {
			await updateTemporaryAccommodation(id, {
				...currentAccommodation,
				statusTemporaryAccommodationId: newStatus,
			});

			let newAnimalStatusId = '';
			if (newStatus === config.api.statusTemporaryAccommodationsId.approvedId) {
				newAnimalStatusId = config.api.animalStatusesId.fosterCareId;
			} else {
				newAnimalStatusId = config.api.animalStatusesId.defaultAnimalStatusId;
			}

			const animal = animals.find(a => a.id === animalId);
			if (animal) {
				await updateAnimal(animal.id, {
					...animal,
					animalStatusId: newAnimalStatusId,
				});
				message.success('Статус передержки и животного обновлены');

				const updatedAnimals = await getAllAnimals();
				setAnimals(updatedAnimals);
			}
		} catch (error) {
			console.error('Error updating status:', error);
			message.error('Ошибка при обновлении статуса');
		}
	};

	return (
		<div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
			<h1>Мои передержки</h1>
			{myAccs.map(acc => (
				<Card key={acc.id} style={{ marginBottom: 16 }}>
					<b>Животное:</b> {getAnimalName(acc.animalId)}
					<br />
					<b>Дата начала:</b>{' '}
					{new Date(acc.dateAnimalCapture).toLocaleDateString()}
					<br />
					<b>Дата окончания:</b>{' '}
					{acc.dateAnimalReturn
						? new Date(acc.dateAnimalReturn).toLocaleDateString()
						: '---'}
					<br />
					<div
						style={{ marginTop: 12, display: 'flex', justifyContent: 'center' }}
					>
						<Popconfirm
							title='Удалить заявку?'
							onConfirm={() => handleDelete(acc.id)}
							okText='Да'
							cancelText='Нет'
							placement='top'
							overlayClassName='popconfirm-center'
						>
							<Button
								danger
								style={{ minWidth: 120, display: 'block', margin: '0 auto' }}
							>
								Удалить
							</Button>
						</Popconfirm>
					</div>
				</Card>
			))}
			{!myAccs.length && !loading && <div>У вас нет активных передержек.</div>}
		</div>
	);
};

export default MyTemporaryAccommodationsPage;