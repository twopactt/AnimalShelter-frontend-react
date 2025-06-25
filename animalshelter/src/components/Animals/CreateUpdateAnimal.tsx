import styles from './Animals.module.css'
import { Animal } from '../../models/Animal';
import { TypeAnimal } from '../../models/TypeAnimal';
import { AnimalStatus } from '../../models/AnimalStatus';
import { AnimalRequest } from '../../api/animals';
import Modal from 'antd/es/modal/Modal';
import { useState, useEffect } from 'react';
import { message } from 'antd';
import { PhotoUploader } from './PhotoUploader';
import { AnimalFormFields } from './AnimalForm';
import { Mode, AnimalGender, AnimalFormState } from './types';

interface CreateUpdateAnimalProps {
	mode: Mode;
	values: Animal;
	isModalOpen: boolean;
	handleCancel: () => void;
	handleCreate: (request: AnimalRequest) => void;
	handleUpdate: (id: string, request: AnimalRequest) => void;
	typeAnimals: TypeAnimal[];
	animalStatuses: AnimalStatus[];
}

export const CreateUpdateAnimal = ({
	mode,
	values,
	isModalOpen,
	handleCancel,
	handleCreate,
	handleUpdate,
	typeAnimals,
	animalStatuses,
}: CreateUpdateAnimalProps) => {
	const [formState, setFormState] = useState<AnimalFormState>({
		name: '',
		gender: null,
		age: 0,
		description: '',
		typeAnimalId: '',
		animalStatusId: '',
	});

	const [photoPath, setPhotoPath] = useState('');

	useEffect(() => {
		if (values) {
			setFormState({
				name: values.name || '',
				gender: (values.gender as AnimalGender) || null,
				age: values.age,
				description: values.description || '',
				typeAnimalId: values.typeAnimalId || '',
				animalStatusId: values.animalStatusId || '',
			});
			setPhotoPath(values.photo || '');
		}
	}, [values]);

	const handleOnOk = async () => {
		if (!photoPath) {
			message.warning('Пожалуйста, загрузите фото животного');
			return;
		}

		if (!formState.gender) {
			message.warning('Пожалуйста, укажите пол животного');
			return;
		}

		const animalRequest: AnimalRequest = {
			...formState,
			gender: formState.gender,
			photo: photoPath,
		};

		if (mode === Mode.Create) {
			handleCreate(animalRequest);
		} else {
			handleUpdate(values.id, animalRequest);
		}
	};

	return (
		<Modal
			title={
				mode === Mode.Create ? 'Добавить животного' : 'Редактировать животного'
			}
			open={isModalOpen}
			onOk={handleOnOk}
			onCancel={handleCancel}
			cancelText={'Отмена'}
			okText={'Сохранить'}
		>
			<div className={styles.animal__modal}>
				<AnimalFormFields
					name={formState.name}
					gender={formState.gender}
					age={formState.age}
					description={formState.description}
					typeAnimalId={formState.typeAnimalId}
					animalStatusId={formState.animalStatusId}
					typeAnimals={typeAnimals}
					animalStatuses={animalStatuses}
					onNameChange={name => setFormState({ ...formState, name })}
					onGenderChange={gender => setFormState({ ...formState, gender })}
					onAgeChange={age => setFormState({ ...formState, age })}
					onDescriptionChange={description =>
						setFormState({ ...formState, description })
					}
					onTypeAnimalChange={typeAnimalId =>
						setFormState({ ...formState, typeAnimalId })
					}
					onStatusChange={animalStatusId =>
						setFormState({ ...formState, animalStatusId })
					}
				/>
				<PhotoUploader photoPath={photoPath} onPhotoChange={setPhotoPath} />
			</div>
		</Modal>
	);
};