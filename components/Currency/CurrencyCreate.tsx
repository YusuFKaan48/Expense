import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, ScrollView } from 'react-native';
import Button from '@/components/Shared/Buton';
import ApiService from '@/helper/fetch';
import Toast from 'react-native-toast-message';
import {LinearGradient} from "expo-linear-gradient";

export default function CurrencyCreator() {
    const [currencies, setCurrencies] = useState<string[]>([]);
    const [newCurrency, setNewCurrency] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchCurrencies = async () => {
        try {
            const api = await ApiService.getInstance();
            const response = await api.get('user/currencies');

            if (Array.isArray(response) && response.every(item => typeof item === 'string')) {
                setCurrencies(response);
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Hata',
                    text2: 'Sunucudan geçersiz veri alındı.',
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

    const addCurrency = async () => {
        const symbol = newCurrency.trim();

        if (!symbol) {
            Toast.show({
                type: 'error',
                text1: 'Hata',
                text2: 'Lütfen bir para birimi sembolü girin.',
            });
            return;
        }

        if (currencies.includes(symbol)) {
            Toast.show({
                type: 'info',
                text1: 'Zaten mevcut',
                text2: 'Bu para birimini zaten eklediniz.',
            });
            return;
        }

        try {
            setLoading(true);
            const api = await ApiService.getInstance();
            const response = await api.post({
                url: 'user/currencies',
                parameters: { symbol },
            });

            if (response?.symbol) {
                setCurrencies(prev => [...prev, response.symbol]);
                setNewCurrency('');
                Toast.show({
                    type: 'success',
                    text1: 'Başarılı',
                    text2: 'Yeni para birimi eklendi.',
                });
            } else if (response?.message === 'Zaten mevcut.') {
                Toast.show({
                    type: 'info',
                    text1: 'Zaten mevcut',
                    text2: 'Bu para birimini zaten eklediniz.',
                });
            } else {
                console.log('API cevabı:', response);
                Toast.show({
                    type: 'error',
                    text1: 'Hata',
                    text2: 'Para birimi eklenemedi.',
                });
            }
        } catch (error) {
            console.error('Ekleme hatası:', error);
            Toast.show({
                type: 'error',
                text1: 'Hata',
                text2: 'Sunucu hatası.',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCurrencies();
    }, []);

    return (
        <View className="p-4 px-4 py-2 gap-3">
            <Text className="text-[24px] text-white">Ekli Para Birimleri</Text>

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
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 12, alignItems: 'center' }}
            >
                {currencies.map((currency, index) => (
                    <View
                        key={index}
                        className="px-4 py-2 rounded-full"
                        style={{ marginRight: index === currencies.length - 1 ? 0 : 12 }}
                    >
                        <Text className="text-[24px] text-white">{currency}</Text>
                    </View>
                ))}
            </ScrollView>

            </View>

            <View className="gap-4">
                <Text className="text-[24px] text-white">Yeni Para Birimi Ekle</Text>

                <TextInput
                    value={newCurrency}
                    onChangeText={setNewCurrency}
                    placeholder="₹"
                    placeholderTextColor="#9CA3AF"
                    className="border-b border-gray-300 rounded-lg px-4 py-2 text-[24px]"
                />

                <Button
                    label={loading ? 'Ekleniyor...' : 'Ekle'}
                    color="bg-green-600"
                    onPress={addCurrency}
                    disabled={loading}
                />
            </View>
        </View>
    );
}
