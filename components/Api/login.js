import ApiService from '@/helper/fetch';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function loginUser(email, password) {
    try {
        const api = new ApiService();
        await api.init();

        const data = await api.post({
            url: 'login',
            parameters: { email, password },
        });

        if (!data.token) throw new Error('Login failed');

        await AsyncStorage.setItem('userToken', data.token);

        const user = await api.get('me');
        await AsyncStorage.setItem('userData', JSON.stringify(user));

        return data.token;
    } catch (error) {
        throw error;
    }
}
