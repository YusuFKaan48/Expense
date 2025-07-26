import { useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import Timer from './Timer';
import SecondButton from '../../Shared/SecondButton';

export default function WorkHoursTracker() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else if (!running && intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  return (
    <View >

      <View className="bg-white p-4 rounded-xl shadow-sm flex mb-4 mt-4">
        <Text className="text-[20px] font-regular text-black">Work hours tracker</Text>

        <View className="flex-row justify-between items-center mt-4">
          <View className="flex-row">
            <SecondButton
              word="Start"
              onPress={() => {
                setSeconds(0);      
                setRunning(true);   
              }}
            />
            <SecondButton
              word="Finish"
              onPress={() => {
                setRunning(false); 
              }}
            />
          </View>

          <Timer seconds={seconds} />
        </View>
      </View>
    </View>
  );
}
