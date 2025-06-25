import styles from './Animals.module.css';
import { ChangeEvent } from 'react';
import { Input, Select } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { TypeAnimal } from '../../models/TypeAnimal';
import { AnimalStatus } from '../../models/AnimalStatus';

interface AnimalFormFieldsProps {
	name: string;
	gender: 'Мальчик' | 'Девочка' | null;
	age: number;
	description: string;
	typeAnimalId: string;
	animalStatusId: string;
	typeAnimals: TypeAnimal[];
	animalStatuses: AnimalStatus[];
	onNameChange: (value: string) => void;
	onGenderChange: (value: 'Мальчик' | 'Девочка') => void;
	onAgeChange: (value: number) => void;
	onDescriptionChange: (value: string) => void;
	onTypeAnimalChange: (value: string) => void;
	onStatusChange: (value: string) => void;
}

export const AnimalFormFields = ({
	name,
	gender,
	age,
	description,
	typeAnimalId,
	animalStatusId,
	typeAnimals,
	animalStatuses,
	onNameChange,
	onGenderChange,
	onAgeChange,
	onDescriptionChange,
	onTypeAnimalChange,
	onStatusChange,
}: AnimalFormFieldsProps) => {
	return (
		<>
			<Input
				className={styles.modal__input}
				value={name}
				onChange={(e: ChangeEvent<HTMLInputElement>) =>
					onNameChange(e.target.value)
				}
				placeholder='Имя'
			/>
			<Select
				value={gender}
				onChange={onGenderChange}
				placeholder='Пол'
				options={[
					{ value: 'Мальчик', label: 'Мальчик' },
					{ value: 'Девочка', label: 'Девочка' },
				]}
			/>
			<Input
				type='number'
				min={0}
				max={150}
				value={age}
				onChange={(e: ChangeEvent<HTMLInputElement>) => {
					const value = parseInt(e.target.value);
					if (!isNaN(value)) {
						onAgeChange(value);
					}
				}}
				placeholder='Возраст (лет)'
			/>
			<TextArea
				value={description}
				onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
					onDescriptionChange(e.target.value)
				}
				autoSize={{ minRows: 3, maxRows: 3 }}
				placeholder='Описание'
			/>
			<Select
				value={typeAnimalId || undefined}
				onChange={onTypeAnimalChange}
				placeholder='Тип животного'
				options={typeAnimals.map((type: TypeAnimal) => ({
					label: type.name,
					value: type.id,
				}))}
			/>
			<Select
				value={animalStatusId || undefined}
				onChange={onStatusChange}
				placeholder='Статус животного'
				options={animalStatuses.map((status: AnimalStatus) => ({
					label: status.name,
					value: status.id,
				}))}
			/>
		</>
	);
};