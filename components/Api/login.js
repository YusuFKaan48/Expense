import { postRequest } from '../../helper/fetch';
import { getRequest } from '../../helper/fetch';

import AsyncStorage from '@react-native-async-storage/async-storage';

export async function loginUser(email, password) {
    try {
        const data = await postRequest({
            url: 'login',
            parameters: { email, password },
        });

        if (!data.token) throw new Error('Login failed');

        await AsyncStorage.setItem('userToken', data.token);

        const user = await getRequest('me');
        await AsyncStorage.setItem('userData', JSON.stringify(user));

        return data.token;
    } catch (error) {
        throw error;
    }
}
