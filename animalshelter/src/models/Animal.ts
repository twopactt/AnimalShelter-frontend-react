export interface Animal {
	id: string;
	name: string;
	gender: 'Мальчик' | 'Девочка';
	age: number;
	description: string;
	photo: string;
	typeAnimalId: string;
	animalStatusId: string;
}