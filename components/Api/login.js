import ApiService from '@/helper/fetch';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function loginUser(email, password) {
    try {
        const tempApi = new ApiService(null);

        const loginResponse = await tempApi.post({
            url: 'login',
            parameters: {email, password},
        });

        console.log('loginResponse raw:', loginResponse);

        const token = loginResponse?.token;
        if (!token) throw new Error('Login failed: Token not received');

        await AsyncStorage.setItem('userToken', token);

        ApiService.resetInstance();
        const api = await ApiService.getInstance();

        const userResponse = await api.get('me');

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
