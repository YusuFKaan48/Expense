import {Text, View} from 'react-native';
import { useFonts } from 'expo-font';
import React from 'react';

export default function Title({ title, user, rightStatus = false }) {
  const [fontsLoaded] = useFonts({
    'CustomFont': require('../../assets/fonts/JacquesFrancois-Regular.ttf'),
  });

  if (!fontsLoaded) return null;


  return (
      <View className="flex-row justify-between items-center">
        <Text
        style={{ fontFamily: 'CustomFont' }}
        className="text-[22px] font-regular text-black"
      >
        {title} {user}
      </Text>
      {(rightStatus) && <Text>Tümü</Text> }
      </View>
  );
}
