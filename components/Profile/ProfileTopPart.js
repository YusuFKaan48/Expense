import React from 'react';
import {View, Text} from 'react-native';
export const ProfileTopPart = ({name, email}) => {
    return (
        <View className="gap-1">
            <Text className="text-[32px] font-semibold text-gray-800">{name}</Text>
            <Text className="text-[24px] text-gray-500">{email}</Text>
        </View>
    );
};
