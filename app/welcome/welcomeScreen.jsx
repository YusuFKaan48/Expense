import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, Text, View } from 'react-native';
import Button from '../../components/Shared/Button';
export default function WelcomeScreen() {

  const router = useRouter();
  const [isPressed, setIsPressed] = useState(false);

return (
<View className="flex-1 items-center justify-center bg-[#F3F1EF]">
      <View className="flex-row space-x-4 mb-6">
        <Image
          source={require('../../assets/images/adam2.png')}
          className="w-45 h-90"
        />
        <Image
          source={require('../../assets/images/kadın2.png')}
          className="w-45 h-90"
        />
      </View>

      <Text className="text-[24px] font-medium text-black mb-4">
        Welcome again!
      </Text>    

      <Button word="Log In" onPress={() => router.replace('/login')}
                onPressIn={() => setIsPressed(true)}
                onPressOut={() => setIsPressed(false)}
       />
    </View>
)

}
