import { useRouter } from 'expo-router';
import { NavArrowLeft } from 'iconoir-react-native';
import { useState } from 'react';
import { Pressable, Text, View, Alert } from 'react-native';
import DateSelecter from '../../components/Main/Task/TaskCreator/DateSelecter';
import TaskInfo from '../../components/Main/Task/TaskCreator/TaskInfo';
import AssignTask from '../../components/Main/Task/TaskCreator/AssignTask';
import Button from '../../components/Shared/Button';
import { postRequest } from '@/helper/fetch';

export default function CreateTask() {
    const router = useRouter();
    const [taskTitle, setTaskTitle] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [assignedUsers, setAssignedUsers] = useState([]);
    const [isCreatePressed, setIsCreatePressed] = useState(false);

    const handleCreateTask = async () => {
        if (!taskTitle.trim()) {
            Alert.alert('Error', 'Please enter the task description.');
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
            const response = await postRequest({
                url: 'tasks',
                parameters: {
                    title: taskTitle,
                    description: taskDescription,
                    start_date: startDate,
                    end_date: endDate,
                    user_ids: assignedUsers,
                },
            });

            if (response.message) {
                Alert.alert('Success', response.message);
                router.replace('/screens/TaskScreen');
            } else {
                Alert.alert('Error', 'Task could not be created.');
            }
        } catch (error) {
            Alert.alert('Server Error', 'An error occurred while creating the task.');
        }
    };

    return (
        <View className="flex-1 bg-[#F3F1EF] px-8">
            <View className="absolute top-[60px] left-[24px]">
                <Pressable onPress={() => router.replace('/screens/TaskScreen')}>
                    <NavArrowLeft width={32} height={32} color="black" />
                </Pressable>
            </View>

            <View className="mt-[92px]">
                <Text style={{ fontFamily: 'CustomFont' }} className="text-[24px] font-medium text-black">
                    Task Creator
                </Text>
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
                <TaskInfo task={taskTitle} setTask={setTaskTitle} />

            </View>

            <View className="mt-[24px]">
                <TaskInfo task={taskDescription} setTask={setTaskDescription} />
            </View>

            <View className="mt-[24px]">
                <AssignTask
                    selectedEmployees={assignedUsers}
                    setSelectedEmployees={setAssignedUsers}
                />
            </View>

            <Button
                word="Send a task"
                onPress={handleCreateTask}
                onPressIn={() => setIsCreatePressed(true)}
                onPressOut={() => setIsCreatePressed(false)}
            />
        </View>
    );
}
