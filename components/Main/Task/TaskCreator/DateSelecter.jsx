import { View, Text } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';

export default function DateSelecter({ selectedStartDate, selectedEndDate, onDateChange }) {
    const minDate = new Date();
    const maxDate = new Date(2026, 6, 3);

    const handleDateChange = (date, type) => {
        if (type === 'END_DATE') {
            onDateChange(selectedStartDate, date);
        } else {
            onDateChange(date, null);
        }
    };

    return (
        <View>
            <Text className="text-[24px] font-medium text-black">
                Select a date or date range
            </Text>

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
                    textStyle={{ color: '#000000' }}
                    selectedStartDate={selectedStartDate}
                    selectedEndDate={selectedEndDate}
                    onDateChange={handleDateChange}
                />
            </View>
        </View>
    );
}
