import React from 'react';
import { View, Text, Pressable } from 'react-native';

export default function WhiteInfoCard({title, value, extra = null, buttonText, onPress, variant = 'basic',}) {
    return (
        <View className="items-center w-full mt-4">
            <Text className="text-[24px] font-medium text-black ">{title}</Text>

            <View className="bg-white p-4 rounded-xl shadow-sm mb-2 mt-2 w-full flex-row justify-between items-center">
                <View className="flex-1">
                    <Text className="text-[18px] text-black mt-1.5">{value}</Text>

                    {variant === 'withExtra' && extra && (
                        <Text className="text-[16px]  mt-1">{extra}</Text>
                    )}
                </View>

                {variant === 'withButton' && buttonText && (
                    <Pressable
                        onPress={onPress}
                        className="px-4 py-2 rounded-xl items-center justify-center bg-[#4B9782]"
                    >
                        <Text className="text-white">{buttonText}</Text>
                    </Pressable>
                )}
            </View>
        </View>
    );
}
