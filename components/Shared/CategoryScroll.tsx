import React, {useEffect, useRef, useState} from 'react';
import {
    ScrollView,
    View,
    ActivityIndicator,
    LayoutChangeEvent,
    Dimensions,
    NativeSyntheticEvent,
    NativeScrollEvent
} from 'react-native';
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

    const [focusedCategory, setFocusedCategory] = useState<string | null>(selectedCategory);

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
            const offset = x + width / 2 - screenWidth / 2 + 15;

            scrollViewRef.current.scrollTo({
                x: Math.max(0, offset),
                animated: true,
            });

            setFocusedCategory(selectedCategory);
        };
        tryScrollToSelected();
    }, [selectedCategory, categories]);

    const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const scrollX = event.nativeEvent.contentOffset.x;
        let closestCategory: string | null = null;
        let closestDistance = Number.MAX_VALUE;

        for (const [emoji, layout] of Object.entries(itemLayouts.current)) {
            const itemCenter = layout.x + layout.width / 2;
            const screenCenter = scrollX + screenWidth / 2;
            const distance = Math.abs(itemCenter - screenCenter);

            if (distance < closestDistance) {
                closestDistance = distance;
                closestCategory = emoji;
            }
        }

        if (closestCategory !== focusedCategory) {
            setFocusedCategory(closestCategory);
        }
    };

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
                colors={['rgba(18, 24, 38, 1)', 'rgba(18, 24, 38, 0)']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: 150,
                    zIndex: 10,
                }}
                pointerEvents="none"
            />
            <LinearGradient
                colors={['rgba(18, 24, 38, 0)', 'rgba(18, 24, 38, 1)']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    bottom: 0,
                    width: 150,
                    zIndex: 10,
                }}
                pointerEvents="none"
            />

            <ScrollView
                ref={scrollViewRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{gap: 12, paddingHorizontal: 150}}
                onScroll={onScroll}
                scrollEventThrottle={16}
                onMomentumScrollEnd={(e) => {
                    if (focusedCategory) {
                        const cat = categories.find(c => c.emoji === focusedCategory);
                        if (cat) onSelect({emoji: cat.emoji, name: cat.name});
                    }
                }}
            >
                {categories.map(({emoji, name, id}, index) => {
                    let fontSize = 16;
                    let scale = 0.8;

                    if (emoji === focusedCategory) {
                        fontSize = 32;
                        scale = 1;
                    } else {
                        const focusedIndex = categories.findIndex(c => c.emoji === focusedCategory);
                        if (focusedIndex !== -1) {
                            const distance = Math.abs(index - focusedIndex);
                            if (distance === 1) {
                                fontSize = 24;
                                scale = 0.9;
                            }
                        }
                    }

                    return (
                        <View
                            key={id}
                            onLayout={(e: LayoutChangeEvent) => {
                                const layout = e.nativeEvent.layout;
                                itemLayouts.current[emoji] = {x: layout.x, width: layout.width};
                            }}
                            style={{
                                transform: [{scale}],
                            }}
                        >
                            <CategoryItem
                                emoji={emoji}
                                name={name}
                                isSelected={emoji === selectedCategory}
                                size={fontSize}
                                onPress={() => onSelect({emoji, name})}
                            />
                        </View>
                    );
                })}
            </ScrollView>
        </View>
    );
}
