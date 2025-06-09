import config from '../api/config';

export interface TemporaryAccommodationRequest {
	dateAnimalCapture: string;
	dateAnimalReturn: string;
	userId: string;
	animalId: string;
}

export const getAllTemporaryAccommodations = async () => {
	const response = await fetch(
		`${config.api.baseUrl}${config.api.endpoints.temporaryAccommodations}`
	);

	return response.json();
};

export const createTemporaryAccommodation = async (
	temporaryAccommodationRequest: TemporaryAccommodationRequest
) => {
	await fetch(
		`${config.api.baseUrl}${config.api.endpoints.temporaryAccommodations}`,
		{
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify(temporaryAccommodationRequest),
		}
	);
};

export const updateTemporaryAccommodation = async (
	id: string,
	temporaryAccommodationRequest: TemporaryAccommodationRequest
) => {
	await fetch(
		`${config.api.baseUrl}${config.api.endpoints.temporaryAccommodations}/${id}`,
		{
			method: 'PUT',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify(temporaryAccommodationRequest),
		}
	);
};

export const deleteTemporaryAccommodation = async (id: string) => {
	await fetch(
		`${config.api.baseUrl}${config.api.endpoints.temporaryAccommodations}/${id}`,
		{
			method: 'DELETE',
		}
	);
};