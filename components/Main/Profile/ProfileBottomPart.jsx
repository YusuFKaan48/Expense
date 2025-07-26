import Id from '../../Main/Profile/Id';
import AddPdf from '../../Main/Profile/AddPdf';
import Address from '../../Main/Profile/Address';
import RelativeInfo from '../../Main/Profile/RelativeInfo';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View } from 'react-native';

export default function ProfileBottomPart() {
    return (
        <>
            <View className="bg-[#F3F1EF] items-center flex-1 w-full" >
                    <Id />
                    <AddPdf />
                    <Address />
                    <RelativeInfo />
                </View>
            <StatusBar style="auto" />
        </>
    );
}
