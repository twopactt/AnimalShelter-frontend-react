import React, { useEffect, useState } from 'react';
import { Button, Skeleton, Row, Col } from 'antd';
import { Animals } from '../../components/Animals/Animals';
import { CreateUpdateAnimal } from '../../components/Animals/CreateUpdateAnimal';
import { Mode } from '../../components/Animals/types';
import {
	AnimalFilters,
	AnimalFilters as AnimalFiltersType,
} from '../../components/Animals/AnimalFilters';
import {
	AnimalRequest,
	createAnimal,
	deleteAnimal,
	getAllAnimals,
	updateAnimal,
} from '../../api/animals';
import { getAllAnimalStatuses } from '../../api/animalStatuses';
import { getAllTypeAnimals } from '../../api/typeAnimals';
import { Animal } from '../../models/Animal';
import { AnimalStatus } from '../../models/AnimalStatus';
import { TypeAnimal } from '../../models/TypeAnimal';
import config from '../../api/config';

export const AnimalsPage: React.FC = () => {
	const defaultValues = {
		name: '',
		description: '',
	} as Animal;

	const [values, setValues] = useState<Animal>(defaultValues);
	const [animals, setAnimals] = useState<Animal[]>([]);
	const [filteredAnimals, setFilteredAnimals] = useState<Animal[]>([]);
	const [loading, setLoading] = useState(true);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [mode, setMode] = useState(Mode.Create);
	const [typeAnimals, setTypeAnimals] = useState<TypeAnimal[]>([]);
	const [animalStatuses, setAnimalStatuses] = useState<AnimalStatus[]>([]);

	const employeeId = `${config.api.rolesId.employeeId}`;
	const adminId = `${config.api.rolesId.adminId}`;
	const userStr = localStorage.getItem('user');
	const currentUser = userStr ? JSON.parse(userStr) : null;

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [animalsData, typesData, statusesData] = await Promise.all([
					getAllAnimals(),
					getAllTypeAnimals(),
					getAllAnimalStatuses(),
				]);

				setAnimals(animalsData);
				setFilteredAnimals(animalsData);
				setTypeAnimals(typesData);
				setAnimalStatuses(statusesData);
			} catch (error) {
				console.error('Error fetching data:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	const handleCreateAnimal = async (request: AnimalRequest) => {
		await createAnimal(request);
		await refreshAnimals();
		closeModal();
	};

	const handleUpdateAnimal = async (id: string, request: AnimalRequest) => {
		await updateAnimal(id, request);
		await refreshAnimals();
		closeModal();
	};

	const handleDeleteAnimal = async (id: string) => {
		await deleteAnimal(id);
		await refreshAnimals();
	};

	const refreshAnimals = async () => {
		const updatedAnimals = await getAllAnimals();
		setAnimals(updatedAnimals);
		setFilteredAnimals(updatedAnimals);
	};

	const openModal = () => {
		setIsModalOpen(true);
		setMode(Mode.Create);
		setValues(defaultValues);
	};

	const closeModal = () => {
		setIsModalOpen(false);
	};

	const openEditModal = (animal: Animal) => {
		setMode(Mode.Edit);
		setValues({
			...animal,
			name: animal.name || '',
			description: animal.description || '',
			gender: animal.gender || null,
			age: animal.age || 0,
			photo: animal.photo || '',
			typeAnimalId: animal.typeAnimalId || '',
			animalStatusId: animal.animalStatusId || '',
		});
		setIsModalOpen(true);
	};

	const handleFilterChange = (filters: AnimalFiltersType) => {
		let filtered = [...animals];

		if (filters.typeAnimalId) {
			filtered = filtered.filter(
				animal => animal.typeAnimalId === filters.typeAnimalId
			);
		}

		if (filters.gender) {
			filtered = filtered.filter(animal => animal.gender === filters.gender);
		}

		if (filters.minAge !== undefined) {
			filtered = filtered.filter(animal => animal.age >= filters.minAge!);
		}

		if (filters.maxAge !== undefined) {
			filtered = filtered.filter(animal => animal.age <= filters.maxAge!);
		}

		if (filters.animalStatusId) {
			filtered = filtered.filter(
				animal => animal.animalStatusId === filters.animalStatusId
			);
		}

		setFilteredAnimals(filtered);
	};

	return (
		<div>
			<Row justify='space-between' align='middle' style={{ marginBottom: 16 }}>
				<Col
					flex='auto'
				>
					<AnimalFilters
						typeAnimals={typeAnimals}
						animalStatuses={animalStatuses}
						onFilterChange={handleFilterChange}
					/>
				</Col>
				{currentUser &&
					(currentUser.roleId === employeeId ||
						currentUser.roleId === adminId) && (
						<Col>
							<Button
								type='primary'
								style={{ width: '200px' }}
								size='large'
								onClick={openModal}
							>
								Добавить животного
							</Button>
						</Col>
					)}
			</Row>

			<CreateUpdateAnimal
				mode={mode}
				values={values}
				isModalOpen={isModalOpen}
				handleCreate={handleCreateAnimal}
				handleUpdate={handleUpdateAnimal}
				handleCancel={closeModal}
				typeAnimals={typeAnimals}
				animalStatuses={animalStatuses}
			/>

			{loading ? (
				<Skeleton active paragraph={{ rows: 6 }} />
			) : (
				<Animals
					animals={filteredAnimals}
					typeAnimals={typeAnimals}
					animalStatuses={animalStatuses}
					handleOpen={openEditModal}
					handleDelete={handleDeleteAnimal}
				/>
			)}
		</div>
	);
};

export default AnimalsPage;
