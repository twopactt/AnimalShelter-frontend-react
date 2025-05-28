import config from '../api/config';

export interface AnimalStatusRequest {
	name: string;
}

export const getAllAnimalStatuses = async () => {
	const response = await fetch(
		`${config.api.baseUrl}${config.api.endpoints.animalStatuses}`
	);
	return response.json();
};