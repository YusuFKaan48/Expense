import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, View, Text, Pressable, Dimensions, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiService from '@/helper/fetch';

export function DefaultCurrencySelect({ defaultCurrency, setDefaultCurrency }) {
    const scrollViewRef = useRef(null);
    const itemLayouts = useRef({});
    const screenWidth = Dimensions.get('window').width;
    const [currencyOptions, setCurrencyOptions] = useState([]);

    const fetchCurrencyOptions = async () => {
        try {
            const api = await ApiService.getInstance();
            const response = await api.get('user/currencies');

            if (Array.isArray(response) && response.every(item => typeof item === 'string')) {
                setCurrencyOptions(response);
            } else {
                Alert.alert('Hata', 'Para birimleri geçersiz formatta geldi.');
            }
        } catch (error) {
            console.error('Para birimleri alınamadı:', error);
            Alert.alert('Hata', 'Para birimleri alınırken bir hata oluştu.');
        }
    };

    useEffect(() => {
        fetchCurrencyOptions();
    }, []);

    useEffect(() => {
        const layout = itemLayouts.current[defaultCurrency];
        if (!layout || !scrollViewRef.current) return;

        const { x, width } = layout;
        const offset = x + width / 2 - screenWidth / 2 + 20;

        scrollViewRef.current.scrollTo({
            x: Math.max(0, offset),
            animated: true,
        });
    }, [defaultCurrency, currencyOptions]);

    const handleSelect = async (val) => {
        setDefaultCurrency(val);
        await AsyncStorage.setItem('defaultCurrency', val);
        Alert.alert('Kaydedildi', 'Varsayılan para birimi kaydedildi.');
    };

    return (
        <View className="h-16 justify-center items-center relative">
            <ScrollView
                ref={scrollViewRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 12, paddingHorizontal: 177 }}
            >
                {currencyOptions.map((currency) => (
                    <View
                        key={currency}
                        onLayout={(e) => {
                            const layout = e.nativeEvent.layout;
                            itemLayouts.current[currency] = { x: layout.x, width: layout.width };
                        }}
                    >
                        <Pressable
                            onPress={() => handleSelect(currency)}
                            className={`px-4 py-2 rounded-full border ${
                                defaultCurrency === currency
                                    ? 'bg-blue-200 border-blue-500'
                                    : 'bg-gray-100 border-gray-300'
                            }`}
                        >
                            <Text className="text-[20px] font-medium text-gray-800">{currency}</Text>
                        </Pressable>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}
