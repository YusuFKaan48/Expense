import React, { useEffect, useState } from 'react';
import { Text, Pressable, ActionSheetIOS, Alert } from 'react-native';
import ApiService from '@/helper/fetch';

type Props = {
    currency: string;
    setCurrency: (value: string) => void;
};

export default function CurrencyPicker({ currency, setCurrency }: Props) {
    const [options, setOptions] = useState<string[]>(['₺']);

    const fetchCurrencies = async () => {
        try {
            const api = await ApiService.getInstance();
            const response = await api.get('user/currencies');

            if (Array.isArray(response) && response.every(item => typeof item === 'string')) {
                setOptions([...response, 'İptal']);
            } else {
                Alert.alert('Hata', 'Sunucudan geçersiz para birimi verisi alındı.');
            }
        } catch (error) {
            console.error('Para birimleri alınamadı:', error);
            Alert.alert('Hata', 'Para birimleri alınırken bir hata oluştu.');
        }
    };

    useEffect(() => {
        void fetchCurrencies();
    }, []);

    const showIOSPicker = () => {
        if (options.length === 0) {
            Alert.alert('Hata', 'Para birimi listesi yüklenemedi.');
            return;
        }

        const cancelButtonIndex = options.length - 1;

        ActionSheetIOS.showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex,
            },
            (buttonIndex) => {
                if (buttonIndex !== cancelButtonIndex) {
                    setCurrency(options[buttonIndex]);
                }
            }
        );
    };

    return (
        <Pressable onPress={showIOSPicker}>
            <Text className="text-[48px] text-[#ddd] text-right">{currency}</Text>
        </Pressable>
    );
}
