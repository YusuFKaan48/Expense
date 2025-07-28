import AsyncStorage from '@react-native-async-storage/async-storage';

const apiBaseUrl = "http://192.168.31.61:8000/api/";

const getToken = async () => {
    return await AsyncStorage.getItem('userToken');
};

const getHeaders = async (isJson = true) => {
    const token = await getToken();
    const headers = {
        Accept: 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
    };
    if (isJson) {
        headers['Content-Type'] = 'application/json';
    }
    return headers;
};

export const getRequest = async (url) => {
    const headers = await getHeaders();
    const response = await fetch(`${apiBaseUrl}${url}`, {
        method: 'GET',
        headers,
    });
    return response.json();
};

export const postRequest = async ({ url, parameters, formData }) => {
    const isMultipart = !!formData;
    const headers = await getHeaders(!isMultipart);
    const response = await fetch(`${apiBaseUrl}${url}`, {
        method: 'POST',
        headers,
        body: isMultipart ? formData : JSON.stringify(parameters),
    });
    return response.json();
};

