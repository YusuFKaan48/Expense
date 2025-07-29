import { TextInput, Text, View } from 'react-native';

export default function TaskInfo({ title, setTitle, description, setDescription }) {
  return (
      <View>
        <Text className="text-[24px] font-medium text-black mb-2">Task Title</Text>
        <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Enter task title..."
            placeholderTextColor="rgba(0,0,0,0.44)"
            className="w-full text-[18px] bg-white text-black px-4 py-3 rounded-xl mb-4 shadow-sm"
        />

        <Text className="text-[24px] font-medium text-black mt-4 mb-2">Task Description</Text>
        <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Enter task description..."
            placeholderTextColor="rgba(0,0,0,0.44)"
            className="w-full text-[18px] bg-white text-black px-4 py-3 rounded-xl mb-4 shadow-sm"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
        />
      </View>
  );
}
