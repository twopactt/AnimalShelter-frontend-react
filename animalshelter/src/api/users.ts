import config from '../api/config';

export interface UserRequest {
	surname: string;
	name: string;
	patronymic?: string;
	dateOfBirth: string;
	phone: string;
	email: string;
	login: string;
	password: string;
	roleId: string;
}

export const getAllUsers = async () => {
	const response = await fetch(
		`${config.api.baseUrl}${config.api.endpoints.users}`
	);

	return response.json();
};

export const createUser = async (userRequest: UserRequest) => {
	await fetch(`${config.api.baseUrl}${config.api.endpoints.users}`, {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
		},
		body: JSON.stringify(userRequest),
	});
};

export const updateUser = async (
	id: string,
	userRequest: UserRequest
) => {
	await fetch(`${config.api.baseUrl}${config.api.endpoints.users}/${id}`, {
		method: 'PUT',
		headers: {
			'content-type': 'application/json',
		},
		body: JSON.stringify(userRequest),
	});
};

export const deleteUser = async (id: string) => {
	await fetch(`${config.api.baseUrl}${config.api.endpoints.users}/${id}`, {
		method: 'DELETE',
	});
};

export const updateUserRole = async (userId: string, newRoleId: string) => {
	const userResponse = await fetch(
		`${config.api.baseUrl}${config.api.endpoints.users}/${userId}`
	);
	const userData = await userResponse.json();

	const updatedUser = {
		...userData,
		roleId: newRoleId,
	};

	const response = await fetch(
		`${config.api.baseUrl}${config.api.endpoints.users}/${userId}`,
		{
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(updatedUser),
		}
	);

	if (!response.ok) {
		throw new Error('Ошибка при обновлении роли пользователя');
	}

	return response.json();
};