import config from '../../api/config';
import { Animal } from '../../models/Animal';
import { TypeAnimal } from '../../models/TypeAnimal';
import { AnimalStatus } from '../../models/AnimalStatus';
import { AnimalRequest } from '../../api/animal';
import Modal from 'antd/es/modal/Modal';
import Input from 'antd/es/input/Input';
import { useEffect, useState, ChangeEvent } from 'react';
import TextArea from 'antd/es/input/TextArea';
import { Button, message, Select, Upload, UploadProps } from 'antd';
import { DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import { Image } from 'antd';
import axios from 'axios';

interface Props {
	mode: Mode;
	values: Animal;
	isModalOpen: boolean;
	handleCancel: () => void;
	handleCreate: (request: AnimalRequest) => void;
	handleUpdate: (id: string, request: AnimalRequest) => void;
	typeAnimals: TypeAnimal[];
	animalStatuses: AnimalStatus[];
}

export enum Mode {
	Create,
	Edit,
}

export const CreateUpdateAnimal = ({
	mode,
	values,
	isModalOpen,
	handleCancel: originalHandleCancel,
	handleCreate,
	handleUpdate,
	typeAnimals,
	animalStatuses,
}: Props) => {
	const [name, setName] = useState<string>('');
	const [gender, setGender] = useState<'Мальчик' | 'Девочка' | undefined>(
		undefined
	);
	const [age, setAge] = useState<number>(0);
	const [description, setDescription] = useState<string>('');
	const [photoPath, setPhotoPath] = useState<string>('');
	const [typeAnimalId, setTypeAnimalId] = useState<string>('');
	const [animalStatusId, setAnimalStatusId] = useState<string>('');
	const [uploading, setUploading] = useState<boolean>(false);

	useEffect(() => {
		setName(values.name);
		setGender(values.gender as 'Мальчик' | 'Девочка');
		setAge(values.age);
		setDescription(values.description);
		setPhotoPath(values.photo || '');
		setTypeAnimalId(values.typeAnimalId);
		setAnimalStatusId(values.animalStatusId);
	}, [values]);

	const handleRemovePhoto = async () => {
		if (!photoPath) return;

		try {
			await axios.delete(
				`${config.api.upload.baseUrl}${config.api.upload.endpoints.deletePhoto}?photoPath=${photoPath}`
			);
			setPhotoPath('');
			message.success('Фото успешно удалено');
		} catch (error) {
			console.error('Error deleting photo:', error);
			message.error('Ошибка при удалении фото');
		}
	};

	const uploadProps: UploadProps = {
		beforeUpload: async file => {
			setUploading(true);
			try {
				const formData = new FormData();
				formData.append('file', file);

				const response = await axios.post<{ filePath: string }>(
					`${config.api.upload.baseUrl}${config.api.upload.endpoints.uploadPhoto}`,
					formData,
					{
						headers: {
							'Content-Type': 'multipart/form-data',
						},
					}
				);

				setPhotoPath(response.data.filePath);
				message.success('Фото успешно загружено');
			} catch (error) {
				console.error('Upload error:', error);
				message.error('Ошибка загрузки фото');
			} finally {
				setUploading(false);
			}
			return false;
		},
		showUploadList: false,
		accept: 'image/*',
		multiple: false,
		capture: 'environment' as const,
	};

	const handleOnOk = async () => {
		if (!photoPath) {
			message.warning('Пожалуйста, загрузите фото животного');
			return;
		}

		if (age === null || !gender) {
			message.warning('Пожалуйста, укажите возраст и пол животного');
			return;
		}

		const animalRequest: AnimalRequest = {
			name,
			gender,
			age,
			description,
			photo: photoPath,
			typeAnimalId,
			animalStatusId,
		};

		if (mode === Mode.Create) {
			handleCreate(animalRequest);
		} else {
			handleUpdate(values.id, animalRequest);
		}
	};

	const handleCancel = () => {
		if (photoPath && mode === Mode.Create) {
			axios
				.delete(
					`${config.api.upload.baseUrl}${config.api.upload.endpoints.deletePhoto}?photoPath=${photoPath}`
				)
				.catch(error => console.error('Error deleting photo:', error));
		}
		originalHandleCancel();
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
		>
			<div className='animal__modal'>
				<Input
					value={name}
					onChange={(e: ChangeEvent<HTMLInputElement>) =>
						setName(e.target.value)
					}
					placeholder='Имя'
				/>
				<Select<'Мальчик' | 'Девочка'> 
					value={gender}
					onChange={value => setGender(value)}
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
							setAge(value);
						}
					}}
					placeholder='Возраст (лет)'
				/>
				<TextArea
					value={description}
					onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
						setDescription(e.target.value)
					}
					autoSize={{ minRows: 3, maxRows: 3 }}
					placeholder='Описание'
				/>
				<div style={{ margin: '16px 0' }}>
					{photoPath ? (
						<div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
							<div style={{ width: '100%', height: 200 }}>
								<Image
									src={
										photoPath.startsWith('http')
											? photoPath
											: `${config.api.baseUrl}${photoPath}`
									}
									alt='Preview'
									style={{
										width: '100%',
										height: '100%',
										objectFit: 'cover',
										borderRadius: 8,
									}}
								/>
							</div>
							<div style={{ display: 'flex', gap: 8 }}>
								<Upload {...uploadProps}>
									<Button icon={<UploadOutlined />}>Заменить фото</Button>
								</Upload>
								<Button
									danger
									onClick={handleRemovePhoto}
									icon={<DeleteOutlined />}
								>
									Удалить фото
								</Button>
							</div>
						</div>
					) : (
						<Upload {...uploadProps}>
							<Button icon={<UploadOutlined />} loading={uploading}>
								Загрузить фото
							</Button>
						</Upload>
					)}
				</div>
				<Select
					value={typeAnimalId}
					onChange={(value: string) => setTypeAnimalId(value)}
					placeholder='Тип животного'
					options={typeAnimals.map((type: TypeAnimal) => ({
						label: type.name,
						value: type.id,
					}))}
				/>

				<Select
					value={animalStatusId}
					onChange={(value: string) => setAnimalStatusId(value)}
					placeholder='Статус животного'
					options={animalStatuses.map((status: AnimalStatus) => ({
						label: status.name,
						value: status.id,
					}))}
				/>
			</div>
		</Modal>
	);
};