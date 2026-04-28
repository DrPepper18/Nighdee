import axios from 'axios';


const api = axios.create({
    baseURL: '/api/',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('jwt');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (
            error.response?.status === 401 && 
            !originalRequest._retry && 
            !originalRequest.url.includes('/auth/refresh')
        ) {
            originalRequest._retry = true;
            try {
                const response = await api.get('/auth/refresh', { withCredentials: true });

                const newAccessToken = response.data.token;
                localStorage.setItem('jwt', newAccessToken);
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

                return api(originalRequest);
                
            } catch (refreshError) {
                localStorage.removeItem('jwt');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);


const withErrorHandling = (fn) => {
    return async (...args) => {
        try {
            return await fn(...args);
        } catch (error) {
            console.error('Error:', error.response?.data || error.message);
            throw error;
        }
    }
}


export const userRequest = class {
    static register = withErrorHandling(async (user) => {
        const response = await api.post('/auth/register', user, { withCredentials: true });
        localStorage.setItem('jwt', response.data.token);
    });

    static login = withErrorHandling(async (email, password) => {
        const response = await api.post('/auth/login', { email, password }, { withCredentials: true });
        localStorage.setItem('jwt', response.data.token);
    });

    static getInfo = withErrorHandling(async () => {
        const response = await api.get('/auth/');
        return response.data;
    });

    static updateInfo = withErrorHandling(async (name, birthdate) => {
        const response = await api.patch('/auth/', {name, birthdate});
        return response.data;
    });

    static delete = withErrorHandling(async () => {
        const response = await api.delete('/auth/', { withCredentials: true });
        localStorage.clear();
        return response.data;
    });
}


export const eventRequest = class {
    static getAll = withErrorHandling(async () => {
        const response = await api.get('/event/');
        return response.data;
    });

    static create = withErrorHandling(async (eventData) => {
        await api.post('/event/', eventData);
        window.location.href = '/';
    });
}


export const bookingRequest = class {
    static join = withErrorHandling(async (event_id) => {
        await api.post(`/book/${event_id}`);
    });

    static cancel = withErrorHandling(async (event_id) => {
        await api.delete(`/book/${event_id}`);
    });
    
    static checkStatus = withErrorHandling(async (event_id) => {
        const response = await api.get(`/book/${event_id}`);
        return response.data.is_joined;
    });
};
