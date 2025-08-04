import React, {forwardRef} from 'react';
import {Pressable, Text} from 'react-native';

type CategoryItemProps = {
    emoji: string;
    name: string;
    isSelected: boolean;
    onPress: () => void;
};

const CategoryItem = forwardRef<any, CategoryItemProps>(
    ({emoji, name, isSelected, onPress}, ref) => {
        return (
            <Pressable
                ref={ref}
                onPress={onPress}
                className={`w-14 h-14 justify-center items-center mx-1 ${
                    isSelected ? 'bg-blue-100 border-blue-500 rounded-xl border' : ''
                }`}
            >
                <Text className="text-2xl">{emoji}</Text>
            </Pressable>
        );
    }
);

CategoryItem.displayName = 'CategoryItem';

export default CategoryItem;
