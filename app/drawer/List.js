import React from 'react';
import {SafeAreaView} from "react-native";
import ListPage from "../../components/List/ListPage";

export default function List() {
    return (
        <SafeAreaView className="flex-1 bg-white ">
            <ListPage/>
        </SafeAreaView>
    );
}
