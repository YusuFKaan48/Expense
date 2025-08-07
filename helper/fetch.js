import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://192.168.31.226:8000/api/';

if (!global.__apiInstance__) {
    global.__apiInstance__ = null;
}

class ApiService {
    constructor(token) {
        this.token = token;
    }

    static async getInstance() {
        if (!global.__apiInstance__) {
            const token = await AsyncStorage.getItem('userToken');
            global.__apiInstance__ = new ApiService(token);
        }
        return global.__apiInstance__;
    }

    static resetInstance() {
        global.__apiInstance__ = null;
    }

    getHeaders(isForm = false) {
        const headers = {
            Accept: 'application/json',
            ...(this.token ? {Authorization: `Bearer ${this.token}`} : {}),
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
}

export default ApiService;
