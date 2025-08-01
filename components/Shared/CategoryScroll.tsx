import React, {useEffect, useState} from 'react';
import {ScrollView, View, ActivityIndicator} from 'react-native';
import CategoryItem from './CategoryItem';
import {LinearGradient} from 'expo-linear-gradient';
import ApiService from '@/helper/fetch';

type Category = {
    id: number;
    emoji: string;
    name: string;
};

type Props = {
    onSelect: (category: { emoji: string; name: string }) => void;
    selectedCategory: string | null;
};


export default function CategoryScroll({onSelect, selectedCategory}: Props) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);


    const fetchCategories = async () => {
        try {
            const api = await ApiService.getInstance();
            const response = await api.get('user/categories');

            if (Array.isArray(response)) {
                setCategories(response);
            } else {
                console.warn('Beklenmeyen kategori formatı:', response);
                setCategories([]); // default boş dizi
            }
        } catch (error) {
            console.error('Kategori çekme hatası:', error);
            setCategories([]); // hata durumunda da boş liste
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);


    if (loading) {
        return (
            <View className="my-4 h-16 justify-center items-center">
                <ActivityIndicator size="small" color="#000"/>
            </View>
        );
    }

    return (
        <View className="my-4 h-16">
            <LinearGradient
                colors={['white', 'rgba(255,255,255,0)']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: 80,
                    zIndex: 10,
                }}
                pointerEvents="none"
            />
            <LinearGradient
                colors={['rgba(255,255,255,0)', 'white']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    bottom: 0,
                    width: 80,
                    zIndex: 10,
                }}
                pointerEvents="none"
            />

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{gap: 12}}
            >
                {categories.map(({emoji, name, id}) => (
                    <CategoryItem
                        key={id}
                        emoji={emoji}
                        name={name}
                        isSelected={selectedCategory === emoji}
                        onPress={() => onSelect({emoji, name})}

                    />
                ))}
            </ScrollView>
        </View>
    );
}
