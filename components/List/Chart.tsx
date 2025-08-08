import React, {useState} from 'react';
import {View, Alert, Dimensions, Text} from 'react-native';
import {BarChart} from 'react-native-gifted-charts';

type ChartProps = {
    monthlyData: { gelir: number; gider: number }[];
};

const months = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık',
];

const Chart: React.FC<ChartProps> = ({monthlyData}) => {
    const [chartHeight, setChartHeight] = useState(Dimensions.get('window').height / 7);
    const currentMonth = new Date().getMonth();

    const maxValue = Math.max(
        ...monthlyData.map(m => m.gelir + m.gider),
        1000
    );

    const noOfSections = 3;
    const sectionValue = maxValue / noOfSections;

    const yAxisLabels = Array.from({length: noOfSections + 1}, (_, i) =>
        (sectionValue * i).toFixed(0)
    );

    const barWidth = 16;
    const spacing = 4;

    const barGroupWidth = barWidth * 2 + spacing * 2;

    const data = monthlyData.flatMap((month, i) => [
        {
            value: month.gelir,
            frontColor: '#34D399',
            gradientColor: '#86EFAC',
            spacing: spacing,
            label: months[i].slice(0, 3),
            onPress: () => Alert.alert(`${months[i]} Gelir`, `${month.gelir.toFixed(2)} `),
        },
        {
            value: month.gider,
            frontColor: '#F87171',
            gradientColor: '#FCA5A5',
            spacing: spacing,
            label: '',
            onPress: () => Alert.alert(`${months[i]} Gider`, `${month.gider.toFixed(2)} `),
        },
    ]);

    const initialIndex = currentMonth * 2;

    return (
        <View className='gap-4'>
            <Text className="text-[24px] py-2 text-white">Yıllık Grafik</Text>
            <BarChart
                data={data}
                barWidth={barWidth}
                initialSpacing={4}
                spacing={spacing}
                barBorderRadius={6}
                height={chartHeight}
                showGradient
                yAxisThickness={1}
                yAxisColor={'white'}
                xAxisType="dashed"
                xAxisColor="white"
                yAxisTextStyle={{color: 'white', fontSize: 11}}
                xAxisLabelTextStyle={{color: 'white', textAlign: 'center', fontWeight: 'medium'}}
                stepValue={sectionValue}
                maxValue={maxValue}
                noOfSections={noOfSections}
                yAxisLabelTexts={yAxisLabels}
                labelWidth={40}
                showLine={false}
                scrollToIndex={initialIndex}
            />
        </View>
    );
};

export default Chart;
