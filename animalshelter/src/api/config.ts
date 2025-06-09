declare const process: {
	env: {
		REACT_APP_API_BASE_URL: string;
		REACT_APP_API_UPLOAD_URL: string;
		REACT_APP_DEFAULT_USER_ROLE_ID: string;
		[key: string]: string;
	};
};

const config = {
	api: {
		baseUrl: process.env.REACT_APP_API_BASE_URL || '',
		upload: {
			baseUrl: process.env.REACT_APP_API_UPLOAD_URL || '',
			endpoints: {
				uploadPhoto: '/upload-photo',
				deletePhoto: '/delete-photo',
			},
		},
		endpoints: {
			animals: '/Animals',
			animalStatuses: '/AnimalStatuses',
			typeAnimals: '/TypeAnimals',
			adoptions: '/Adoptions',
			adoptionApplications: '/AdoptionApplications',
			statusAdoptions: '/StatusAdoptions',
			temporaryAccommodations: '/TemporaryAccommodations',
			roles: '/Roles',
			users: '/Users',
		},
		defaultRoleId: process.env.REACT_APP_DEFAULT_USER_ROLE_ID,
	},
};

export default config;