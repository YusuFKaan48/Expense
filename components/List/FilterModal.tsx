import React from 'react';
import { View, Text, Pressable, ScrollView, Modal } from 'react-native';

export type ModalOption = { label: string; value: string | number };
export type FilterType = 'year' | 'month' | 'day' | 'category' | 'currency' | null;

function FilterModal({visible, setVisible, activeStep, setActiveStep, onSelectFilterType, filterType, options, selected,setSelected, onClearAll, onBackToTypes,}: {
    visible: boolean;
    setVisible: (val: boolean) => void;
    activeStep: 'filterType' | 'filterOptions';
    setActiveStep: (val: 'filterType' | 'filterOptions') => void;
    onSelectFilterType: (type: FilterType) => void;
    filterType: FilterType;
    options: ModalOption[];
    selected: string | number | null;
    setSelected: (val: string | number | null) => void;
    onClearAll: () => void;
    onBackToTypes: () => void;
}) {
    return (
        <Modal visible={visible} transparent animationType="slide">
            <View
                className="flex-1 justify-center px-6"
                style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
            >
                <View className="bg-white rounded-2xl py-5 px-4 max-h-[70%] gap-4">
                    {activeStep === 'filterType' && (
                        <>
                            <Text className="text-2xl font-bold text-center pb-4">Filtre Türü Seç</Text>
                            <ScrollView
                                contentContainerStyle={{
                                    flexDirection: 'row',
                                    flexWrap: 'wrap',
                                    justifyContent: 'space-between',
                                    gap:'12'
                                }}
                            >
                                {[
                                    { label: 'Yıl', value: 'year' },
                                    { label: 'Ay', value: 'month' },
                                    { label: 'Gün', value: 'day' },
                                    { label: 'Kategori', value: 'category' },
                                    { label: 'Para Birimi', value: 'currency' },
                                ].map((opt) => (
                                    <Pressable
                                        key={opt.value.toString()}
                                        onPress={() => onSelectFilterType(opt.value as FilterType)}
                                        className="w-[30%] py-2 bg-blue-200  rounded-full items-center px-1"
                                    >
                                        <Text className="font-semibold text-blue-700">{opt.label}</Text>
                                    </Pressable>
                                ))}
                            </ScrollView>
                            <Pressable
                                onPress={() => {
                                    onClearAll();
                                    setVisible(false);
                                }}
                                className="mt-4 bg-red-300 py-3 rounded-full items-center"
                            >
                                <Text className="font-semibold text-red-800">Tümünü Temizle</Text>
                            </Pressable>
                            <Pressable
                                onPress={() => setVisible(false)}
                                className="pt-2 bg-gray-200 py-3 rounded-full items-center"
                            >
                                <Text className="font-semibold text-gray-700">Kapat</Text>
                            </Pressable>
                        </>
                    )}

                    {activeStep === 'filterOptions' && (
                        <>
                            <View className="flex-row justify-between items-center pb-3  ">
                                <Pressable onPress={onBackToTypes}>
                                    <Text className="text-lg text-blue-700 font-semibold">{'< Geri'}</Text>
                                </Pressable>
                                <Text className="text-2xl font-bold text-center flex-1">
                                    {filterType === 'year' && 'Yıl Seçimi'}
                                    {filterType === 'month' && 'Ay Seçimi'}
                                    {filterType === 'day' && 'Gün Seçimi'}
                                    {filterType === 'category' && 'Kategori Seçimi'}
                                    {filterType === 'currency' && 'Para Birimi Seçimi'}
                                </Text>
                                <View className="w-12" />
                            </View>

                            <ScrollView
                                contentContainerStyle={{
                                    flexDirection: 'row',
                                    flexWrap: 'wrap',
                                    justifyContent: 'space-between',
                                    gap: '12'
                                }}
                            >
                                {options.map((opt) => {
                                    const isSelected = selected === opt.value;
                                    return (
                                        <Pressable
                                            key={opt.value.toString()}
                                            onPress={() => setSelected(opt.value)}
                                            className={`w-[30%] py-2 py-2 rounded-full items-center px-1 ${
                                                isSelected ? 'bg-blue-800' : 'bg-blue-200'
                                            }`}
                                        >
                                            <Text
                                                className={`font-semibold ${
                                                    isSelected ? 'text-white' : 'text-blue-700'
                                                }`}
                                            >
                                                {opt.label}
                                            </Text>
                                        </Pressable>
                                    );
                                })}
                            </ScrollView>
                            <Pressable
                                onPress={() => {
                                    setSelected(null);
                                    setVisible(false);
                                }}
                                className="pt-4 bg-red-300 py-3 rounded-full items-center"
                            >
                                <Text className="font-semibold text-red-800">Temizle</Text>
                            </Pressable>
                            <Pressable
                                onPress={() => setVisible(false)}
                                className="pt-2 bg-gray-200 py-3 rounded-full items-center"
                            >
                                <Text className="font-semibold text-gray-700">Kapat</Text>
                            </Pressable>
                        </>
                    )}
                </View>
            </View>
        </Modal>
    );
}

export default FilterModal;
