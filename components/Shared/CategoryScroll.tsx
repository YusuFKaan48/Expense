import React, {useEffect, useRef, useState} from 'react';
import {ScrollView, View, ActivityIndicator, LayoutChangeEvent, Dimensions} from 'react-native';
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
    const scrollViewRef = useRef<ScrollView>(null);
    const itemLayouts = useRef<Record<string, { x: number; width: number }>>({});
    const screenWidth = Dimensions.get('window').width;

    const fetchCategories = async () => {
        try {
            const api = await ApiService.getInstance();
            const response = await api.get('user/categories');
            if (Array.isArray(response)) {
                setCategories(response);
            } else {
                console.warn('Beklenmeyen kategori formatı:', response);
                setCategories([]);
            }
        } catch (error) {
            console.error('Kategori çekme hatası:', error);
            setCategories([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        if (!selectedCategory) return;

        const tryScrollToSelected = () => {
            const layout = itemLayouts.current[selectedCategory];
            if (!layout || !scrollViewRef.current) {
                setTimeout(tryScrollToSelected, 50);
                return;
            }

            const {x, width} = layout;
            const offset = x + width / 2 - screenWidth / 2;

            scrollViewRef.current.scrollTo({
                x: Math.max(0, offset),
                animated: true,
            });
        };

        tryScrollToSelected();
    }, [selectedCategory, categories]);

    if (loading) {
        return (
            <View className="my-4 h-16 justify-center items-center">
                <ActivityIndicator size="small" color="#000"/>
            </View>
        );
    }

    return (
        <View className="my-4 h-16 justify-center items-center relative">
            <LinearGradient
                colors={['white', 'rgba(255,255,255,0)']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                className="absolute left-0 top-0 bottom-0 w-20 z-10"
                pointerEvents="none"
            />
            <LinearGradient
                colors={['rgba(255,255,255,0)', 'white']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                className="absolute right-0 top-0 bottom-0 w-20 z-10"
                pointerEvents="none"
            />

            <ScrollView
                ref={scrollViewRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{gap: 12, paddingHorizontal: 164}}
            >
                {categories.map(({emoji, name, id}) => (
                    <View
                        key={id}
                        onLayout={(e: LayoutChangeEvent) => {
                            const layout = e.nativeEvent.layout;
                            itemLayouts.current[emoji] = {x: layout.x, width: layout.width};
                        }}
                    >
                        <CategoryItem
                            emoji={emoji}
                            name={name}
                            isSelected={selectedCategory === emoji}
                            onPress={() => onSelect({emoji, name})}
                        />
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}
