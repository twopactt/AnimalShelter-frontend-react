import axios from 'axios';
import config from '../api/config';

export interface LoginRequest {
    login: string;
    password: string;
}

export interface RegisterRequest {
    surname: string;
    name: string;
    patronymic?: string;
    dateOfBirth: string;
    phone: string;
    email: string;
    login: string;
    password: string;
    confirmPassword: string;
    roleId: string;
}

export interface User {
    id: string;
    surname: string;
    name: string;
    patronymic?: string;
    dateOfBirth: string;
    phone: string;
    email: string;
    login: string;
    roleId: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

const api = axios.create({
    baseURL: config.api.baseUrl,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }
});

api.interceptors.request.use(
    (config) => {
        console.log('Request URL:', config.url);
        console.log('Request Method:', config.method);
        console.log('Request Headers:', config.headers);
        console.log('Request Data:', config.data);
        const token = localStorage.getItem('token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        console.log('Response:', response);
        return response;
    },
    (error) => {
        console.error('Response error:', error);
        if (error.response) {
            console.error('Error data:', error.response.data);
            console.error('Error status:', error.response.status);
            console.error('Error headers:', error.response.headers);
        }
        return Promise.reject(error);
    }
);

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
    try {
        const response = await api.post<AuthResponse>('/Auth/login', data);
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        return response.data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

export const register = async (data: RegisterRequest): Promise<AuthResponse> => {
    try {
        const formattedData = {
            ...data,
            surname: data.surname.trim(),
            name: data.name.trim(),
            patronymic: data.patronymic ? data.patronymic.trim() : '',
            dateOfBirth: data.dateOfBirth,
            phone: data.phone.trim(),
            email: data.email.trim(),
            login: data.login.trim(),
            password: data.password.trim(),
            confirmPassword: data.confirmPassword.trim(),
            roleId: `${config.api.defaultRoleId}`
        };
        
        console.log('Register data:', formattedData);
        const response = await api.post<AuthResponse>('/Auth/register', formattedData);
        const { token, user } = response.data;
        
        if (token && user) {
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            return response.data;
        } else {
            throw new Error('Invalid response from server');
        }
    } catch (error) {
        console.error('Register error:', error);
        if (error && typeof error === 'object' && 'response' in error) {
            const axiosError = error as { response: { data: any; status: number } };
            console.error('Register error data:', axiosError.response.data);
            console.error('Register error status:', axiosError.response.status);
            console.error('Register error details:', JSON.stringify(axiosError.response.data, null, 2));
        }
        throw error;
    }
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

export const getCurrentUser = async (): Promise<User | null> => {
    try {
        const token = localStorage.getItem('token');
        console.log('Current token:', token);
        
        if (!token) {
            console.log('No token found');
            return null;
        }

        const userStr = localStorage.getItem('user');
        if (userStr) {
            console.log('Found user in localStorage:', userStr);
            return JSON.parse(userStr);
        }

        console.log('Fetching user from server...');
        const response = await api.get<User>('/Auth/current-user');
        console.log('Server response:', response.data);
        
        if (response.data) {
            localStorage.setItem('user', JSON.stringify(response.data));
            return response.data;
        }
        
        return null;
    } catch (error) {
        console.error('Get current user error:', error);
        return null;
    }
};

export const isAuthenticated = (): boolean => {
    const token = localStorage.getItem('token');
    console.log('Checking authentication, token exists:', !!token);
    return !!token;
}; 