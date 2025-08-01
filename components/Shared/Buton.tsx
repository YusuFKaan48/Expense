import { Pressable, Text } from 'react-native';
import React from 'react';

type ButtonProps = {
    label: string;
    color: string;
    onPress: () => void;
};

export default function Button({ label ,color, onPress }: ButtonProps) {
    return (
        <Pressable
            onPress={onPress}
            className={`py-4 px-4 flex-1 rounded-xl items-center ${color}`}
        >
            <Text className="text-white text-[24px] font-semibold">{label}</Text>
        </Pressable>
    );
}
