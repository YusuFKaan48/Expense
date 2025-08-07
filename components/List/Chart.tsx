import React, {useState} from 'react';
import {View, Alert, Dimensions} from 'react-native';
import {BarChart} from 'react-native-gifted-charts';

type ChartProps = {
    monthlyData: { gelir: number; gider: number }[];
};

const months = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık',
];

const Chart: React.FC<ChartProps> = ({monthlyData}) => {
    const [chartHeight, setChartHeight] = useState(Dimensions.get('window').height / 6);
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
            onPress: () => Alert.alert(`${months[i]} Gelir`, `${month.gelir.toFixed(2)} ₺`),
        },
        {
            value: month.gider,
            frontColor: '#F87171',
            gradientColor: '#FCA5A5',
            spacing: spacing,
            label: '',
            onPress: () => Alert.alert(`${months[i]} Gider`, `${month.gider.toFixed(2)} ₺`),
        },
    ]);

    const initialIndex = currentMonth * 2;

    return (
        <View

        >
            <BarChart
                data={data}
                barWidth={barWidth}
                initialSpacing={4}
                spacing={spacing}
                barBorderRadius={6}
                height={chartHeight}
                showGradient
                yAxisThickness={1}
                yAxisColor={'gray'}
                xAxisType="dashed"
                xAxisColor="lightgray"
                yAxisTextStyle={{color: 'gray'}}
                xAxisLabelTextStyle={{color: 'gray', textAlign: 'center', fontWeight: 'bold'}}
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
