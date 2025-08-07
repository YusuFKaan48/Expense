import React, { useEffect, useState } from 'react';
import { Text, Pressable, ActionSheetIOS } from 'react-native';
import ApiService from '@/helper/fetch';
import Toast from 'react-native-toast-message';

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
                Toast.show({
                    type: 'error',
                    text1: 'Hata',
                    text2: 'Sunucudan geçersiz para birimi verisi alındı.',
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
        void fetchCurrencies();
    }, []);

    const showIOSPicker = () => {
        if (options.length === 0) {
            Toast.show({
                type: 'error',
                text1: 'Hata',
                text2: 'Para birimi listesi yüklenemedi.',
            });
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
