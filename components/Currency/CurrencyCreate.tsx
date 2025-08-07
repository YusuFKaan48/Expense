import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, ScrollView, Alert } from 'react-native';
import Button from '@/components/Shared/Buton';
import ApiService from '@/helper/fetch';

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
                Alert.alert('Hata', 'Sunucudan geçersiz veri alındı.');
            }
        } catch (error) {
            console.error('Para birimleri alınamadı:', error);
            Alert.alert('Hata', 'Para birimleri alınırken bir hata oluştu.');
        }
    };

    const addCurrency = async () => {
        const symbol = newCurrency.trim();

        if (!symbol) {
            Alert.alert('Hata', 'Lütfen bir para birimi sembolü girin.');
            return;
        }

        if (currencies.includes(symbol)) {
            Alert.alert('Zaten mevcut', 'Bu para birimini zaten eklediniz.');
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
                Alert.alert('Başarılı', 'Yeni para birimi eklendi.');
            } else if (response?.message === 'Zaten mevcut.') {
                Alert.alert('Zaten mevcut', 'Bu para birimini zaten eklediniz.');
            } else {
                console.log('API cevabı:', response);
                Alert.alert('Hata', 'Para birimi eklenemedi.');
            }
        } catch (error) {
            console.error('Ekleme hatası:', error);
            Alert.alert('Hata', 'Sunucu hatası.');
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

            <View className='gap-4'>
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
