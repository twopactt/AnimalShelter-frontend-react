import React from 'react';
import { Animal } from '../../models/Animal';
import styles from './Animals.module.css';

interface AnimalInfoProps {
	animal: Animal;
	typeName: string;
	statusName: string;
}

export const AnimalInfo: React.FC<AnimalInfoProps> = ({
	animal,
	typeName,
	statusName,
}) => (
	<>
		<p className={styles.card__text}>
			<strong>Пол: </strong>
			{animal.gender === 'Мальчик' ? 'Мальчик' : 'Девочка'}
		</p>
		{animal.description && (
			<div className={styles.descriptionContainer}>
				<strong>Описание: </strong>
				<div className={styles.descriptionContent}>{animal.description}</div>
			</div>
		)}
		<p className={styles.card__text}>
			<strong>Тип: </strong>
			{typeName}
		</p>
		<p className={styles.card__text}>
			<strong>Статус: </strong>
			{statusName}
		</p>
	</>
);