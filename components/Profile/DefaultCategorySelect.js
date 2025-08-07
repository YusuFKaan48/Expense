import React from 'react';
import {View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CategoryScroll from '@/components/Shared/CategoryScroll';

export const DefaultCategorySelect = ({defaultCategory, setDefaultCategory}) => {
    const handleSelect = async (category) => {
        try {
            setDefaultCategory(category);
            await AsyncStorage.setItem('defaultCategory', JSON.stringify(category));
            alert('Kategori kaydedildi.');
        } catch (error) {
            console.error('Kategori kaydedilirken hata:', error);
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
