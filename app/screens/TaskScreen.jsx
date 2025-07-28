import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import Button from '../../components/Shared/Button';
import CurrentTasks from '../../components/Main/Task/CurrentTasks';
import PostTasks from '../../components/Main/Task/PostTasks';
export default function TaskScreen() {

  const router = useRouter();

  return (
    <View className="flex-1 bg-[#F3F1EF]">
     <ScrollView className="bg-[#F3F1EF] pt-[64px] px-[32px]"
     contentContainerStyle={{ paddingBottom: 170 }}>
     <CurrentTasks />
     <PostTasks />
    </ScrollView>
     <Button
        word="Create a TaskScreen"
        onPress={() => router.replace('/task/createTask')}
       />
      </View>
  );
}
