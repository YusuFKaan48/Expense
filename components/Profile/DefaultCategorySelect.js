import React from 'react';
import { View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CategoryScroll from '@/components/Shared/CategoryScroll';
import Toast from 'react-native-toast-message';

export const DefaultCategorySelect = ({ defaultCategory, setDefaultCategory }) => {
    const handleSelect = async (category) => {
        try {
            setDefaultCategory(category);
            await AsyncStorage.setItem('defaultCategory', JSON.stringify(category));
            Toast.show({
                type: 'success',
                text1: 'Kategori kaydedildi.',
            });
        } catch (error) {
            console.error('Kategori kaydedilirken hata:', error);
            Toast.show({
                type: 'error',
                text1: 'Hata',
                text2: 'Kategori kaydedilemedi.',
            });
        }
    };

    return (
        <View>
            <CategoryScroll
                onSelect={handleSelect}
                selectedCategory={defaultCategory?.emoji ?? null}
            />
        </View>
    );
};
