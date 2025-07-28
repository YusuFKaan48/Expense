import React from 'react';
import { View, Text } from 'react-native';

const activityData = {
  '2025/7/1': 1,
  '2025/7/2': 3,
  '2025/7/3': 7,
  '2025/7/4': 10,
  '2025/7/5': 13,
  '2025/7/6': 2,
  '2025/7/7': 6,
  '2025/7/10': 12,
  '2025/7/14': 5,
  '2025/7/19': 11,
  '2025/7/21': 4,
  '2025/8/3': 5,
  '2025/8/10': 7,
  '2025/8/15': 2,
  '2025/9/1': 6,
  '2025/9/20': 11,
  '2025/9/25': 4,
};

const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const getBoxColor = (value) => {
  if (!value) return '#E5E7EB';
  if (value < 3) return '#9AE6B4';
  if (value < 6) return '#68D391';
  if (value < 9) return '#48BB78';
  return '#2F855A';
};

const generateWeeksForMonth = (year, month, data) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const weeks = [];
  let currentWeek = new Array(7).fill(null);

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    const dayOfWeek = (date.getDay() + 6) % 7;

    currentWeek[dayOfWeek] = {
      dateStr: `${year}/${month + 1}/${d}`,
      value: data[`${year}/${month + 1}/${d}`] || 0,
    };

    if (dayOfWeek === 6 || d === daysInMonth) {
      weeks.push(currentWeek);
      currentWeek = new Array(7).fill(null);
    }
  }
  return weeks;
};

export default function ThreeMonthsActivity() {
  const year = 2025;
  const months = [6];

  const allWeeks = months.flatMap((month) => generateWeeksForMonth(year, month, activityData));

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
