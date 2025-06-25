import config from '../api/config';

export interface RoleRequest {
	name: string;
}

export const getAllRoles = async () => {
	const response = await fetch(
		`${config.api.baseUrl}${config.api.endpoints.roles}`
	);

	return response.json();
};