import React, { useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function Profile() {
    const router = useRouter();
    const [user, setUser] = useState(null);


        const fetchUser = async () => {
            try {
                const userData = await AsyncStorage.getItem('userData');
                if (userData) {
                    setUser(JSON.parse(userData));
                }
            } catch (error) {
                console.error('Failed to load user data:', error);
            }
        };

    useEffect(() => {
        fetchUser();
    }, []);

    if (!user) {
        return (
            <View className="flex-1 justify-center items-center bg-white px-8 py-4">
                <Text>Kullanıcı bilgileri yükleniyor...</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 justify-center items-center bg-white px-8 py-4 gap-4">
            <Text className="text-xl font-semibold text-gray-800">{user.name}</Text>
            <Text className="text-base text-gray-600">{user.email}</Text>

            <Pressable
                className="bg-gray-700 px-5 py-3 rounded"
                onPress={() => router.back()}
            >
                <Text className="text-white text-base">Geri Dön</Text>
            </Pressable>
        </View>
    );
}
