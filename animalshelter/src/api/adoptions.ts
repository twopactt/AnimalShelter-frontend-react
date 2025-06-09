import config from '../api/config';

export interface AdoptionRequest {
	applicationDate: string;
	userId: string;
	animalId: string;
}

export const getAllAdoptions = async () => {
	const response = await fetch(
		`${config.api.baseUrl}${config.api.endpoints.adoptions}`
	);

	return response.json();
};

export const createAdoption = async (adoptionRequest: AdoptionRequest) => {
	await fetch(`${config.api.baseUrl}${config.api.endpoints.adoptions}`, {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
		},
		body: JSON.stringify(adoptionRequest),
	});
};

export const updateAdoption = async (
	id: string,
	adoptionRequest: AdoptionRequest
) => {
	await fetch(`${config.api.baseUrl}${config.api.endpoints.adoptions}/${id}`, {
		method: 'PUT',
		headers: {
			'content-type': 'application/json',
		},
		body: JSON.stringify(adoptionRequest),
	});
};

export const deleteAdoption = async (id: string) => {
	await fetch(`${config.api.baseUrl}${config.api.endpoints.adoptions}/${id}`, {
		method: 'DELETE',
	});
};