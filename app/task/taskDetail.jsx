import { useLocalSearchParams } from 'expo-router';
import { View, Text } from 'react-native';
  import { ScrollView } from 'react-native';

export default function TaskDetail() {
  const { id, title, author, startDate, endDate, description } = useLocalSearchParams();
  return (

    <ScrollView className="flex-1  bg-[#F3F1EF] px-8">
      <View className="mt-[20px]">
      <Text className="text-[24px] font-medium ">{title}</Text>
      <View className="bg-white p-4 rounded-xl shadow-sm flex mb-2 mt-2">
      <Text className="text-[18px] text-black ">{description}</Text>
      <Text className="text-base mb-1 mt-4">Sent by: {author}</Text>
      <Text className="text-sm text-gray-500 mb-3">{startDate} - {endDate}</Text>
      </View>
      </View>
    </ScrollView>
  );
}
