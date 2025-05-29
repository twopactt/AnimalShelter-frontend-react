import React, { useEffect, useState } from 'react';
import { Button, Skeleton } from 'antd';
import { Animals } from '../components/Animals/Animals';
import { CreateUpdateAnimal, Mode } from '../components/Animals/CreateUpdateAnimal';
import {
	AnimalRequest,
	createAnimal,
	deleteAnimal,
	getAllAnimals,
	updateAnimal,
} from '../api/animals';
import { getAllAnimalStatuses } from '../api/animalStatuses';
import { getAllTypeAnimals } from '../api/typeAnimals';
import { Animal } from '../models/Animal';
import { AnimalStatus } from '../models/AnimalStatus';
import { TypeAnimal } from '../models/TypeAnimal';

export const AnimalsPage: React.FC = () => {
	const defaultValues = {
		name: '',
		description: '',
	} as Animal;

	const [values, setValues] = useState<Animal>(defaultValues);
	const [animals, setAnimals] = useState<Animal[]>([]);
	const [loading, setLoading] = useState(true);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [mode, setMode] = useState(Mode.Create);
	const [typeAnimals, setTypeAnimals] = useState<TypeAnimal[]>([]);
	const [animalStatuses, setAnimalStatuses] = useState<AnimalStatus[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [animalsData, typesData, statusesData] = await Promise.all([
					getAllAnimals(),
					getAllTypeAnimals(),
					getAllAnimalStatuses(),
				]);

				setAnimals(animalsData);
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
		setValues(animal);
		setIsModalOpen(true);
	};

	return (
		<div>
			<Button
				type='primary'
				style={{ marginTop: '30px' }}
				size='large'
				onClick={openModal}
			>
				Добавить животного
			</Button>

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
					animals={animals}
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