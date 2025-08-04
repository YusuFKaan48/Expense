import React, {useEffect, useState} from 'react';
import {View, Text, Alert} from 'react-native';
import Button from '@/components/Shared/Buton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiService from '@/helper/fetch';
import { router } from 'expo-router';

export default function Footer() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const jsonValue = await AsyncStorage.getItem('userData');
                if (jsonValue != null) {
                    setUser(JSON.parse(jsonValue));
                }
            } catch (e) {
                console.error('Error loading user data:', e);
            }
        };
        fetchUserData();
    }, []);

    const logout = async () => {
        try {
            const api = await ApiService.getInstance();

            await api.post('logout', {});

            await AsyncStorage.removeItem('userToken');
            await AsyncStorage.removeItem('userData');

            ApiService.resetInstance();

            router.replace('/login/Login');
        } catch (error) {
            console.error('Logout error:', error);
            Alert.alert('Logout Failed', 'An error occurred during logout.');
        }
    };


    return (
        <View className="flex gap-4 px-4 py-6">
            <View>
                <Text className="font-medium text-[20px]">{user?.name ?? 'Kullanıcı'}</Text>
                <Text className="text-gray-500 text-[16px]">{user?.email ?? 'email@example.com'}</Text>
            </View>

            <View className="flex-row">
                <Button
                    label="Çıkış"
                    color="bg-red-500"
                    onPress={logout}
                />
            </View>
        </View>
    );
}
