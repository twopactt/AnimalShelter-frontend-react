import styles from './Animals.module.css';
import config from '../../api/config';
import { Animal } from '../../models/Animal';
import { TypeAnimal } from '../../models/TypeAnimal';
import { AnimalStatus } from '../../models/AnimalStatus';
import { getAgeString } from '../../utils/ageHelper';
import Card from 'antd/es/card/Card';
import Button from 'antd/es/button/button';

interface Props {
	animals: Animal[];
	typeAnimals: TypeAnimal[];
	animalStatuses: AnimalStatus[];
	handleDelete: (id: string) => void;
	handleOpen: (animal: Animal) => void;
}

export const Animals: React.FC<Props> = ({
	animals,
	typeAnimals,
	animalStatuses,
	handleDelete,
	handleOpen,
}) => {
	const getTypeName = (id: string) =>
		typeAnimals.find(t => t.id === id)?.name || id;
	const getStatusName = (id: string) =>
		animalStatuses.find(s => s.id === id)?.name || id;

	return (
		<div className={styles.cards}>
			{animals.map(animal => (
				<Card
					key={animal.id}
					className={styles.card}
					cover={
						<>
							{animal.photo && (
								<div className={styles.card__img__container}>
									<img
										className={styles.card__img}
										src={
											animal.photo.startsWith('http')
												? animal.photo
												: `${config.api.baseUrl}${animal.photo}`
										}
										alt={animal.name}
									/>
								</div>
							)}
							<div className={styles.card__header}>
								<span className={styles.card__name} title={animal.name}>
									{animal.name}
								</span>
								<span className={styles.card__age}>
									{getAgeString(animal.age)}
								</span>
							</div>
						</>
					}
				>
					<AnimalInfo
						animal={animal}
						typeName={getTypeName(animal.typeAnimalId)}
						statusName={getStatusName(animal.animalStatusId)}
					/>
					<div className={styles.card__buttons}>
						<Button block onClick={() => handleOpen(animal)}>
							Редактировать
						</Button>
						<Button block danger onClick={() => handleDelete(animal.id)}>
							Удалить
						</Button>
					</div>
				</Card>
			))}
		</div>
	);
};

const AnimalInfo: React.FC<{
	animal: Animal;
	typeName: string;
	statusName: string;
}> = ({ animal, typeName, statusName }) => (
	<>
		<p>
			<strong>Пол: </strong>
			{animal.gender === 'Мальчик' ? 'Мальчик' : 'Девочка'}
		</p>
		<p>
			<strong>Описание: </strong>
			{animal.description}
		</p>
		<p>
			<strong>Тип: </strong>
			{typeName}
		</p>
		<p>
			<strong>Статус: </strong>
			{statusName}
		</p>
	</>
);