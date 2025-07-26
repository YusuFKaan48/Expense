
import { TextInput} from 'react-native';
import { Text } from 'react-native';
import { View } from 'react-native';

export default function CreateTask({ task, setTask }) {

return (
  <View>
  <Text style={{ fontFamily: 'CustomFont' }} className="text-[24px] font-medium text-black">Task description</Text>
  <View>
    <TextInput
        value={task}
        onChangeText={setTask}
        placeholder="Finish the project..."
        placeholderTextColor="rgba(0,0,0,0.44)"
        className="w-full text-[18px] bg-white text-black px-4 py-3 rounded-xl mb-4 shadow-sm mt-3"
      />
      </View>
      </View>
  );
}
