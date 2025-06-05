import config from '../api/config';

export interface AnimalRequest {
	name: string;
	gender: string;
	age: number;
	description: string;
	photo: string;
	typeAnimalId: string;
	animalStatusId: string;
}

export const getAllAnimals = async () => {
	const response = await fetch(
		`${config.api.baseUrl}${config.api.endpoints.animals}`
	);

	return response.json();
};

export const createAnimal = async (animalRequest: AnimalRequest) => {
	await fetch(`${config.api.baseUrl}${config.api.endpoints.animals}`, {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
		},
		body: JSON.stringify(animalRequest),
	});
};

export const updateAnimal = async (
	id: string,
	animalRequest: AnimalRequest
) => {
	await fetch(`${config.api.baseUrl}${config.api.endpoints.animals}/${id}`, {
		method: 'PUT',
		headers: {
			'content-type': 'application/json',
		},
		body: JSON.stringify(animalRequest),
	});
};

export const deleteAnimal = async (id: string) => {
	await fetch(`${config.api.baseUrl}${config.api.endpoints.animals}/${id}`, {
		method: 'DELETE',
	});
};