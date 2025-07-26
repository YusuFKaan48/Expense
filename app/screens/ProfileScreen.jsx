import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ScrollView, View} from 'react-native';
import ProfileTopPart from '../../components/Main/Profile/ProfileTopPart';
import ProfileBottomPart from "@/components/Main/Profile/ProfileBottomPart";

export default function ProfileScreen() {
  return (
      <>
        <ScrollView className="flex-1 bg-[#F3F1EF] pt-[64px] px-[32px] ">
          <View className="bg-[#F3F1EF] items-center">
            <ProfileTopPart />
            <ProfileBottomPart />
          </View>
        </ScrollView>
        <StatusBar style="auto" />
      </>
  );
}
