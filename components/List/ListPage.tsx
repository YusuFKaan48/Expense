import React, {useEffect, useState, useMemo} from 'react';
import {View, Text, Pressable, Modal, ScrollView} from 'react-native';
import ApiService from '@/helper/fetch';
import Chart from '@/app/../components/List/Chart';
import {NavArrowDown, NavArrowUp} from 'iconoir-react-native';

type Transaction = {
    id: number;
    type: 'gelir' | 'gider';
    amount: number;
    currency: string;
    category_name: string;
    category_emoji: string;
    created_at: string;
};

type ModalOption = { label: string; value: string | number };

const months: ModalOption[] = [
    {label: 'Ocak', value: 0}, {label: 'Şubat', value: 1}, {label: 'Mart', value: 2},
    {label: 'Nisan', value: 3}, {label: 'Mayıs', value: 4}, {label: 'Haziran', value: 5},
    {label: 'Temmuz', value: 6}, {label: 'Ağustos', value: 7}, {label: 'Eylül', value: 8},
    {label: 'Ekim', value: 9}, {label: 'Kasım', value: 10}, {label: 'Aralık', value: 11},
];

const years: ModalOption[] = Array.from({length: 9}, (_, i) => ({
    label: (2020 + i).toString(),
    value: 2020 + i,
}));

const days: ModalOption[] = Array.from({length: 31}, (_, i) => ({
    label: (i + 1).toString().padStart(2, '0'),
    value: i + 1,
}));

