import config from '../api/config';

export interface StatusAdoptionRequest {
	name: string;
}

export const getAllStatusAdoptions = async () => {
	const response = await fetch(
		`${config.api.baseUrl}${config.api.endpoints.statusAdoptions}`
	);

	return response.json();
};