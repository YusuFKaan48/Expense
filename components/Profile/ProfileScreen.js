import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useRouter} from 'expo-router';
import Button from '@/components/Shared/Buton';
import {DefaultCurrencySelect} from "./DefaultCurrencySelect";
import {DefaultCategorySelect} from './DefaultCategorySelect';
import {ProfileTopPart} from './ProfileTopPart';

export default function ProfileScreen() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [defaultCurrency, setDefaultCurrency] = useState('₺');
    const [defaultCategory, setDefaultCategory] = useState(null);

    const fetchUser = async () => {
        try {
            const userData = await AsyncStorage.getItem('userData');
            const currency = await AsyncStorage.getItem('defaultCurrency');
            const category = await AsyncStorage.getItem('defaultCategory');

            if (userData) setUser(JSON.parse(userData));
            if (currency) setDefaultCurrency(currency);
            if (category) setDefaultCategory(JSON.parse(category));
        } catch (error) {
            console.error('Veriler yüklenemedi:', error);
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
        <View className="flex-1 justify-between  bg-white">
            <View className="flex-1  px-4 pt-2 pb-2">
                <View className="gap-2 flex-1">
                    <ProfileTopPart name={user.name} email={user.email}/>

                    <Text className="font-medium text-[20px] text-gray-700">Varsayılan kategori ve Para birimi seçimi</Text>

                    <DefaultCategorySelect
                        defaultCategory={defaultCategory}
                        setDefaultCategory={setDefaultCategory}
                    />

                    <DefaultCurrencySelect
                        defaultCurrency={defaultCurrency}
                        setDefaultCurrency={setDefaultCurrency}
                    />
                </View>

                <Button
                    label="Geri Dön"
                    color="bg-green-500"
                    onPress={() => router.back()}
                />
            </View>
        </View>
    );
}