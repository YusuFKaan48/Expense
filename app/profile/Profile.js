import React from 'react';
import {View} from "react-native";
import ProfileScreen from "../../app/../components/Profile/ProfileScreen";

export default function Profile() {
    return (
        <View className="flex-1 bg-white px-4 pt-2 pb-2">
            <ProfileScreen  />
        </View>
    );
}
