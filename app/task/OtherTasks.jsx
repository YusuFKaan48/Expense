import { View} from 'react-native';
import PostTasks from '../../components/Main/Task/PostTasks';   
import CurrentTasks from '../../components/Main/Task/CurrentTasks';


export default function OtherTasks() {
  return (
    <View className="flex-1  bg-[#F3F1EF] px-8">
      <View className="mt-[20px]">
      <CurrentTasks />
      <PostTasks />
     
      </View>
    </View>
  );
}