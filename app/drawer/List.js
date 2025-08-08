import React from 'react';
import ListPage from "../../components/List/ListPage";
import {View} from "react-native";

export default function List() {
    return (
        <View className="flex-1 bg-[#121826] px-4 pt-2 pb-2">
        <ListPage/>
        </View>
    );
}
