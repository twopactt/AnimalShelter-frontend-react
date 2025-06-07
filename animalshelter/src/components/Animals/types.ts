export enum Mode {
	Create = 'Create',
	Edit = 'Edit',
}

export type AnimalGender = 'Мальчик' | 'Девочка';

export interface AnimalFormState {
	name: string;
	gender: AnimalGender | null;
	age: number;
	description: string;
	typeAnimalId: string;
	animalStatusId: string;
}