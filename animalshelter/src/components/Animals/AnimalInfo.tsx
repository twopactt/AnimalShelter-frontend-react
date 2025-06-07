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
		<p>
			<strong>Пол: </strong>
			{animal.gender === 'Мальчик' ? 'Мальчик' : 'Девочка'}
		</p>
		{animal.description && (
			<div className={styles.descriptionContainer}>
				<strong>Описание: </strong>
				<div className={styles.descriptionContent}>{animal.description}</div>
			</div>
		)}
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