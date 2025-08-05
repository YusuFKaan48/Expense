import React, {useEffect, useState} from 'react';
import {View, Text, SafeAreaView, ActionSheetIOS} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useRouter} from 'expo-router';
import Button from '@/components/Shared/Buton';
import CategoryScroll from '@/components/Shared/CategoryScroll';

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

    const handleSelectCategory = async (category) => {
        setDefaultCategory(category);
        await AsyncStorage.setItem('defaultCategory', JSON.stringify(category));
    };

    const handleCurrencySelect = () => {
        const options = ['₺', '$', '€', '£', '¥', 'İptal'];
        const cancelButtonIndex = options.length - 1;

        ActionSheetIOS.showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex,
            },
            async (buttonIndex) => {
                if (buttonIndex !== cancelButtonIndex) {
                    const selected = options[buttonIndex];
                    setDefaultCurrency(selected);
                    await AsyncStorage.setItem('defaultCurrency', selected);
                }
            }
        );
    };

    if (!user) {
        return (
            <View className="flex-1 justify-center items-center bg-white px-8 py-4">
                <Text>Kullanıcı bilgileri yükleniyor...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 justify-between  bg-white">
            <View className="flex-1  ">
                <View className="gap-6 flex-1">
                    <View className="gap-1">
                        <Text className="text-[32px] font-semibold text-gray-800">{user.name}</Text>
                        <Text className="text-[24px]  text-gray-500">{user.email}</Text>
                    </View>

                    <View className="gap-1">
                        <Text className=" font-medium text-[20px] text-gray-700">Varsayılan Kategori:</Text>
                        <CategoryScroll
                            onSelect={handleSelectCategory}
                            selectedCategory={defaultCategory?.emoji ?? null}
                        />
                    </View>

                    <View className="flex-1 gap-2">
                        <Text className=" font-medium  text-[20px] text-gray-700">Varsayılan Para Birimi:</Text>
                        <Button
                            label={`Para birimi: ${defaultCurrency}`}
                            color="bg-blue-500"
                            onPress={handleCurrencySelect}
                        />
                    </View>

                </View>

                <Button
                    label="Geri Dön"
                    color="bg-green-500"
                    onPress={() => router.back()}
                />
            </View>
        </SafeAreaView>
    );
}