import React from 'react';
import NumPad from "../..//components/Home/NumPad";
import {View} from "react-native";

export default function Home() {
    return (
        <View className="flex-1 bg-[#121826] px-4 pt-2 pb-2">
            <NumPad/>
        </View>
    );
}
