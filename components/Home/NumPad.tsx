import React, {useState, useRef, useCallback} from 'react';
import {View, Text, TextInput, Pressable} from 'react-native';
import Button from '@/components/Shared/Buton';
import CategoryScroll from '@/components/Shared/CategoryScroll';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiService from '@/helper/fetch';
import {List} from 'iconoir-react-native';
import CurrencyPicker from '@/components/Home/CurrencyPicker';
import {useFocusEffect} from '@react-navigation/native';
import {useRouter} from 'expo-router';

export default function NumPad() {
    const [input, setInput] = useState('');
    const [selection, setSelection] = useState({start: 0, end: 0});
    const [selectedCategory, setSelectedCategory] = useState<{ emoji: string; name: string } | null>(null);
    const [currency, setCurrency] = useState('₺');
    const intervalRef = useRef<number | null>(null);
    const router = useRouter();

    const loadDefaults = async () => {
        try {
            const defaultCat = await AsyncStorage.getItem('defaultCategory');
            const defaultCurr = await AsyncStorage.getItem('defaultCurrency');
            if (defaultCat) setSelectedCategory(JSON.parse(defaultCat));
            if (defaultCurr) setCurrency(defaultCurr);
        } catch (e) {
            console.error('Varsayılanları yüklerken hata:', e);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadDefaults();

            return () => {
                if (intervalRef.current !== null) {
                    clearInterval(intervalRef.current);
                }
            };
        }, [])
    );

    const deleteChar = () => {
        setSelection((sel) => {
            if (sel.start > 0) {
                setInput((prev) => {
                    const newText = prev.slice(0, sel.start - 1) + prev.slice(sel.end);
                    return newText;
                });
                const newPos = sel.start - 1;
                return {start: newPos, end: newPos};
            }
            return sel;
        });
    };

    const handlePress = (val: string) => {
        if (val === '⌫') {
            deleteChar();
        } else {
            const newText = input.slice(0, selection.start) + val + input.slice(selection.end);
            const newPos = selection.start + val.length;
            setInput(newText);
            setSelection({start: newPos, end: newPos});
        }
    };

    const handleTextChange = (text: string) => {
        const numericText = text.replace(/[^0-9,]/g, '');
        setInput(numericText);
    };

    const handleSelectCategory = (category: { emoji: string; name: string }) => {
        setSelectedCategory(category);
    };

    const saveTransaction = async (type: 'gelir' | 'gider') => {
        if (!selectedCategory) {
            alert('Lütfen bir kategori seçin!');
            return;
        }

        if (!input || parseFloat(input.replace(',', '.')) <= 0) {
            alert('Lütfen geçerli bir tutar girin!');
            return;
        }

        try {
            const api = await ApiService.getInstance();

            const response = await api.post({
                url: 'transaction',
                parameters: {
                    type,
                    amount: parseFloat(input.replace(',', '.')),
                    currency,
                    category_name: selectedCategory.name,
                    category_emoji: selectedCategory.emoji,
                },
            });

            console.log('API Response:', response);

            if (response.success) {
                alert('İşlem başarıyla kaydedildi!');
                setInput('');
                setSelection({start: 0, end: 0});
            } else {
                alert('İşlem kaydedilirken hata oluştu.');
            }
        } catch (error) {
            console.error(error);
            alert('Sunucuya bağlanırken hata oluştu.');
        }
    };

    const grid = [
        ['1', '2', '3'],
        ['4', '5', '6'],
        ['7', '8', '9'],
    ];

    const sideButtons = [',', '0', '⌫'];

    return (
        <View className="flex justify-between flex-1">

            <View className='flex-row  justify-end'>
                <Pressable
                    onPress={() => router.push('/drawer/List')}
                >
                    <List width={36} height={36}/>
                </Pressable>
            </View>

            <View className="gap-2 justify-center items-center flex-1">
                <View className="flex-row justify-center items-center">
                    <TextInput
                        className="text-[54px] font-light text-right text-gray-800"
                        value={input}
                        onChangeText={handleTextChange}
                        onSelectionChange={(e) => setSelection(e.nativeEvent.selection)}
                        selection={selection}
                        placeholder="0.00"
                        placeholderTextColor={'#ddd'}
                        keyboardType="numeric"
                    />
                    <CurrencyPicker currency={currency} setCurrency={setCurrency}/>
                </View>

                {selectedCategory && (
                    <Text className="text-base text-gray-500">{selectedCategory.name}</Text>
                )}
            </View>

            <View>
                <CategoryScroll
                    onSelect={handleSelectCategory}
                    selectedCategory={selectedCategory?.emoji ?? null}
                />

                <View className="gap-4">
                    <View className="flex-row gap-4">
                        <View className="flex-[3] gap-4">
                            {grid.map((row, rowIndex) => (
                                <View key={rowIndex} className="flex-row justify-between gap-4">
                                    {row.map((item) => (
                                        <Pressable
                                            key={item}
                                            onPress={() => handlePress(item)}
                                            className="flex-1 py-5 rounded-xl items-center bg-gray-300"
                                        >
                                            <Text className="text-2xl text-black">{item}</Text>
                                        </Pressable>
                                    ))}
                                </View>
                            ))}
                        </View>

                        <View className="flex-1 justify-between w-full">
                            {sideButtons.map((item, i) => (
                                <Pressable
                                    key={i}
                                    onLongPress={() => {
                                        if (item === '⌫') {
                                            setInput('');
                                        }
                                    }}
                                    onPressIn={() => {
                                        if (item === '⌫') {
                                            deleteChar();
                                        } else {
                                            handlePress(item);
                                        }
                                    }}
                                    onPressOut={() => {
                                        if (item === '⌫' && intervalRef.current !== null) {
                                            clearInterval(intervalRef.current);
                                            intervalRef.current = null;
                                        }
                                    }}
                                    className="rounded-xl items-center justify-center bg-gray-300 py-5"
                                >
                                    <Text className="text-2xl text-black">{item}</Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>

                    <View className="flex-row gap-4">
                        <Button label="Gelir" color="bg-green-500" onPress={() => saveTransaction('gelir')}/>
                        <Button label="Gider" color="bg-red-500" onPress={() => saveTransaction('gider')}/>
                    </View>
                </View>
            </View>
        </View>
    );
}
