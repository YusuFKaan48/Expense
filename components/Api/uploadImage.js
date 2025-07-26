import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://192.168.31.61:8000/api';

// Get token from AsyncStorage
export async function getToken() {
    return await AsyncStorage.getItem('userToken');
}

// Fetch user information
export async function fetchUser() {
    const token = await getToken();
    if (!token) throw new Error('Token not found');

    const response = await fetch(`${API_BASE_URL}/me`, {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch user data');
    }

    const data = await response.json();
    return data;
}

// Upload image
export async function uploadImage(uri) {
    const token = await getToken();
    if (!token) throw new Error('Token not found');

    const localUri =
        uri.startsWith('file://') || uri.startsWith('content://') ? uri : 'file://' + uri;

    const formData = new FormData();
    formData.append('image', {
        uri: localUri,
        name: 'photo.jpg',
        type: 'image/jpeg',
    });

    const response = await fetch(`${API_BASE_URL}/upload-image`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });

    const text = await response.text();
    let data;
    try {
        data = JSON.parse(text);
    } catch {
        throw new Error('Failed to parse server response');
    }

    if (!response.ok) {
        throw new Error(data.message || 'Upload failed');
    }

    return data.url; // returned URL
}
