import { useRouter } from 'expo-router';
import { NavArrowLeft } from 'iconoir-react-native';
import { useState } from 'react';
import { Pressable, Text, View, Alert, ScrollView } from 'react-native';
import DateSelecter from '../../components/Main/Task/TaskCreator/DateSelecter';
import TaskInfo from '../../components/Main/Task/TaskCreator/TaskInfo';
import AssignTask from '../../components/Main/Task/TaskCreator/AssignTask';
import Button from '../../components/Shared/Button';
import ApiService from '@/helper/fetch';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CreateTask() {
    const router = useRouter();
    const [taskTitle, setTaskTitle] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [assignedUsers, setAssignedUsers] = useState([]);
    const [isCreatePressed, setIsCreatePressed] = useState(false);

    const formatDate = (date) => {
        if (!date) return null;
        const d = new Date(date);
        return d.toISOString().split('T')[0];
    };

    const handleCreateTask = async () => {
        if (!taskTitle.trim()) {
            Alert.alert('Error', 'Please enter the task title.');
            return;
        }
        if (!taskDescription.trim()) {
            Alert.alert('Error', 'Please enter the task description.');
            return;
        }
        if (!startDate || !endDate) {
            Alert.alert('Error', 'Please select the start and end dates.');
            return;
        }
        if (assignedUsers.length === 0) {
            Alert.alert('Error', 'Please select at least one employee.');
            return;
        }

        try {
            const api = await ApiService.create();

            const response = await api.post({
                url: 'tasks',
                parameters: {
                    title: taskTitle,
                    description: taskDescription,
                    start_date: formatDate(startDate),
                    end_date: formatDate(endDate),
                    user_ids: assignedUsers,
                },
            });

            if (response.message) {
                Alert.alert('Success', response.message);
                router.replace('/screens/TaskScreen');
            } else if (response.errors) {
                const firstError = Object.values(response.errors)[0];
                Alert.alert('Validation Error', firstError?.toString() || 'Invalid data.');
            } else {
                Alert.alert('Error', 'Task could not be created.');
            }
        } catch (error) {
            Alert.alert('Server Error', 'An error occurred while creating the task.');
            console.error('Create task error:', error);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-[#F3F1EF]">
            <ScrollView contentContainerStyle={{ paddingHorizontal: 32, paddingBottom: 100 }}>

                <View className="absolute top-[0px] left-[24px] z-10">
                    <Pressable onPress={() => router.replace('/screens/TaskScreen')}>
                        <NavArrowLeft width={32} height={32} color="black" />
                    </Pressable>
                </View>

                <View className="mt-[32px]">
                    <Text className="text-[24px] font-medium text-black">Task Creator</Text>
                </View>

                <View className="mt-[24px]">
                    <DateSelecter
                        selectedStartDate={startDate}
                        selectedEndDate={endDate}
                        onDateChange={(start, end) => {
                            setStartDate(start);
                            setEndDate(end);
                        }}
                    />
                </View>

                <View className="mt-[24px]">
                    <TaskInfo
                        title={taskTitle}
                        setTitle={setTaskTitle}
                        description={taskDescription}
                        setDescription={setTaskDescription}
                    />
                </View>

                <View className="mt-[24px]">
                    <AssignTask
                        selectedEmployees={assignedUsers}
                        setSelectedEmployees={setAssignedUsers}
                    />
                </View>
            </ScrollView>

            <View className="absolute bottom-5 w-full">
                <Button
                    word="Send a task"
                    onPress={handleCreateTask}
                    onPressIn={() => setIsCreatePressed(true)}
                    onPressOut={() => setIsCreatePressed(false)}
                />
            </View>
        </SafeAreaView>
    );
}
