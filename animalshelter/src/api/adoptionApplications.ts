import config from '../api/config';

export interface AdoptionApplicationRequest {
	applicationDate: string;
	comment?: string;
	userId: string;
	animalId: string;
	statusAdoptionId: string;
}

export const getAllAdoptionApplications = async () => {
	const response = await fetch(
		`${config.api.baseUrl}${config.api.endpoints.adoptionApplications}`
	);

	return response.json();
};

export const createAdoptionApplication = async (adoptionApplicationRequest: AdoptionApplicationRequest) => {
	const response = await fetch(`${config.api.baseUrl}${config.api.endpoints.adoptionApplications}`, {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
		},
		body: JSON.stringify(adoptionApplicationRequest),
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(errorText || 'Ошибка при создании заявки на усыновление');
	}

	return response.json();
};

export const updateAdoptionApplication = async (
	id: string,
	adoptionApplicationRequest: AdoptionApplicationRequest
) => {
	await fetch(`${config.api.baseUrl}${config.api.endpoints.adoptionApplications}/${id}`, {
		method: 'PUT',
		headers: {
			'content-type': 'application/json',
		},
		body: JSON.stringify(adoptionApplicationRequest),
	});
};

export const deleteAdoptionApplication = async (id: string) => {
	await fetch(`${config.api.baseUrl}${config.api.endpoints.adoptionApplications}/${id}`, {
		method: 'DELETE',
	});
};