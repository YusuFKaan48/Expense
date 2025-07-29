import { View, Text, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import TaskCard from '../../Shared/Card';
import ApiService from '@/helper/fetch';
import EventEmitter from '@/helper/EventEmitter';

export default function ActiveTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    const api = new ApiService();
    await api.init();

    try {
      setLoading(true);
      const response = await api.get('tasks/my');
      const activeTasks = (response.tasks || []).filter(
          task => task.pivot?.is_completed === 0
      );
      setTasks(activeTasks);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();

    const subscription = EventEmitter.on('taskCompleted', () => {
      fetchTasks();
    });

    return () => {
      subscription.off();
    };
  }, []);

  return (
      <View>
        <Text className="text-[24px] font-jacques font-medium text-black mb-4">
          Active Tasks
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
                />
            ))
        )}
      </View>
  );
}
