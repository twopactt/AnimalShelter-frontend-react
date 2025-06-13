import config from '../api/config';

export interface TemporaryAccommodationRequest {
	dateAnimalCapture: string;
	dateAnimalReturn: string;
	userId: string;
	animalId: string;
	statusTemporaryAccommodationId: string;
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
	data: Partial<TemporaryAccommodationRequest>
) => {
	const response = await fetch(
		`${config.api.baseUrl}${config.api.endpoints.temporaryAccommodations}/${id}`,
		{
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		}
	);
	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(errorText || 'Ошибка при обновлении передержки');
	}
};

export const deleteTemporaryAccommodation = async (id: string) => {
	await fetch(
		`${config.api.baseUrl}${config.api.endpoints.temporaryAccommodations}/${id}`,
		{
			method: 'DELETE',
		}
	);
};