import { View, Text, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import TaskCard from '../../Shared/Card';
import ApiService from '@/helper/fetch';

export default function CurrentTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const api = await ApiService.create();

      const response = await api.get('tasks/my');
      const activeTasks = (response.tasks || []).filter(
          task => task.pivot?.is_completed === 0
      );
      setTasks(activeTasks);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
      <View className="mb-4">
        <Text className="text-[24px] font-medium text-black mb-2">
          Current Tasks
        </Text>

        {loading ? (
            <ActivityIndicator size="large" color="#004030" />
        ) : (
            tasks.map(task => (
                <TaskCard
                    key={task.id}
                    id={task.id}
                    title={task.title}
                    author={task.creator?.name || 'Unknown'}
                    startDate={task.start_date}
                    endDate={task.end_date}
                    description={task.description}
                    onComplete={fetchTasks}
                />
            ))
        )}
      </View>
  );
}
