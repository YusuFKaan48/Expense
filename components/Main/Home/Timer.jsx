import { Clock } from 'iconoir-react-native';
import { Text, View } from 'react-native';

export default function Timer({ seconds }) {
  const formatTime = (totalSeconds) => {
    const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  return (
    <View className="flex-row">
      <Clock width={32} height={32} color="#4B9782" />
      <Text className="text-black mt-1 text-[18px] ml-2">{formatTime(seconds)}</Text>
    </View>
  );
}