export default function ListPage() {
    const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
    const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);

    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null);

    const [selectedYear, setSelectedYear] = useState<number | null>(null);
    const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
    const [selectedDay, setSelectedDay] = useState<number | null>(null);

    const [loading, setLoading] = useState(true);

    const [showYearModal, setShowYearModal] = useState(false);
    const [showMonthModal, setShowMonthModal] = useState(false);
    const [showDayModal, setShowDayModal] = useState(false);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [showCurrencyModal, setShowCurrencyModal] = useState(false);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const api = await ApiService.getInstance();
            const response = await api.get('transactions');
            if (response.success) {
                setAllTransactions(response.transactions);
            } else {
                alert('İşlemler alınırken hata oluştu');
            }
        } catch (error) {
            alert('Sunucuya bağlanırken hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const categories: ModalOption[] = useMemo(() => {
        const catSet = new Set<string>();
        allTransactions.forEach(t => catSet.add(t.category_name));
        return Array.from(catSet).map(cat => ({label: cat, value: cat}));
    }, [allTransactions]);

    // Para birimleri benzersiz liste
    const currencies: ModalOption[] = useMemo(() => {
        const currSet = new Set<string>();
        allTransactions.forEach(t => currSet.add(t.currency));
        return Array.from(currSet).map(c => ({label: c, value: c}));
    }, [allTransactions]);

    useEffect(() => {
        const filtered = allTransactions.filter((t) => {
            const d = new Date(t.created_at);
            return (
                (selectedYear === null || d.getFullYear() === selectedYear) &&
                (selectedMonth === null || d.getMonth() === selectedMonth) &&
                (selectedDay === null || d.getDate() === selectedDay) &&
                (selectedCategory === null || t.category_name === selectedCategory) &&
                (selectedCurrency === null || t.currency === selectedCurrency)
            );
        });
        setFilteredTransactions(filtered);
    }, [selectedYear, selectedMonth, selectedDay, selectedCategory, selectedCurrency, allTransactions]);

    const monthlyData = useMemo(() => {
        const data = Array(12).fill(null).map(() => ({gelir: 0, gider: 0}));
        filteredTransactions.forEach((t) => {
            const d = new Date(t.created_at);
            const month = d.getMonth();
            if (t.type === 'gelir') data[month].gelir += Math.max(t.amount, 0);
            else if (t.type === 'gider') data[month].gider += Math.max(t.amount, 0);
        });
        return data;
    }, [filteredTransactions]);

    const renderTransaction = (item: Transaction) => {
        const date = new Date(item.created_at);
        const formattedDate = date.toLocaleDateString('tr-TR');
        const isIncome = item.type === 'gelir';

        return (
            <View key={item.id} className="relative flex-row items-center border-b border-gray-200 py-3 px-2">
                <View className="relative">
                    <Text className="text-[36px]">{item.category_emoji}</Text>
                    <View className="absolute -top-2 -right-2">
                        {isIncome ? (
                            <NavArrowDown width={18} height={18} color="#16a34a"/>
                        ) : (
                            <NavArrowUp width={18} height={18} color="#dc2626"/>
                        )}
                    </View>
                </View>

                <View className="flex-1 px-3">
                    <Text className="text-xl font-semibold">Açıklama</Text>
                    <Text className="text-sm text-gray-600">
                        {item.category_name} / {formattedDate}
                    </Text>
                </View>

                <Text className={`${isIncome ? 'text-green-600' : 'text-red-600'} text-lg`}>
                    {isIncome ? '+' : '-'} {item.amount.toFixed(2)} {item.currency}
                </Text>
            </View>
        );
    };

    const ModalSelector = (
        label: string,
        data: ModalOption[],
        visible: boolean,
        setVisible: (val: boolean) => void,
        selected: string | number | null,
        setSelected: (val: string | number | null) => void
    ) => (
        <Modal visible={visible} transparent animationType="slide">
            <View className="flex-1 bg-black/30 justify-center px-6">
                <View className="bg-white rounded-2xl py-5 px-4 max-h-[70%]">
                    <Text className="text-xl font-bold text-center mb-3">{label}</Text>
                    <ScrollView contentContainerStyle={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between'
                    }}>
                        {data.map((opt) => {
                            const isSelected = selected === opt.value;
                            return (
                                <Pressable
                                    key={opt.value.toString()}
                                    onPress={() => {
                                        setSelected(opt.value);
                                        setVisible(false);
                                    }}
                                    className={`w-1/3 mx-1 my-2 py-3 rounded-full items-center ${
                                        isSelected ? 'bg-blue-600' : 'bg-blue-100'
                                    }`}
                                >
                                    <Text className={`font-semibold ${isSelected ? 'text-white' : 'text-blue-600'}`}>
                                        {opt.label}
                                    </Text>
                                </Pressable>
                            );
                        })}
                        <Pressable
                            onPress={() => {
                                setSelected(null);
                                setVisible(false);
                            }}
                            className="w-full mt-2 bg-red-100 rounded-full py-2 items-center"
                        >
                            <Text className="text-red-600 font-semibold">Temizle</Text>
                        </Pressable>
                    </ScrollView>
                    <Pressable onPress={() => setVisible(false)}
                               className="mt-2 bg-gray-200 rounded-full py-2 items-center">
                        <Text className="text-gray-700 font-semibold">İptal</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );

    return (
        <ScrollView className="flex-1 bg-white px-4 py-2">
            {loading ? (
                <Text className="text-center pt-6">Yükleniyor...</Text>
            ) : (
                <>
                    <Text className="text-[32px] text-center py-2">Yıllık Grafik</Text>
                    <Chart monthlyData={monthlyData}/>

                    <Text className="text-[32px] text-center py-4">Liste</Text>

                    <View>
                        <View className="flex-row flex-wrap justify-between mb-4">
                            <View className="flex-row items-center mb-2">
                                <Text className="text-lg font-semibold pr-2">Yıl</Text>
                                <Pressable onPress={() => setShowYearModal(true)}
                                           className="flex-row items-center bg-blue-100 px-3 py-2 rounded-full">
                                    <Text
                                        className={`font-medium ${selectedYear !== null ? 'text-blue-600' : 'text-gray-500'}`}>
                                        {selectedYear ?? 'Seç'}
                                    </Text>
                                    {selectedYear !== null && (
                                        <Pressable onPress={() => setSelectedYear(null)} className="pl-2">
                                            <Text className="text-red-600 font-bold">X</Text>
                                        </Pressable>
                                    )}
                                </Pressable>
                            </View>

                            <View className="flex-row items-center mb-2">
                                <Text className="text-lg font-semibold pr-2">Ay</Text>
                                <Pressable onPress={() => setShowMonthModal(true)}
                                           className="flex-row items-center bg-blue-100 px-3 py-2 rounded-full">
                                    <Text
                                        className={`font-medium ${selectedMonth !== null ? 'text-blue-600' : 'text-gray-500'}`}>
                                        {selectedMonth !== null ? months[selectedMonth].label : 'Seç'}
                                    </Text>
                                    {selectedMonth !== null && (
                                        <Pressable onPress={() => setSelectedMonth(null)} className="pl-2">
                                            <Text className="text-red-600 font-bold">X</Text>
                                        </Pressable>
                                    )}
                                </Pressable>
                            </View>

                            <View className="flex-row items-center mb-2">
                                <Text className="text-lg font-semibold pr-2">Gün</Text>
                                <Pressable onPress={() => setShowDayModal(true)}
                                           className="flex-row items-center bg-blue-100 px-3 py-2 rounded-full">
                                    <Text
                                        className={`font-medium ${selectedDay !== null ? 'text-blue-600' : 'text-gray-500'}`}>
                                        {selectedDay !== null ? selectedDay.toString().padStart(2, '0') : 'Seç'}
                                    </Text>
                                    {selectedDay !== null && (
                                        <Pressable onPress={() => setSelectedDay(null)} className="pl-2">
                                            <Text className="text-red-600 font-bold">X</Text>
                                        </Pressable>
                                    )}
                                </Pressable>
                            </View>
                        </View>

                        <View className="flex-row flex-wrap justify-between mb-4">
                            <View className="flex-row items-center mb-2">
                                <Text className="text-lg font-semibold pr-2">Kategori</Text>
                                <Pressable onPress={() => setShowCategoryModal(true)}
                                           className="flex-row items-center bg-blue-100 px-3 py-2 rounded-full">
                                    <Text
                                        className={`font-medium ${selectedCategory !== null ? 'text-blue-600' : 'text-gray-500'}`}>
                                        {selectedCategory ?? 'Seç'}
                                    </Text>
                                    {selectedCategory !== null && (
                                        <Pressable onPress={() => setSelectedCategory(null)} className="pl-2">
                                            <Text className="text-red-600 font-bold">X</Text>
                                        </Pressable>
                                    )}
                                </Pressable>
                            </View>

                            <View className="flex-row items-center mb-2">
                                <Text className="text-lg font-semibold pr-2">Para Birimi</Text>
                                <Pressable onPress={() => setShowCurrencyModal(true)}
                                           className="flex-row items-center bg-blue-100 px-3 py-2 rounded-full">
                                    <Text
                                        className={`font-medium ${selectedCurrency !== null ? 'text-blue-600' : 'text-gray-500'}`}>
                                        {selectedCurrency ?? 'Seç'}
                                    </Text>
                                    {selectedCurrency !== null && (
                                        <Pressable onPress={() => setSelectedCurrency(null)} className="pl-2">
                                            <Text className="text-red-600 font-bold">X</Text>
                                        </Pressable>
                                    )}
                                </Pressable>
                            </View>
                        </View>

                        {filteredTransactions.length === 0 ? (
                            <Text className="text-center text-gray-500 pt-4">Seçilen kriterlere uygun işlem
                                bulunamadı.</Text>
                        ) : (
                            filteredTransactions.map(renderTransaction)
                        )}
                    </View>
                </>
            )}

            {ModalSelector('Yıl Seçimi', years, showYearModal, setShowYearModal, selectedYear, setSelectedYear)}
            {ModalSelector('Ay Seçimi', months, showMonthModal, setShowMonthModal, selectedMonth, setSelectedMonth)}
            {ModalSelector('Gün Seçimi', days, showDayModal, setShowDayModal, selectedDay, setSelectedDay)}
            {ModalSelector('Kategori Seçimi', categories, showCategoryModal, setShowCategoryModal, selectedCategory, setSelectedCategory)}
            {ModalSelector('Para Birimi Seçimi', currencies, showCurrencyModal, setShowCurrencyModal, selectedCurrency, setSelectedCurrency)}
        </ScrollView>
    );
}
