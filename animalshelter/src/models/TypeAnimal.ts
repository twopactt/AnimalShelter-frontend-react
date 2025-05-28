import config from '../api/config';

export interface TypeAnimal {
	id: string;
	name: string;
}

export const getAllTypeAnimals = async (): Promise<TypeAnimal[]> => {
	const response = await fetch(
		`${config.api.baseUrl}${config.api.endpoints.typeAnimals}`
	);
  
	return response.json();
};