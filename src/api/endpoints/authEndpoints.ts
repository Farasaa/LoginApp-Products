import apiClient from '../client/apiClient';

interface LoginRequest {
    username: string;
    password: string;
}

interface LoginResponse {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    gender: string;
    image: string;
    accessToken: string;
    refreshToken: string;
    role: string;
}

interface ValidateSessionResponse {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    gender: string;
    image: string;
    role: string;
}

interface UserProfileResponse {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    gender: string;
    image: string;
    role: string;
    age: number;
    phone: string;
    birthDate: string;
    bloodGroup: string;
    height: number;
    weight: number;
    eyeColor: string;
}

export const authEndpoints = {
    login: async (request: LoginRequest): Promise<LoginResponse> => {
        const response = await apiClient.post<LoginResponse>('/auth/login', {
            username: request.username,
            password: request.password,
            expiresInMins: 30,
        });
        return response.data;
    },

    validateSession: async (): Promise<ValidateSessionResponse> => {
        const response = await apiClient.get<ValidateSessionResponse>('/auth/me');
        return response.data;
    },

    getUserById: async (userId: number): Promise<UserProfileResponse> => {
        const response = await apiClient.get<UserProfileResponse>(`/users/${userId}`);
        return response.data;
    },
};

export type { LoginRequest, LoginResponse, ValidateSessionResponse, UserProfileResponse };

export const login = authEndpoints.login;
export const validateSession = authEndpoints.validateSession;
export const getUserById = authEndpoints.getUserById;