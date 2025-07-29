import { View, Text, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import TaskCard from '../../Shared/Card';
import ApiService from '@/helper/fetch';

export default function PostTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const api = await ApiService.create();
      setLoading(true);
      const response = await api.get('tasks/my');
      const postTasks = (response.tasks || []).filter(
          task => task.pivot?.is_completed === 1
      );
      setTasks(postTasks);
    } catch (error) {
      console.error('An error occurred while fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();

  }, []);

  return (
      <View>
        <Text className="text-[24px] font-medium text-black mb-2">
          Post Tasks
        </Text>

        {loading ? (
            <ActivityIndicator size="large" color="#004030" />
        ) : (
            tasks.map((task) => (
                <TaskCard
                    key={task.id}
                    id={task.id}
                    title={task.title}
                    author={task.creator?.name || 'Unknown'}
                    startDate={task.start_date}
                    endDate={task.end_date}
                    description={task.description}
                    completed={task.pivot?.is_completed === 1}
                    onComplete={fetchTasks}
                />
            ))
        )}
      </View>
  );
}
