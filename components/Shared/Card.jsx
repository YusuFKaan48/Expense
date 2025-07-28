import { Pressable, Text, TouchableOpacity, View } from 'react-native';
import { Check } from 'iconoir-react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { postRequest } from '@/helper/fetch';
import EventEmitter from '@/helper/EventEmitter';

export default function TaskCard({ id, title, author, startDate, endDate, description, completed = false, onComplete = () => {} }) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCompleteTask = async () => {
        try {
            setIsSubmitting(true);
            const response = await postRequest({ url: `tasks/${id}/complete` });
            console.log('Task completed:', response.message);
            await onComplete();
            EventEmitter.emit('taskCompleted');
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <TouchableOpacity
            onPress={() => router.push({ pathname: '/task/taskTopTabs', params: { id, title, author, startDate, endDate, description } })}
        >
            <View className="bg-white p-4 rounded-xl shadow-sm flex mb-2 mt-2">
                <View className="flex-row justify-between items-center">
                    <View>
                        <Text className="text-[18px] font-regular text-black">{title}</Text>
                        <Text className="text-[14px] font-regular text-black mt-1.5">Sent by {author}</Text>
                        <Text className="text-[12px] font-regular mt-1.5 text-[#717073]">{startDate} - {endDate}</Text>
                    </View>
                    <Pressable
                        onPress={e => {
                            e.stopPropagation();
                            if (!isSubmitting && !completed) handleCompleteTask(); // tamamlandıysa disable et
                        }}
                        className={`w-10 h-10 rounded-full items-center justify-center ${completed ? 'bg-[#004030]' : 'bg-[#F3F1EF]'}`}
                    >
                        <Check width={24} height={24} color={completed ? '#4B9782' : '#717171'} />
                    </Pressable>
                </View>
            </View>
        </TouchableOpacity>
    );
}

