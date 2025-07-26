import { View, Text } from 'react-native';
import { useState } from 'react';
import TaskCard from '../../Shared/Card'; 

export default function ActiveTasks() {
  const [tasks] = useState([
    {
      id: 1,
      title: 'Finish the project',
      author: 'Yusuf Kaan USTA',
      startDate: '12/12/2023',
      endDate: '12/12/2024',
      description: 'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source.'
    },
    {
      id: 2,
      title: 'Redesign',
      author: 'Yiğit',
      startDate: '12/12/2023',
      endDate: '12/12/2024',
      description: 'aaaa'
    },
    {
      id: 3,
      title: 'Meeting planning',
      author: 'Orhan',
      startDate: '12/12/2023',
      endDate: '12/12/2024',
      description: 'bbbbb'
    },
  ]);


  return (
    <View>
      <Text style={{ fontFamily: 'CustomFont' }} className="text-[24px] font-medium text-black mb-4">Active Tasks</Text>
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          id={task.id}
          title={task.title}
          author={task.author}
          startDate={task.startDate}
          endDate={task.endDate}
          description={task.description}
        />
      ))}
    </View>
  );
}
