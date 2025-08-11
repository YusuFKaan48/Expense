import React, {useEffect, useRef, useState} from 'react';
import {
    ScrollView,
    View,
    ActivityIndicator,
    LayoutChangeEvent,
    Dimensions,
    NativeSyntheticEvent,
    NativeScrollEvent,
    Animated,
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

    const scales = useRef<Record<string, Animated.Value>>({}).current;

    useEffect(() => {
        categories.forEach(cat => {
            if (!scales[cat.emoji]) {
                scales[cat.emoji] = new Animated.Value(cat.emoji === selectedCategory ? 1 : 0.8);
            }
        });
    }, [categories, scales, selectedCategory]);

    useEffect(() => {
        if (!focusedCategory) return;

        categories.forEach(cat => {
            const toValue = cat.emoji === focusedCategory ? 1 : 0.7;
            if (scales[cat.emoji]) {
                Animated.timing(scales[cat.emoji], {
                    toValue,
                    duration: 300,
                    useNativeDriver: true,
                }).start();
            }
        });
    }, [focusedCategory, categories, scales]);

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
                onMomentumScrollEnd={() => {
                    if (focusedCategory) {
                        const cat = categories.find(c => c.emoji === focusedCategory);
                        if (cat) onSelect({emoji: cat.emoji, name: cat.name});
                    }
                }}
            >
                {categories.map(({emoji, name, id}) => {
                    const scale = scales[emoji] || new Animated.Value(0.8);

                    return (
                        <Animated.View
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
                                size={32}
                                onPress={() => onSelect({emoji, name})}
                            />
                        </Animated.View>
                    );
                })}
            </ScrollView>
        </View>
    );
}
