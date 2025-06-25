import styles from './Animals.module.css';
import { Animal } from '../../models/Animal';
import { TypeAnimal } from '../../models/TypeAnimal';
import { AnimalStatus } from '../../models/AnimalStatus';
import { AnimalCard } from './AnimalCard';

interface AnimalsProps {
  animals: Animal[];
  typeAnimals: TypeAnimal[];
  animalStatuses: AnimalStatus[];
  handleOpen: (animal: Animal) => void;
  handleDelete: (id: string) => void;
}

export const Animals = ({
	animals,
	typeAnimals,
	animalStatuses,
	handleOpen,
  handleDelete
}: AnimalsProps) => {
	const getTypeName = (id: string) =>
		typeAnimals.find(t => t.id === id)?.name || id;

	const getStatusName = (id: string) =>
		animalStatuses.find(s => s.id === id)?.name || id;

	return (
		<div className={styles.cards}>
			{animals.map(animal => (
				<AnimalCard
					key={animal.id}
					animal={animal}
					typeName={getTypeName(animal.typeAnimalId)}
					statusName={getStatusName(animal.animalStatusId)}
					onEdit={() => handleOpen(animal)}
					onDelete={() => handleDelete(animal.id)}
				/>
			))}
		</div>
	);
};