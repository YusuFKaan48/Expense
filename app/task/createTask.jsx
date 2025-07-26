import { useRouter } from 'expo-router';
import { NavArrowLeft } from 'iconoir-react-native';
import { useState } from 'react';
import {Pressable, Text, View } from 'react-native';
import DateSelecter from '../../components/Main/Task/TaskCreator/DateSelecter';
import Title from '../../components/Shared/Title'
import TaskInfo from '../../components/Main/Task/TaskCreator/TaskInfo';
import AssignTask from '../../components/Main/Task/TaskCreator/AssignTask';
import Button from '../../components/Shared/Button';

export default function CreateTask() {
  const router = useRouter();

  const [task, setTask] = useState('');

  const [isCreatePressed, setIsCreatePressed] = useState(false);

  return (
    <View className="flex-1 bg-[#F3F1EF] px-8">
      <View className="absolute top-[60px] left-[24px] ">
        <Pressable onPress={() => router.replace('/screens/task')}>
          <NavArrowLeft width={32} height={32} color="black" />
        </Pressable>
      </View>

     <View className="mt-[92px]">
     <Text style={{ fontFamily: 'CustomFont' }} className="text-[24px] font-medium text-black">Task Creator</Text>
     </View>

      <View className="mt-[24px]">
       </View>
      <DateSelecter />

      <View className="mt-[24px]">
      <TaskInfo task={task} setTask={setTask} />
      </View>

      

      <View className="mt-[24px]">
      <AssignTask />
       </View>
                  <Button
                 word="Send a task"
                 onPress={() => router.replace('/screens/task')}  
                 onPressIn={() => setIsCreatePressed(true)}
                 onPressOut={() => setIsCreatePressed(false)} 
               />
              
    </View>
  );
}
