import {Pressable, Text} from 'react-native';
import React from 'react';

type ButtonProps = {
    label: string;
    onPress: () => void;
    color?: string;
    disabled?: boolean;
};

export default function Button({label, color, onPress, disabled}: ButtonProps) {
    return (
        <Pressable
            onPress={onPress}
            className={`py-4 px-4 flex-1 rounded-xl items-center max-h-16 min-h-16 ${color}`}
        >
            <Text className="text-white text-[24px] font-semibold">{label}</Text>
        </Pressable>
    );
}
