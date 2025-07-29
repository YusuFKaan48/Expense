import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import ApiService from '@/helper/fetch'; // ApiService import
import EventEmitter from '@/helper/EventEmitter';

const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const getBoxColor = (seconds) => {
  if (!seconds || seconds <= 0) return '#E5E7EB';
  const hours = seconds / 3600;
  if (hours < 1) return '#9AE6B4';
  if (hours < 3) return '#68D391';
  if (hours < 5) return '#48BB78';
  return '#2F855A';
};

const generateWeeksForMonth = (year, month, data) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const weeks = [];
  let currentWeek = new Array(7).fill(null);

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dayOfWeek = (date.getDay() + 6) % 7;
    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    currentWeek[dayOfWeek] = {
      dateStr: dateKey,
      value: data[dateKey] ?? 0,
    };

    if (dayOfWeek === 6 || day === daysInMonth) {
      weeks.push(currentWeek);
      currentWeek = new Array(7).fill(null);
    }
  }

  return weeks;
};

export default function ActivityGraph() {
  const [activityData, setActivityData] = useState({});
  const [loading, setLoading] = useState(true);

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const months = [month];

  const fetchData = async () => {
    setLoading(true);
    const api = new ApiService();
    await api.init(); // Load token from AsyncStorage

    try {
      const result = await api.get('work/times');
      console.log('API result:', result);

      const entries = Array.isArray(result.work_times) ? result.work_times : [];

      const dataObj = {};
      entries.forEach(entry => {
        if (entry.start_time && typeof entry.duration_seconds === 'number') {
          const date = entry.start_time.slice(0, 10);
          const seconds = Math.abs(entry.duration_seconds);
          dataObj[date] = seconds;
        }
      });

      setActivityData(dataObj);
    } catch (error) {
      console.error('Failed to fetch activity data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const subscription = EventEmitter.on('workEnded', () => {
      fetchData();
    });

    return () => {
      subscription.off();
    };
  }, []);

  if (loading) return <ActivityIndicator size="large" />;

  const allWeeks = months.flatMap(month =>
      generateWeeksForMonth(year, month, activityData)
  );

  return (
      <View className="flex-1 mb-4">
        <Text className="text-[24px] font-jacques font-medium text-black mb-4">
          Activity Graph
        </Text>

        <View className="bg-white p-4 rounded-xl shadow-sm">
          <View className="flex-row ml-14 mb-2">
            {dayNames.map((day, idx) => (
                <Text key={idx} className="text-medium text-center" style={{ width: 40 }}>
                  {day}
                </Text>
            ))}
          </View>

          {allWeeks.map((week, weekIdx) => (
              <View key={weekIdx} className="flex-row items-center mb-[6px]">
                <Text className="text-medium mr-1" style={{ width: 50 }}>
                  Week {weekIdx + 1}
                </Text>

                {week.map((entry, dayIdx) => (
                    <View
                        key={dayIdx}
                        className="w-[20px] h-[20px] rounded-sm mr-4 ml-2"
                        style={{ backgroundColor: getBoxColor(entry?.value) }}
                    />
                ))}
              </View>
          ))}
        </View>
      </View>
  );
}
