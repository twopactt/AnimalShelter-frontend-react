import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import { getAllTemporaryAccommodations } from '../../api/temporaryAccommodations';
import { getAllAnimals } from '../../api/animals';
import { useNavigate } from 'react-router-dom';
import config from '../../api/config';

const MyTemporaryAccommodationsPage: React.FC = () => {
	const [accommodations, setAccommodations] = useState<any[]>([]);
	const [animals, setAnimals] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [currentUser, setCurrentUser] = useState<any>(null);
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
			const [accs, animalsData] = await Promise.all([
				getAllTemporaryAccommodations(),
				getAllAnimals(),
			]);
			setAccommodations(accs);
			setAnimals(animalsData);
			setLoading(false);
		};
		fetchData();
	}, [navigate]);

	const myAccs = currentUser
		? accommodations.filter(acc => acc.userId === currentUser.id)
		: [];

	const getAnimalName = (animalId: string) =>
		animals.find(a => a.id === animalId)?.name || 'Неизвестно';

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
						: '—'}
				</Card>
			))}
			{!myAccs.length && !loading && <div>У вас нет активных передержек.</div>}
		</div>
	);
};

export default MyTemporaryAccommodationsPage;