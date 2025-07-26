import AsyncStorage from '@react-native-async-storage/async-storage';

 // const apiBaseUrl = "http://192.168.31.61:8000/api/";

const apiBaseUrl = "http://192.168.1.109:8000/api/";

const getToken = async () => {
    return await AsyncStorage.getItem('userToken');
};

export const postRequest = async ({ url, parameters }) => {
    const token = await getToken();

    const response = await fetch(`${apiBaseUrl}${url}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(parameters),
    });

    return response.json();
};

export const getRequest = async (url) => {
    const token = await getToken();

    const response = await fetch(`${apiBaseUrl}${url}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
        },
    });

    return response.json();
};

export const postMultipartRequest = async ({ url, formData }) => {
    const token = await getToken();

    const headers = {
        Accept: 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
    };

    const response = await fetch(`${apiBaseUrl}${url}`, {
        method: 'POST',
        headers,
        body: formData,
    });

    return response.json();
};
