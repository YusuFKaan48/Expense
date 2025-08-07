import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, ScrollView } from 'react-native';
import Button from '@/components/Shared/Buton';
import ApiService from '@/helper/fetch';
import Toast from 'react-native-toast-message';

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
        <View className="p-4 bg-white px-4 py-2 gap-3">
            <Text className="text-[24px]">Ekli Para Birimleri</Text>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 12, alignItems: 'center' }}
            >
                {currencies.map((currency, index) => (
                    <View
                        key={index}
                        className="px-4 py-2 rounded-full border border-gray-300 bg-gray-100"
                        style={{ marginRight: index === currencies.length - 1 ? 0 : 12 }}
                    >
                        <Text className="text-[24px]">{currency}</Text>
                    </View>
                ))}
            </ScrollView>

            <View className="gap-4">
                <Text className="text-[24px]">Yeni Para Birimi Ekle</Text>

                <TextInput
                    value={newCurrency}
                    onChangeText={setNewCurrency}
                    placeholder="₹"
                    className="border border-gray-300 rounded-lg px-4 py-2 text-[24px]"
                />

                <Button
                    label={loading ? 'Ekleniyor...' : 'Ekle'}
                    color="bg-green-500"
                    onPress={addCurrency}
                    disabled={loading}
                />
            </View>
        </View>
    );
}
