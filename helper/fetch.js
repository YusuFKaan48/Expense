import AsyncStorage from '@react-native-async-storage/async-storage';

const apiBaseUrl = "http://192.168.31.61:8000/api/";

export default class ApiService {
    constructor(token) {
        this.baseUrl = apiBaseUrl;
        this.token = token;
        this.headers = {
            Accept: 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            'Content-Type': 'application/json',
        };
    }

    static async create() {
        const token = await AsyncStorage.getItem('userToken');
        return new ApiService(token);
    }

    async get(url) {
        console.log('Headers in get:', this.headers);
        const response = await fetch(`${this.baseUrl}${url}`, {
            method: 'GET',
            headers: this.headers,
        });

        const responseJson = await response.json();
        console.log(`GET ${url} response:`, responseJson);

        return responseJson;
    }


    async post({ url, parameters, formData }) {
        let headers = this.headers;
        let body = JSON.stringify(parameters);

        if (formData) {
            headers = {
                Accept: 'application/json',
                ...(this.token && { Authorization: `Bearer ${this.token}` }),
            };
            body = formData;
        }

        const response = await fetch(`${this.baseUrl}${url}`, {
            method: 'POST',
            headers,
            body,
        });

        return response.json();
    }
}
