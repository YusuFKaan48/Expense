import {useEffect} from 'react';
import {useRouter} from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Index() {
    const router = useRouter();

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                if (token) {
                    router.replace('/drawer/Home');
                } else {
                    router.replace('/login/Login');
                }
            } catch (error) {
                console.error('Token kontrol hatası:', error);
                router.replace('/login/Login');
            }
        };

        checkLoginStatus();
    }, [router]);

    return null; // Boş render, sadece yönlendirme yapılıyor
}
