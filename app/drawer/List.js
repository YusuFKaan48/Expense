import React from 'react';
import {View} from "react-native";
import ListPage from "../../app/../components/List/ListPage";

export default function Home() {
    return (
        <View className="flex-1 bg-white px-4 pt-2 pb-2">
            <ListPage/>
        </View>
    );
}
