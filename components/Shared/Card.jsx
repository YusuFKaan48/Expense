import { useRouter } from 'expo-router';
import { Check } from 'iconoir-react-native';
import { useState } from 'react';
import { Pressable, Text, View, TouchableOpacity } from 'react-native';


export default function TaskCard({ id, title, author, startDate, endDate, description }) {
  const router = useRouter();
  const [isCheckPressed, setIsCheckPressed] = useState(false);

  return (
    <TouchableOpacity
      onPress={() =>
        router.push({
         // pathname: '/task/taskDetail',
         pathname: '/task/TaskTopTabs',
          params: {
            id,
            title,
            author,
            startDate,
            endDate,
            description, 
          },
        })
      }
    >
      <View className="bg-white p-4 rounded-xl shadow-sm flex mb-2 mt-2">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-[18px] font-regular text-black">{title}</Text>
            <Text className="text-[14px] font-regular text-black mt-1.5">Send by {author}</Text>
            <Text className="text-[12px] font-regular mt-1.5 text-[#717073]">
              {startDate} - {endDate}
            </Text>
          </View>
          <Pressable
            onPress={(e) => {
              e.stopPropagation(); 
              setIsCheckPressed(!isCheckPressed);
            }}
            className={`w-10 h-10 rounded-full items-center justify-center ${
              isCheckPressed ? 'bg-[#004030]' : 'bg-[#F3F1EF]'
            }`}
          >
            <Check width={24} height={24} color="#4B9782" />
          </Pressable>
        </View>
      </View>
    </TouchableOpacity>
  );
}
