import React from 'react';
import {View, Text} from 'react-native';
export const ProfileTopPart = ({name, email}) => {
    return (
        <View className="gap-1">
            <Text className="text-[24px]  text-white">{name}</Text>
            <Text className="text-[24px] text-white">{email}</Text>
        </View>
    );
};
