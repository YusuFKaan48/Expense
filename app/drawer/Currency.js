import React from 'react';
import {SafeAreaView} from "react-native";
import CurrencyCreator from "../../components/Currency/CurrencyCreate";

export default function Profile() {
    return (
        <SafeAreaView className="flex-1 bg-white ">
            <CurrencyCreator/>
        </SafeAreaView>
    );
}
