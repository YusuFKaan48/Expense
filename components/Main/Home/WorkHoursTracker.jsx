import { useEffect, useRef, useState } from 'react';
import Timer from './Timer';
import SecondButton from '../../Shared/SecondButton';
import { Text, View, Alert } from 'react-native';
import { postRequest, getRequest } from '@/helper/fetch';
import EventEmitter from '@/helper/EventEmitter';

export default function WorkHoursTracker() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  const startTimer = () => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  const startWork = async () => {
    try {
      const res = await postRequest({ url: 'work/start', parameters: {} });
      if (res?.work_time) {
        setSeconds(0);
        setRunning(true);
        startTimer();
      } else {
        Alert.alert('Error', 'Failed to start work session.');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'An error occurred while starting the session.');
    }
  };

  const endWork = async () => {
    try {
      const res = await postRequest({ url: 'work/end', parameters: {} });
      if (res?.work_time) {
        setRunning(false);
        stopTimer();
        Alert.alert('Success', 'Work session successfully saved.');
        EventEmitter.emit('workEnded');
      } else {
        Alert.alert('Error', 'Failed to end work session.');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'An error occurred while ending the session.');
    }
  };

  const checkIfAlreadyWorking = async () => {
    try {
      const data = await getRequest('work/times');
      const active = data?.work_times?.find(w => w.end_time === null);
      if (active) {
        const start = new Date(active.start_time).getTime();
        const now = new Date().getTime();
        const diff = Math.floor((now - start) / 1000);
        setSeconds(diff);
        setRunning(true);
        startTimer();
      }
    } catch (err) {
      console.error('Work session check failed', err);
    }
  };

  useEffect(() => {
    checkIfAlreadyWorking();

    return () => {
      stopTimer();
    };
  }, []);

  return (
      <View>
        <View className="bg-white p-4 rounded-xl shadow-sm flex mb-4 mt-4">
          <Text className="text-[20px] font-regular text-black">Work Hours Tracker</Text>

          <View className="flex-row justify-between items-center mt-4">
            <View className="flex-row">
              <SecondButton word="Start" onPress={startWork} />
              <SecondButton word="Finish" onPress={endWork} />
            </View>

            <Timer seconds={seconds} />
          </View>
        </View>
      </View>
  );
}
