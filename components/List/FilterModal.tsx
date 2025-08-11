import React, {useState, useEffect} from 'react';
import {Text, Pressable, ScrollView, Modal, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Button from "@/components/Shared/Buton";

export type ModalOption = { label: string; value: string | number };
export type FilterType = 'month' | 'category' | 'currency' | null;

type Props = {
    visible: boolean;
    setVisible: (val: boolean) => void;
    selectedValues: Record<Exclude<FilterType, null>, string | number | null>;
    setSelectedValues: (val: Record<Exclude<FilterType, null>, string | number | null>) => void;
    onClearAll: () => void;
    categories: ModalOption[];
    currencies: ModalOption[];
    months: ModalOption[];
};

export default function FilterModal({
                                        visible,
                                        setVisible,
                                        selectedValues,
                                        setSelectedValues,
                                        onClearAll,
                                        categories,
                                        currencies,
                                        months,
                                    }: Props) {
    const [tempSelectedValues, setTempSelectedValues] = useState<Record<Exclude<FilterType, null>, string | number | null>>(selectedValues);
    const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
    const [monthDropdownOpen, setMonthDropdownOpen] = useState(false);
    const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

    useEffect(() => {
        setTempSelectedValues(selectedValues);
        setCurrencyDropdownOpen(false);
        setMonthDropdownOpen(false);
        setCategoryDropdownOpen(false);
    }, [visible, selectedValues]);

    const selectedCategory = categories.find(cat => cat.value === tempSelectedValues.category);

    return (
        <Modal visible={visible} transparent animationType="slide">
            <SafeAreaView className="flex-1">
                <Pressable
                    className="bg-[#121826] rounded-2xl py-2 px-4 flex-grow   gap-y-6"
                    onPress={(e) => e.stopPropagation()}
                >
                    <View className="flex-row justify-between items-center gap-20">
                        <Text className="text-2xl font-bold text-white">Filtre Seçimi</Text>

                        <Button label="Kapat" color="bg-gray-700" onPress={() => setVisible(false)}/>
                    </View>

                    <View className="flex flex-col gap-y-2">
                        <Text className="text-white font-semibold">Ay Seçimi</Text>
                        <View>
                            <Pressable
                                onPress={() => setMonthDropdownOpen(!monthDropdownOpen)}
                                className="bg-gray-700 px-4 py-2 rounded-lg flex-row justify-between items-center"
                            >
                                <Text className="text-white">
                                    {months.find(m => m.value === tempSelectedValues.month)?.label || 'Seçiniz'}
                                </Text>
                                <Text className="text-gray-400 ml-2">▼</Text>
                            </Pressable>

                            {monthDropdownOpen && (
                                <View className="bg-gray-700 mt-2 rounded-lg max-h-52">
                                    <ScrollView>
                                        {months.map((opt) => (
                                            <Pressable
                                                key={opt.value.toString()}
                                                onPress={() => {
                                                    setTempSelectedValues({
                                                        ...tempSelectedValues,
                                                        month: opt.value,
                                                    });
                                                    setMonthDropdownOpen(false);
                                                }}
                                                className={`px-4 py-2 ${tempSelectedValues.month === opt.value ? 'bg-gray-800' : ''}`}
                                            >
                                                <Text
                                                    className={`${tempSelectedValues.month === opt.value ? 'text-white font-semibold' : 'text-gray-400'}`}>
                                                    {opt.label}
                                                </Text>
                                            </Pressable>
                                        ))}
                                    </ScrollView>
                                </View>
                            )}
                        </View>
                    </View>

                    <View className="flex flex-col gap-y-2">
                        <Text className="text-white font-semibold">Kategori Seçimi</Text>
                        <View>
                            <Pressable
                                onPress={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                                className="bg-gray-700 px-4 py-2 rounded-lg flex-row justify-between items-center"
                            >
                                <Text className="text-white">
                                    {selectedCategory?.label || 'Seçiniz'}
                                </Text>
                                <Text className="text-gray-400 ml-2">▼</Text>
                            </Pressable>

                            {categoryDropdownOpen && (
                                <View className="bg-gray-700 mt-2 rounded-lg max-h-52">
                                    <ScrollView>
                                        {categories.map((opt) => (
                                            <Pressable
                                                key={opt.value.toString()}
                                                onPress={() => {
                                                    setTempSelectedValues({
                                                        ...tempSelectedValues,
                                                        category: opt.value,
                                                    });
                                                    setCategoryDropdownOpen(false);
                                                }}
                                                className={`px-4 py-2 ${tempSelectedValues.category === opt.value ? 'bg-gray-800' : ''}`}
                                            >
                                                <Text
                                                    className={`${tempSelectedValues.category === opt.value ? 'text-white font-semibold' : 'text-gray-400'}`}>
                                                    {opt.label}
                                                </Text>
                                            </Pressable>
                                        ))}
                                    </ScrollView>
                                </View>
                            )}
                        </View>
                    </View>

                    <View className="flex flex-col gap-y-2">
                        <Text className="text-white font-semibold">Para Birimi</Text>
                        <View>
                            <Pressable
                                onPress={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                                className="bg-gray-700 px-4 py-2 rounded-lg flex-row justify-between items-center"
                            >
                                <Text className="text-white">
                                    {currencies.find(c => c.value === tempSelectedValues.currency)?.label || 'Seçiniz'}
                                </Text>
                                <Text className="text-gray-400 ml-2">▼</Text>
                            </Pressable>

                            {currencyDropdownOpen && (
                                <View className="bg-gray-700 mt-2 rounded-lg max-h-52">
                                    <ScrollView>
                                        {currencies.map((opt) => (
                                            <Pressable
                                                key={opt.value.toString()}
                                                onPress={() => {
                                                    setTempSelectedValues({
                                                        ...tempSelectedValues,
                                                        currency: opt.value,
                                                    });
                                                    setCurrencyDropdownOpen(false);
                                                }}
                                                className={`px-4 py-2 ${tempSelectedValues.currency === opt.value ? 'bg-gray-800' : ''}`}
                                            >
                                                <Text
                                                    className={`${tempSelectedValues.currency === opt.value ? 'text-white font-semibold' : 'text-gray-400'}`}>
                                                    {opt.label}
                                                </Text>
                                            </Pressable>
                                        ))}
                                    </ScrollView>
                                </View>
                            )}
                        </View>
                    </View>

                    <View className="flex flex-row w-full gap-2">
                        <Button label="Uygula" color="bg-green-600" onPress={() => {
                            setSelectedValues(tempSelectedValues);
                            setVisible(false);
                        }}/>
                        <Button label="Temizle" color="bg-red-600" onPress={() => {
                            onClearAll();
                            setVisible(false);
                        }}/>
                    </View>
                </Pressable>
            </SafeAreaView>
        </Modal>
    );
}
