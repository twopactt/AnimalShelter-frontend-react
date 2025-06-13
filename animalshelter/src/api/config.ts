declare const process: {
	env: {
		REACT_APP_API_BASE_URL: string;
		REACT_APP_API_UPLOAD_URL: string;

		REACT_APP_DEFAULT_USER_ROLE_ID: string;
		REACT_APP_VOLUNTEER_ROLE_ID: string;
		REACT_APP_EMPLOYEE_ROLE_ID: string;
		REACT_APP_ADMIN_ROLE_ID: string;

		REACT_APP_DEFAULT_STATUS_ADOPTION_ID: string;
		REACT_APP_APPROVED_STATUS_ADOPTION_ID: string;
		REACT_APP_REJECTED_STATUS_ADOPTION_ID: string;

		REACT_APP_DEFAULT_ANIMAL_STATUS_ID: string;
		REACT_APP_ADOPTED_ANIMAL_STATUS_ID: string;
		REACT_APP_BOOKED_ANIMAL_STATUS_ID: string;
		REACT_APP_FOSTER_CARE_ANIMAL_STATUS_ID: string;
		REACT_APP_UNDER_TREATMENT_ANIMAL_STATUS_ID: string;

		REACT_APP_DEFAULT_STATUS_TEMPORARY_ID: string;
		REACT_APP_APPROVED_STATUS_TEMPORARY_ID: string;
		REACT_APP_REJECTED_STATUS_TEMPORARY_ID: string;

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
			statusTemporaryAccommodations: '/StatusTemporaryAccommodations',
			roles: '/Roles',
			users: '/Users',
		},
		rolesId: {
			defaultUserId: process.env.REACT_APP_DEFAULT_USER_ROLE_ID,
			volunteerId: process.env.REACT_APP_VOLUNTEER_ROLE_ID,
			employeeId: process.env.REACT_APP_EMPLOYEE_ROLE_ID,
			adminId: process.env.REACT_APP_ADMIN_ROLE_ID,
		},
		statusAdoptionsId: {
			defaultStatusAdoptionId: process.env.REACT_APP_DEFAULT_STATUS_ADOPTION_ID,
			approvedId: process.env.REACT_APP_APPROVED_STATUS_ADOPTION_ID,
			rejectedId: process.env.REACT_APP_REJECTED_STATUS_ADOPTION_ID,
		},
		animalStatusesId: {
			defaultAnimalStatusId: process.env.REACT_APP_DEFAULT_ANIMAL_STATUS_ID,
			adoptedId: process.env.REACT_APP_ADOPTED_ANIMAL_STATUS_ID,
			bookedId: process.env.REACT_APP_BOOKED_ANIMAL_STATUS_ID,
			fosterCareId: process.env.REACT_APP_FOSTER_CARE_ANIMAL_STATUS_ID,
			underTreatmentId: process.env.REACT_APP_UNDER_TREATMENT_ANIMAL_STATUS_ID,
		},
		statusTemporaryAccommodationsId: {
			defaultStatusTemporaryAccommodationId: process.env.REACT_APP_DEFAULT_STATUS_TEMPORARY_ID,
			approvedId: process.env.REACT_APP_APPROVED_STATUS_TEMPORARY_ID,
			rejectedId: process.env.REACT_APP_REJECTED_STATUS_TEMPORARY_ID,
		},
	},
};

export default config;