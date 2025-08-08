import React from 'react';
import {SafeAreaView} from "react-native";
import ProfileScreen from "../../components/Profile/ProfileScreen";

export default function Profile() {
    return (
        <SafeAreaView className="flex-1 bg-[#121826]">
            <ProfileScreen/>
        </SafeAreaView>
    );
}
