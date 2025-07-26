import { View } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import { useState } from 'react';
import { Text } from 'react-native';

export default function DateSelecter() {  



  const minDate = new Date();
  const maxDate = new Date(2026, 6, 3);

  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);

  const onDateChange = (date, type) => {
    if (type === 'END_DATE') {
      setSelectedEndDate(date);
    } else {
      setSelectedStartDate(date);
      setSelectedEndDate(null);
    }
  };

    return (
        <View>
          <Text style={{ fontFamily: 'CustomFont' }} className="text-[24px] font-medium text-black">Select a date or date range</Text>
            <View className="mt-3 bg-white rounded-xl px-4 py-2 shadow-sm">
                    <CalendarPicker
                      startFromMonday={true}
                      width={375} 
                      allowRangeSelection={true}
                      minDate={minDate}
                      maxDate={maxDate}
                      weekdays={['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']}
                      months={[
                        'January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December',
                      ]}
                      previousTitle="Previous"
                      nextTitle="Next"
                      todayBackgroundColor="#4B9782"
                      selectedDayColor="#004030"
                      selectedDayTextColor="#ffffff"
                      scaleFactor={375}
                      textStyle={{
                        color: '#000000',
                      }}
                      onDateChange={onDateChange}
                    />
                  </View>
        </View>
    )
}