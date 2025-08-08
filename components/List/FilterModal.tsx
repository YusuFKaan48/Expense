import React, {useState, useEffect} from 'react';
import { Text, Pressable, ScrollView, Modal } from 'react-native';
import CategoryScroll from './../Shared/CategoryScroll';

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

    useEffect(() => {
        setTempSelectedValues(selectedValues);
    }, [visible, selectedValues]);

    const handleOutsidePress = () => {
        setVisible(false);
        setTempSelectedValues(selectedValues);
    };

    return (
        <Modal visible={visible} transparent animationType="slide">
            <Pressable
                className="flex-1 bg-black bg-opacity-30 justify-center px-6"
                onPress={handleOutsidePress}
            >
                <Pressable
                    className="bg-[#121826] rounded-2xl py-5 px-4 max-h-[70%] gap-6"
                    onPress={(e) => e.stopPropagation()}
                >
                    <Text className="text-2xl font-bold text-center text-white">Filtre Seçimi</Text>

                    <Text className="text-white font-semibold">Ay Seçimi</Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ gap: 12, paddingHorizontal: 10, paddingBottom: 10 }}
                        className="mb-4"
                    >
                        {months.map((opt) => {
                            const isSelected = tempSelectedValues.month === opt.value;
                            return (
                                <Pressable
                                    key={opt.value.toString()}
                                    onPress={() =>
                                        setTempSelectedValues({
                                            ...tempSelectedValues,
                                            month: opt.value,
                                        })
                                    }
                                    className={`py-2 px-4 rounded-full ${isSelected ? 'bg-blue-800' : 'bg-blue-200'}`}
                                >
                                    <Text className={isSelected ? 'text-blue-200 font-semibold' : 'text-blue-700'}>
                                        {opt.label}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </ScrollView>

                    <Text className="text-white font-semibold">Kategori Seçimi</Text>
                    <CategoryScroll
                        selectedCategory={tempSelectedValues.category as string | null}
                        onSelect={(cat) => {
                            setTempSelectedValues({
                                ...tempSelectedValues,
                                category: cat.emoji,
                            });
                        }}
                    />

                    <Text className="text-white font-semibold mt-4 mb-2">Para Birimi</Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ gap: 12, paddingHorizontal: 10 }}
                    >
                        {currencies.map((opt) => {
                            const isSelected = tempSelectedValues.currency === opt.value;
                            return (
                                <Pressable
                                    key={opt.value.toString()}
                                    onPress={() =>
                                        setTempSelectedValues({
                                            ...tempSelectedValues,
                                            currency: opt.value,
                                        })
                                    }
                                    className={`py-2 px-4 rounded-full ${isSelected ? 'bg-blue-800' : 'bg-blue-200'}`}
                                >
                                    <Text className={isSelected ? 'text-blue-200 font-semibold' : 'text-blue-700'}>
                                        {opt.label}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </ScrollView>

                    <Pressable
                        onPress={() => {
                            setSelectedValues(tempSelectedValues);
                            setVisible(false);
                        }}
                        className="mt-6 bg-blue-600 py-3 rounded-full items-center"
                    >
                        <Text className="font-bold text-white">Filtreyi Uygula</Text>
                    </Pressable>

                    <Pressable
                        onPress={() => {
                            onClearAll();
                            setVisible(false);
                        }}
                        className="mt-2 bg-red-300 py-3 rounded-full items-center"
                    >
                        <Text className="font-semibold text-red-800">Tümünü Temizle</Text>
                    </Pressable>

                    <Pressable
                        onPress={() => setVisible(false)}
                        className="pt-2 bg-gray-700 py-3 rounded-full items-center"
                    >
                        <Text className="font-semibold text-white">Kapat</Text>
                    </Pressable>
                </Pressable>
            </Pressable>
        </Modal>
    );
}
