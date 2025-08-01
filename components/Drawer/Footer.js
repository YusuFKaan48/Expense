import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from '@/components/Shared/Buton';

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

    return (
        <View className="flex items-center gap-4 px-4 py-6">
            <View>
                <Text className="font-medium text-[20px]">{user?.name ?? 'Kullanıcı'}</Text>
                <Text className="text-gray-500 text-[16px]">{user?.email ?? 'email@example.com'}</Text>
            </View>

            <View className="flex-row">
                <Button
                    label="Çıkış"
                    color="bg-red-500"
                    onPress={() => alert('Çıkış yapılıyor')}
                />
            </View>
        </View>
    );
}
