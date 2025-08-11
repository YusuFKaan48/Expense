import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useRouter} from 'expo-router';
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
            <View className="flex-1 justify-center items-center">
                <Text>Kullanıcı bilgileri yükleniyor...</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 justify-between">
            <View className="flex-1  px-4 py-2">
                <View className="gap-2 flex-1">

                    <View className='border-b border-gray-600'>

                    <Text className="text-[24px] text-white font-semibold mb-2">Profil bilgileri</Text>

                    <ProfileTopPart name={user.name} email={user.email}/>

                    </View>

                    <View className='border-b border-gray-600'>

                    <Text className="text-[24px] text-white">Varsayılan Kategori</Text>

                    <DefaultCategorySelect
                        defaultCategory={defaultCategory}
                        setDefaultCategory={setDefaultCategory}
                    />

                    </View>

                    <View className='border-b border-gray-600'>

                    <Text className="text-[24px] text-white">Varsayılan Para Birimi</Text>

                    <DefaultCurrencySelect
                        defaultCurrency={defaultCurrency}
                        setDefaultCurrency={setDefaultCurrency}
                    />

                    </View>
                </View>

            </View>
        </View>
    );
}