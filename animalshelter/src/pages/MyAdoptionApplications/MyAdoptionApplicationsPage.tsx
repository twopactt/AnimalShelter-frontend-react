import React, { useEffect, useState } from 'react';
import { Card, Button, Tag, Popconfirm, message } from 'antd';
import {
	getAllAdoptionApplications,
	deleteAdoptionApplication,
} from '../../api/adoptionApplications';
import { getAllStatusAdoptions } from '../../api/statusAdoptions';
import { getAllAnimals } from '../../api/animals';
import { useNavigate } from 'react-router-dom';

const MyAdoptionApplicationsPage: React.FC = () => {
	const [applications, setApplications] = useState<any[]>([]);
	const [animals, setAnimals] = useState<any[]>([]);
	const [statuses, setStatuses] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [currentUser, setCurrentUser] = useState<any>(null);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			const userStr = localStorage.getItem('user');
			if (!userStr) {
				navigate('/login');
				return;
			}
			setCurrentUser(JSON.parse(userStr));
			const [apps, animalsData, statusesData] = await Promise.all([
				getAllAdoptionApplications(),
				getAllAnimals(),
				getAllStatusAdoptions(),
			]);
			setApplications(apps);
			setAnimals(animalsData);
			setStatuses(statusesData);
			setLoading(false);
		};
		fetchData();
	}, []);

	const myApps = currentUser
		? applications.filter(app => app.userId === currentUser.id)
		: [];

	const getAnimalName = (animalId: string) =>
		animals.find(a => a.id === animalId)?.name || 'Неизвестно';
	const getStatus = (statusId: string) =>
		statuses.find(s => s.id === statusId)?.name || 'Неизвестно';
	const getStatusTag = (status: string) => {
		if (status === 'Одобрено') return <Tag color='green'>Одобрено</Tag>;
		if (status === 'Отклонено') return <Tag color='red'>Отклонено</Tag>;
		return <Tag color='blue'>На рассмотрении</Tag>;
	};

	const handleDelete = async (id: string) => {
		await deleteAdoptionApplication(id);
		setApplications(applications.filter(app => app.id !== id));
		message.success('Заявка удалена');
	};

	return (
		<div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
			<h1>Мои заявки на усыновление</h1>
			{myApps.map(app => (
				<Card key={app.id} style={{ marginBottom: 16 }}>
					<b>Животное:</b> {getAnimalName(app.animalId)}
					<br />
					<b>Дата подачи:</b>{' '}
					{new Date(app.applicationDate).toLocaleDateString()}
					<br />
					<b>Статус:</b> {getStatusTag(getStatus(app.statusAdoptionId))}
					<div
						style={{ marginTop: 12, display: 'flex', justifyContent: 'center' }}
					>
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
								style={{ minWidth: 120, display: 'block', margin: '0 auto' }}
							>
								Удалить
							</Button>
						</Popconfirm>
					</div>
				</Card>
			))}
			{!myApps.length && !loading && (
				<div>У вас нет заявок на усыновление.</div>
			)}
		</div>
	);
};

export default MyAdoptionApplicationsPage;
