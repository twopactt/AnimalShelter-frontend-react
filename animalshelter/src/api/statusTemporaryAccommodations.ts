import config from '../api/config';

export interface StatusTemporaryAccommodationRequest {
	name: string;
}

export const getAllStatusTemporaryAccommodations = async () => {
	const response = await fetch(
		`${config.api.baseUrl}${config.api.endpoints.statusTemporaryAccommodations}`
	);

	return response.json();
};