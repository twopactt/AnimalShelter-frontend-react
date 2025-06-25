import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Spin, message, Modal, Input, DatePicker } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Animal } from '../../models/Animal';
import { TypeAnimal } from '../../models/TypeAnimal';
import { AnimalStatus } from '../../models/AnimalStatus';
import { getAgeString } from '../../utils/ageHelper';
import config from '../../api/config';
import styles from './AnimalPage.module.css';
import {
	getAllAdoptionApplications,
	createAdoptionApplication,
} from '../../api/adoptionApplications';
import { getAllAdoptions } from '../../api/adoptions';
import { getAllStatusAdoptions } from '../../api/statusAdoptions';
import { getAllStatusTemporaryAccommodations } from '../../api/statusTemporaryAccommodations';
import { updateAnimal } from '../../api/animals';
import { createTemporaryAccommodation } from '../../api/temporaryAccommodations';
import dayjs, { Dayjs } from 'dayjs';

const AnimalPage: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [animal, setAnimal] = useState<Animal | null>(null);
	const [typeAnimals, setTypeAnimals] = useState<TypeAnimal[]>([]);
	const [animalStatuses, setAnimalStatuses] = useState<AnimalStatus[]>([]);
	const [loading, setLoading] = useState(true);
	const [adoptionApplications, setAdoptionApplications] = useState<any[]>([]);
	const [adoptions, setAdoptions] = useState<any[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [currentUser, setCurrentUser] = useState<any>(null);
	const [statusAdoptions, setStatusAdoptions] = useState<any[]>([]);
	const [statusTemporaryAccommodations, setStatusTemporaryAccommodations] = useState<any[]>([]);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [comment, setComment] = useState('');
	const [isFosterModalVisible, setIsFosterModalVisible] = useState(false);
	const [fosterDateRange, setFosterDateRange] = useState<[Dayjs, Dayjs] | null>(null);
	const [isApplicationSubmitted, setIsApplicationSubmitted] = useState(false);

	const volunteerId = `${config.api.rolesId.volunteerId}`;
	const employeeId = `${config.api.rolesId.employeeId}`;
	const adminId = `${config.api.rolesId.adminId}`;

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch(
					`${config.api.baseUrl}${config.api.endpoints.animals}/${id}`
				);
				console.log(
					'Fetching animal from:',
					`${config.api.baseUrl}${config.api.endpoints.animals}/${id}`
				);

				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}

				const data = await response.json();
				console.log('Animal data:', data);
				setAnimal(data);
				setIsApplicationSubmitted(false);

				const typesResponse = await fetch(
					`${config.api.baseUrl}${config.api.endpoints.typeAnimals}`
				);
				if (typesResponse.ok) {
					const typesData = await typesResponse.json();
					console.log('All type animals:', typesData);
					setTypeAnimals(typesData);
				} else {
					console.error('Failed to fetch type animals:', typesResponse.status);
				}

				const statusesResponse = await fetch(
					`${config.api.baseUrl}${config.api.endpoints.animalStatuses}`
				);
				if (statusesResponse.ok) {
					const statusesData = await statusesResponse.json();
					console.log('All animal statuses:', statusesData);
					setAnimalStatuses(statusesData);
				} else {
					console.error(
						'Failed to fetch animal statuses:',
						statusesResponse.status
					);
				}
			} catch (error) {
				console.error('Error fetching data:', error);
				message.error('Ошибка при загрузке данных животного');
			} finally {
				setLoading(false);
			}
		};

		if (id) {
			fetchData();
		}
	}, [id]);

	useEffect(() => {
		const fetchExtra = async () => {
			try {
				const [apps, adops, statuses] = await Promise.all([
					getAllAdoptionApplications(),
					getAllAdoptions(),
					getAllStatusAdoptions(),
				]);
				console.log('Adoption applications:', apps);
				console.log('Adoptions:', adops);
				console.log('Status adoptions:', statuses);
				setAdoptionApplications(apps);
				setAdoptions(adops);
				setStatusAdoptions(statuses);
			} catch (e) {
				console.error('Error fetching extra data:', e);
			}
		};
		fetchExtra();
		const userStr = localStorage.getItem('user');
		if (userStr) setCurrentUser(JSON.parse(userStr));
	}, []);

	const getTypeName = (typeId: string) => {
		const type = typeAnimals.find(t => t.id === typeId);
		return type?.name || 'Не указан';
	};

	const getStatusName = (statusId: string) => {
		const status = animalStatuses.find(s => s.id === statusId);
		return status?.name || 'Не указан';
	};

	const isAlreadyApplied =
		currentUser &&
		animal &&
		adoptionApplications.some(
			app => app.userId === currentUser.id && app.animalId === animal.id
		);
	const isAdopted =
		animal && animal.animalStatusId === config.api.animalStatusesId.adoptedId;
	const isBooked =
		animal && animal.animalStatusId === config.api.animalStatusesId.bookedId;
	const isFosterCare =
		animal &&
		animal.animalStatusId === config.api.animalStatusesId.fosterCareId;
	const isUnderTreatment =
		animal &&
		animal.animalStatusId === config.api.animalStatusesId.underTreatmentId;
	const canAdopt =
		!isAdopted && !isBooked && !isFosterCare && !isUnderTreatment;
	const canFoster =
		!isAdopted && !isBooked && !isFosterCare && !isUnderTreatment;

	const handleAdopt = async () => {
		if (!currentUser) {
			message.error('Необходимо войти в аккаунт');
			return;
		}
		if (!animal) return;
		setIsModalVisible(true);
	};

	const handleSubmit = async () => {
		if (!animal) return;
		setIsSubmitting(true);
		try {
			console.log('Current user:', currentUser);
			console.log('Animal:', animal);
			console.log(
				'Default status ID:',
				config.api.statusAdoptionsId.defaultStatusAdoptionId
			);

			const today = new Date();
			const formattedDate = today.toISOString().split('T')[0];

			const applicationData = {
				applicationDate: formattedDate,
				userId: currentUser.id,
				animalId: animal.id,
				statusAdoptionId: config.api.statusAdoptionsId.defaultStatusAdoptionId,
				comment: comment || '',
			};
			console.log('Sending application data:', applicationData);

			await createAdoptionApplication(applicationData);
			await updateAnimal(animal.id, {
				...animal,
				animalStatusId: config.api.animalStatusesId.bookedId,
			});
			setIsApplicationSubmitted(true);
			message.success('Заявка отправлена!');
			setIsModalVisible(false);
			setComment('');
			const updatedApps = await getAllAdoptionApplications();
			setAdoptionApplications(updatedApps);
		} catch (e: any) {
			console.error('Error creating adoption application:', e);
			if (e.response) {
				console.error('Error response:', await e.response.text());
			}
			message.error(e.message || 'Ошибка при отправке заявки');
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleFoster = () => {
		setIsFosterModalVisible(true);
	};

	const handleFosterSubmit = async () => {
		if (!animal || !currentUser) return;

		if (!fosterDateRange || fosterDateRange.length !== 2) {
			message.error('Пожалуйста, выберите даты начала и окончания передержки');
			return;
		}

		const [startDate, endDate] = fosterDateRange;

		setIsSubmitting(true);
		try {
			await createTemporaryAccommodation({
				dateAnimalCapture: startDate.format('YYYY-MM-DD'),
				dateAnimalReturn: endDate.format('YYYY-MM-DD'),
				userId: currentUser.id,
				animalId: animal.id,
				statusTemporaryAccommodationId: config.api.statusTemporaryAccommodationsId.defaultStatusTemporaryAccommodationId,
			});
			await updateAnimal(animal.id, {
				...animal,
				animalStatusId: config.api.animalStatusesId.fosterCareId,
			});
			setIsApplicationSubmitted(true);
			message.success('Заявка на передержку отправлена!');
			setIsFosterModalVisible(false);
			setFosterDateRange(null);
		} catch (e: any) {
			message.error(e.message || 'Ошибка при отправке заявки на передержку');
		} finally {
			setIsSubmitting(false);
		}
	};

	if (loading) {
		return (
			<div className={styles.loadingContainer}>
				<Spin size='large' />
			</div>
		);
	}

	if (!animal) {
		return (
			<div className={styles.container}>
				<Button
					icon={<ArrowLeftOutlined />}
					onClick={() => navigate('/animals')}
					className={styles.backButton}
				>
					Назад к списку
				</Button>
				<Card className={styles.animalCard}>
					<div className={styles.infoContainer}>
						<h1 className={styles.name}>Животное не найдено</h1>
					</div>
				</Card>
			</div>
		);
	}

	return (
		<div className={styles.container}>
			<Button
				icon={<ArrowLeftOutlined />}
				onClick={() => navigate('/animals')}
				className={styles.backButton}
			>
				Назад к списку
			</Button>

			<Card className={styles.animalCard}>
				{animal.photo && (
					<div className={styles.photoContainer}>
						<img
							src={
								animal.photo.startsWith('http')
									? animal.photo
									: `${config.api.baseUrl}${animal.photo}`
							}
							alt={animal.name}
							className={styles.photo}
						/>
					</div>
				)}

				<div className={styles.infoContainer}>
					<h1 className={styles.name}>{animal.name}</h1>

					<div className={styles.infoRow}>
						<span className={styles.infoLabel}>Возраст:</span>
						<span className={styles.infoValue}>{getAgeString(animal.age)}</span>
					</div>

					<div className={styles.infoRow}>
						<span className={styles.infoLabel}>Пол:</span>
						<span className={styles.infoValue}>{animal.gender}</span>
					</div>

					<div className={styles.infoRow}>
						<span className={styles.infoLabel}>Тип:</span>
						<span className={styles.infoValue}>
							{getTypeName(animal.typeAnimalId)}
						</span>
					</div>

					<div className={styles.infoRow}>
						<span className={styles.infoLabel}>Статус:</span>
						<span className={styles.infoValue}>
							{getStatusName(animal.animalStatusId)}
						</span>
					</div>

					{animal.description && (
						<div className={styles.description}>
							<h2>Описание:</h2>
							<p style={{ textAlign: 'left' }}>{animal.description}</p>
						</div>
					)}

					<div style={{ marginTop: 24, display: 'flex', gap: 16 }}>
						{currentUser && (
							<>
								<Button
									type='primary'
									disabled={!canAdopt || isAlreadyApplied || isSubmitting || isApplicationSubmitted}
									onClick={handleAdopt}
								>
									{isAdopted
										? 'Животное уже усыновлено'
										: isBooked
										? 'Животное забронировано'
										: isFosterCare
										? 'Животное на передержке'
										: isUnderTreatment
										? 'Животное на лечении'
										: isAlreadyApplied || isApplicationSubmitted
										? 'Заявка уже отправлена'
										: 'Усыновить'}
								</Button>
								{[volunteerId, employeeId, adminId].includes(
									currentUser.roleId
								) && (
									<Button
										type='default'
										disabled={!canFoster || isSubmitting || isApplicationSubmitted}
										onClick={handleFoster}
									>
										{isFosterCare || isApplicationSubmitted
											? 'Животное на передержке'
											: isUnderTreatment
											? 'Животное на лечении'
											: 'Взять на передержку'}
									</Button>
								)}
							</>
						)}
					</div>
				</div>
			</Card>

			<Modal
				title='Заявка на усыновление'
				open={isModalVisible}
				onOk={handleSubmit}
				onCancel={() => {
					setIsModalVisible(false);
					setComment('');
				}}
				confirmLoading={isSubmitting}
				okText='Отправить'
				cancelText='Отмена'
			>
				<p>
					Если хотите, укажите причину, по которой вы хотите усыновить{' '}
					{animal.name}:
				</p>
				<Input.TextArea
					value={comment}
					onChange={e => setComment(e.target.value)}
					placeholder='Например: У меня есть опыт содержания животных, большой дом и много свободного времени... (необязательно)'
					rows={4}
				/>
			</Modal>

			<Modal
				title='Заявка на передержку'
				open={isFosterModalVisible}
				onOk={handleFosterSubmit}
				onCancel={() => setIsFosterModalVisible(false)}
				confirmLoading={isSubmitting}
				okText='Отправить'
				cancelText='Отмена'
			>
				<p>Выберите даты начала и окончания передержки для {animal?.name}:</p>
				<DatePicker.RangePicker
					value={fosterDateRange}
					onChange={dates => setFosterDateRange(dates as [Dayjs, Dayjs] | null)}
					format='YYYY-MM-DD'
				/>
			</Modal>
		</div>
	);
};

export default AnimalPage;