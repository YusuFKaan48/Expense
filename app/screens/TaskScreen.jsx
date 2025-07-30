import { useRouter } from 'expo-router';
import { ScrollView, View } from 'react-native';
import Button from '../../components/Shared/Button';
import CurrentTasks from '../../components/Main/Task/CurrentTasks';
import PostTasks from '../../components/Main/Task/PostTasks';
export default function TaskScreen() {

  const router = useRouter();

  return (
    <View>
     <ScrollView className="bg-[#F3F1EF] pt-[8px] px-[32px]"
     contentContainerStyle={{ paddingBottom: 100 }}>
     <CurrentTasks />
     <PostTasks />
    </ScrollView>
     <Button
        word="Create a Task"
        onPress={() => router.replace('/task/createTask')}
       />
      </View>
  );
}
