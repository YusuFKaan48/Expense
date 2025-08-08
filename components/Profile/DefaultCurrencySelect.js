import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, View, Text, Pressable, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiService from '@/helper/fetch';
import Toast from 'react-native-toast-message';
import {LinearGradient} from "expo-linear-gradient";

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
                Toast.show({
                    type: 'error',
                    text1: 'Hata',
                    text2: 'Para birimleri geçersiz formatta geldi.',
                });
            }
        } catch (error) {
            console.error('Para birimleri alınamadı:', error);
            Toast.show({
                type: 'error',
                text1: 'Hata',
                text2: 'Para birimleri alınırken bir hata oluştu.',
            });
        }
    };

    useEffect(() => {
        fetchCurrencyOptions();
    }, []);

    const scrollToSelected = () => {
        if (!defaultCurrency || !scrollViewRef.current) return;

        const layout = itemLayouts.current[defaultCurrency];

        if (!layout) {
            setTimeout(scrollToSelected, 50);
            return;
        }

        const { x, width } = layout;
        const offset = x + width / 2 - screenWidth / 2 + 16;

        scrollViewRef.current.scrollTo({
            x: Math.max(0, offset),
            animated: true,
        });
    };

    useEffect(() => {
        scrollToSelected();
    }, [defaultCurrency, currencyOptions]);

    const handleSelect = async (val) => {
        setDefaultCurrency(val);
        await AsyncStorage.setItem('defaultCurrency', val);
        Toast.show({
            type: 'success',
            text1: 'Kaydedildi',
            text2: 'Varsayılan para birimi kaydedildi.',
        });
    };

    return (
        <View className="h-16 justify-center items-center relative">
            <LinearGradient
                colors={['#121826', 'rgba(18, 24, 38, 0)']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: 40,
                    zIndex: 10,
                }}
                pointerEvents="none"
            />
            <LinearGradient
                colors={['rgba(18, 24, 38, 0)', '#121826' ]}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    bottom: 0,
                    width: 40,
                    zIndex: 10,
                }}
                pointerEvents="none"
            />

            <ScrollView
                ref={scrollViewRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 12, paddingHorizontal: 80 }}
            >
                {currencyOptions.map((currency) => (
                    <View
                        key={currency}
                        onLayout={(e) => {
                            const layout = e.nativeEvent.layout;
                            itemLayouts.current[currency] = {
                                x: layout.x,
                                width: layout.width,
                            };
                        }}
                    >
                        <Pressable
                            onPress={() => handleSelect(currency)}
                            className={`px-4 py-2 rounded-full border border-gray-600 ${
                                defaultCurrency === currency
                                    ? 'bg-blue-400 border-blue-800'
                                    : ''
                            }`}
                        >
                            <Text className="text-[20px] font-medium text-gray-800 text-white">{currency}</Text>
                        </Pressable>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}
