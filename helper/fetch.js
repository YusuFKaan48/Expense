import AsyncStorage from '@react-native-async-storage/async-storage';

const apiBaseUrl = "http://192.168.31.61:8000/api/";

export default class ApiService {
    constructor() {
        this.baseUrl = apiBaseUrl;
        this.token = null;
    }

    async init() {
        this.token = await AsyncStorage.getItem('userToken');
    }

    getHeaders(isJson = true) {
        const headers = {
            Accept: 'application/json',
            ...(this.token && { Authorization: `Bearer ${this.token}` }),
        };
        if (isJson) {
            headers['Content-Type'] = 'application/json';
        }
        return headers;
    }

    async get(url) {
        const headers = this.getHeaders();
        const response = await fetch(`${this.baseUrl}${url}`, {
            method: 'GET',
            headers,
        });
        return response.json();
    }

    async post({ url, parameters, formData }) {
        const isMultipart = !!formData;
        const headers = this.getHeaders(!isMultipart);
        const response = await fetch(`${this.baseUrl}${url}`, {
            method: 'POST',
            headers,
            body: isMultipart ? formData : JSON.stringify(parameters),
        });
        return response.json();
    }
}
