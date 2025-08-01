import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

export default function Profile() {
    const router = useRouter();

    const user = {
        name: 'Yusuf Kaan Usta',
        email: 'yusufkaan@example.com',
    };

    return (
        <View className="flex-1 justify-center items-center bg-white px-8 py-8">
            <Text className="text-xl font-semibold text-gray-800 mb-1">{user.name}</Text>
            <Text className="text-base text-gray-600 mb-6">{user.email}</Text>

            <Pressable
                className="bg-gray-700 px-5 py-3 rounded"
                onPress={() => router.back()}
            >
                <Text className="text-white text-base">Geri Dön</Text>
            </Pressable>
        </View>
    );
}
