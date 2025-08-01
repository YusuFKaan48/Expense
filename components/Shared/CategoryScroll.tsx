import React from 'react';
import { ScrollView, View } from 'react-native';
import CategoryItem from './CategoryItem';
import { LinearGradient } from 'expo-linear-gradient';

const emojiCategories = [
    { emoji: '📚', name: 'Kitap' },
    { emoji: '🛒', name: 'Market' },
    { emoji: '💰', name: 'Gelir' },
    { emoji: '🚗', name: 'Ulaşım' },
    { emoji: '💻', name: 'PC' },
    { emoji: '🍔', name: 'Yemek' },
    { emoji: '🎁', name: 'Hediye' },
    { emoji: '✂', name: 'Taksit' },
];

type Props = {
    onSelect: (categoryName: string) => void;
    selectedCategory: string | null;
};

export default function CategoryScroll({ onSelect, selectedCategory }: Props) {
    return (
        <View className="my-4 h-16">
            <LinearGradient
                colors={['white', 'rgba(255,255,255,0)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
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
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
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
                contentContainerStyle={{ gap: 12 }}
            >
                {emojiCategories.map(({ emoji, name }) => (
                    <CategoryItem
                        key={name}
                        emoji={emoji}
                        name={name}
                        isSelected={selectedCategory === name}
                        onPress={() => onSelect(name)}
                    />
                ))}
            </ScrollView>
        </View>
    );
}
