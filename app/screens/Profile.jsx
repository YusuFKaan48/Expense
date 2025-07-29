import React from 'react';
import { ScrollView, View} from 'react-native';
import ProfileTopPart from '../../components/Main/Profile/ProfileTopPart';
import ProfileBottomPart from "@/components/Main/Profile/ProfileBottomPart";

export default function Profile() {
  return (
      <>
        <ScrollView className="flex-1 bg-[#F3F1EF] pt-[8px] px-[32px] ">
          <View>
            <ProfileTopPart />
            <ProfileBottomPart />
          </View>
        </ScrollView>
      </>
  );
}
