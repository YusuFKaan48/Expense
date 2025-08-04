import {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ActionSheetIOS} from 'react-native';

export default function useCurrency() {
    const [currency, setCurrency] = useState('₺');

    useEffect(() => {
        const loadCurrency = async () => {
            const storedCurrency = await AsyncStorage.getItem('defaultCurrency');
            if (storedCurrency) {
                setCurrency(storedCurrency);
            }
        };
        loadCurrency();
    }, []);

    const selectCurrency = () => {
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
                    setCurrency(selected);
                    await AsyncStorage.setItem('defaultCurrency', selected);
                }
            }
        );
    };

    return {currency, selectCurrency};
}
