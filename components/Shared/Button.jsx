import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

export default function Button({ word, onPress }) {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <View className="absolute bottom-[32px] left-[32px] right-[32px] ">
      <Pressable
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        onPress={onPress}
        className={`px-2 py-2 rounded-md items-center justify-center  rounded-xl shadow-md ${
          isPressed ? 'bg-[#004030]' : 'bg-[#4B9782]'
        }`}
      >
        <Text className="text-[24px] text-white font-medium">{word}</Text>
      </Pressable>
    </View>
  );
}
