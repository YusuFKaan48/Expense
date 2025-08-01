import React from 'react';
import { Pressable, Text } from 'react-native';

type CategoryItemProps = {
    emoji: string;
    name: string;
    isSelected: boolean;
    onPress: () => void;
};

export default function CategoryItem({emoji, isSelected, onPress,}: CategoryItemProps) {
    return (
        <Pressable
            onPress={onPress}
            className={`w-14 h-14  justify-center items-center mx-1 ${
                isSelected ? 'bg-blue-100 border-blue-500 rounded-xl border'  : ''
            }`}
        >
            <Text className="text-2xl">{emoji}</Text>

        </Pressable>
    );
}
