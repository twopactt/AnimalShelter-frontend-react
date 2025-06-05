import config from "../api/config";

export interface AnimalStatus {
	id: string;
	name: string;
}

export const getAllAnimalStatuses = async (): Promise<AnimalStatus[]> => {
	const response = await fetch(
		`${config.api.baseUrl}${config.api.endpoints.animalStatuses}`
	);

	return response.json();
};