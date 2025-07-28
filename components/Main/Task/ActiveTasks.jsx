import { View, Text, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import TaskCard from '../../Shared/Card';
import { getRequest } from '@/helper/fetch';

export default function ActiveTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await getRequest('tasks/my');
      const activeTasks = (response.tasks || []).filter(
          task => task.pivot?.is_completed === 0
      );

      setTasks(activeTasks);
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
        <Text style={{ fontFamily: 'CustomFont' }} className="text-[24px] font-medium text-black mb-4">
          Active Tasks
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
                />
            ))
        )}
      </View>
  );
}
