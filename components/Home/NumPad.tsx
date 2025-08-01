import React, {useState} from 'react';
import {View, Text, TextInput, Pressable} from 'react-native';
import Button from '@/components/Shared/Buton';
import CategoryScroll from '@/components/Shared/CategoryScroll';

export default function NumPad() {
    const [input, setInput] = useState('');
    const [selection, setSelection] = useState({start: 0, end: 0});
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const handlePress = (val: string) => {
        if (val === '⌫') {
            if (selection.start > 0) {
                const newText =
                    input.slice(0, selection.start - 1) + input.slice(selection.end);
                const newPos = selection.start - 1;
                setInput(newText);
                setSelection({start: newPos, end: newPos});
            }
        } else {
            const newText =
                input.slice(0, selection.start) + val + input.slice(selection.end);
            const newPos = selection.start + val.length;
            setInput(newText);
            setSelection({start: newPos, end: newPos});
        }
    };

    const handleTextChange = (text: string) => {
        const numericText = text.replace(/[^0-9,]/g, '');
        setInput(numericText);
    };

    const grid = [
        ['1', '2', '3'],
        ['4', '5', '6'],
        ['7', '8', '9'],
    ];

    const sideButtons = [',', '0', '⌫'];

    return (
        <View className="flex justify-between flex-1">
            <View className="flex flex-col gap-2 justify-center items-center flex-1">
                <View className="flex flex-row justify-center items-center ">
                    <TextInput
                        className="text-6xl font-light text-right text-gray-800 min-h-18"
                        value={input}
                        onChangeText={handleTextChange}
                        onSelectionChange={(e) => setSelection(e.nativeEvent.selection)}
                        selection={selection}
                        placeholder="0.00"
                        placeholderTextColor={"#ddd"}
                        keyboardType="numeric"
                    />
                    <Text className="text-6xl text-[#ddd] min-h-14">₺</Text>
                </View>

                {selectedCategory && (
                    <Text className="text-base text-gray-500">{selectedCategory}</Text>
                )}
            </View>

            <View>
                <CategoryScroll
                    onSelect={(name) => setSelectedCategory(name)}
                    selectedCategory={selectedCategory}
                />


                <View className="flex-row mb-4">
                    <View className="flex-[3]">
                        {grid.map((row, rowIndex) => (
                            <View key={rowIndex} className="flex-row justify-between mb-4">
                                {row.map((item) => (
                                    <Pressable
                                        key={item}
                                        onPress={() => handlePress(item)}
                                        className="flex-1 mx-1 py-5 rounded-xl items-center bg-gray-300"
                                    >
                                        <Text className="text-2xl text-black">{item}</Text>
                                    </Pressable>
                                ))}
                            </View>
                        ))}
                    </View>

                    <View className="flex-1 justify-between ml-2 w-full">
                        {sideButtons.map((item, i) => (
                            <Pressable
                                key={i}
                                onPress={() => handlePress(item)}
                                className="rounded-xl items-center justify-center mb-4 bg-gray-300 py-5"
                            >
                                <Text className="text-2xl text-black">{item}</Text>
                            </Pressable>
                        ))}
                    </View>
                </View>

                <View className="flex-row gap-2 mb-4">
                    <Button
                        label="Gelir"
                        color="bg-green-500"
                        onPress={() => alert('Gelir')}
                    />
                    <Button
                        label="Gider"
                        color="bg-red-500"
                        onPress={() => alert('Gider')}
                    />
                </View>
            </View>
        </View>
    );
}
