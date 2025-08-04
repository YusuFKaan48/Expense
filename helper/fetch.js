import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://192.168.31.226:8000/api/';

class ApiService {
    static instance = null;

    static async getInstance() {
        if (!ApiService.instance) {
            const token = await AsyncStorage.getItem('userToken');
            ApiService.instance = new ApiService(token);
        }
        return ApiService.instance;
    }

    constructor(token) {
        if (ApiService.instance) {
            throw new Error('Use ApiService.getInstance() instead of new.');
        }
        this.token = token;
    }

    static resetInstance() {
        this.instance = null;
    }


    getHeaders(isForm = false) {
        const headers = {
            Accept: 'application/json',
            ...(this.token && {Authorization: `Bearer ${this.token}`}),
        };

        if (!isForm) {
            headers['Content-Type'] = 'application/json';
        }

        return headers;
    }

    async get(url) {
        const response = await fetch(`${API_BASE_URL}${url}`, {
            method: 'GET',
            headers: this.getHeaders(),
        });
        return response.json();
    }

    async post({url, parameters, formData}) {
        const headers = this.getHeaders(!!formData);
        const body = formData ? formData : JSON.stringify(parameters);

        const response = await fetch(`${API_BASE_URL}${url}`, {
            method: 'POST',
            headers,
            body,
        });
        return response.json();
    }

    static clearInstance() {
        ApiService.instance = null;
    }
}

export default ApiService;
