export interface User {
	id: string;
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