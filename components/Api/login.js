import ApiService from '@/helper/fetch';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function loginUser(email, password) {
    try {
        const api = new ApiService();

        const loginResponse = await api.post({
            url: 'login',
            parameters: { email, password },
        });

        const token = loginResponse?.token;
        if (!token) throw new Error('Login failed: Token not received');

        await AsyncStorage.setItem('userToken', token);

        const authorizedApi = await ApiService.create();

        const userResponse = await authorizedApi.get('me');

        if (userResponse?.user) {
            await AsyncStorage.setItem('userData', JSON.stringify(userResponse.user));
        } else {
            throw new Error('User info could not be fetched');
        }

        return token;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}
