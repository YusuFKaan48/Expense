import React, {forwardRef} from 'react';
import {Pressable, Text} from 'react-native';

type CategoryItemProps = {
    emoji: string;
    name: string;
    isSelected: boolean;
    onPress: () => void;
    size?: number;
};

const CategoryItem = forwardRef<any, CategoryItemProps>(
    ({emoji, name, isSelected, onPress, size = 32}, ref) => {
        return (
            <Pressable
                ref={ref}
                onPress={onPress}
                className={`w-14 h-14 justify-center items-center mx-1 ${
                    isSelected ? 'bg-gray-800 border-gray-900 rounded-xl border' : ''
                }`}
            >
                <Text style={{fontSize: size}}>{emoji}</Text>
            </Pressable>
        );
    }
);

CategoryItem.displayName = 'CategoryItem';

export default CategoryItem;
