import styles from './Animals.module.css';
import { Card, Button } from 'antd';
import { Animal } from '../../models/Animal';
import config from '../../api/config';
import { AnimalInfo } from './AnimalInfo';
import { getAgeString } from '../../utils/ageHelper';
import { useNavigate } from 'react-router-dom';

interface AnimalCardProps {
	animal: Animal;
	typeName: string;
	statusName: string;
	onEdit: () => void;
	onDelete: () => void;
}

export const AnimalCard = ({
	animal,
	typeName,
	statusName,
	onEdit,
	onDelete,
}: AnimalCardProps) => {
	const navigate = useNavigate();

	const handleCardClick = (e: React.MouseEvent) => {
		if (!(e.target as HTMLElement).closest('button')) {
			navigate(`/animals/${animal.id}`);
		}
	};

	return (
		<Card
			className={styles.card}
			onClick={handleCardClick}
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
						<span className={styles.card__age}>{getAgeString(animal.age)}</span>
					</div>
				</>
			}
		>
			<AnimalInfo animal={animal} typeName={typeName} statusName={statusName} />
			<div className={styles.card__buttons}>
				<Button block onClick={onEdit}>
					Редактировать
				</Button>
				<Button block danger onClick={onDelete}>
					Удалить
				</Button>
			</div>
		</Card>
	);
};