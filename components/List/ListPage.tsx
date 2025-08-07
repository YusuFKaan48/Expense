import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import ApiService from '@/helper/fetch';
import Chart from '@/app/../components/List/Chart';
import { Filter } from 'iconoir-react-native';
import FilterModal, { FilterType, ModalOption } from './FilterModal';
import Transaction from './Transaction';

const months: ModalOption[] = [
    { label: 'Ocak', value: 0 },
    { label: 'Şubat', value: 1 },
    { label: 'Mart', value: 2 },
    { label: 'Nisan', value: 3 },
    { label: 'Mayıs', value: 4 },
    { label: 'Haziran', value: 5 },
    { label: 'Temmuz', value: 6 },
    { label: 'Ağustos', value: 7 },
    { label: 'Eylül', value: 8 },
    { label: 'Ekim', value: 9 },
    { label: 'Kasım', value: 10 },
    { label: 'Aralık', value: 11 },
];

const years: ModalOption[] = Array.from({ length: 9 }, (_, i) => ({
    label: (2020 + i).toString(),
    value: 2020 + i,
}));

const days: ModalOption[] = Array.from({ length: 31 }, (_, i) => ({
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

    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [filterModalStep, setFilterModalStep] = useState<'filterType' | 'filterOptions'>('filterType');
    const [activeFilter, setActiveFilter] = useState<FilterType>(null);

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
        } catch {
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
        allTransactions.forEach((t) => catSet.add(t.category_name));
        return Array.from(catSet).map((cat) => ({ label: cat, value: cat }));
    }, [allTransactions]);

    const currencies: ModalOption[] = useMemo(() => {
        const currSet = new Set<string>();
        allTransactions.forEach((t) => currSet.add(t.currency));
        return Array.from(currSet).map((c) => ({ label: c, value: c }));
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
        const data = Array(12)
            .fill(null)
            .map(() => ({ gelir: 0, gider: 0 }));
        filteredTransactions.forEach((t) => {
            const d = new Date(t.created_at);
            const month = d.getMonth();
            if (t.type === 'gelir') data[month].gelir += Math.max(t.amount, 0);
            else if (t.type === 'gider') data[month].gider += Math.max(t.amount, 0);
        });
        return data;
    }, [filteredTransactions]);

    const clearAllFilters = () => {
        setSelectedYear(null);
        setSelectedMonth(null);
        setSelectedDay(null);
        setSelectedCategory(null);
        setSelectedCurrency(null);
    };

    const onFilterIconPress = () => {
        setFilterModalStep('filterType');
        setFilterModalVisible(true);
    };

    const onFilterTypeSelect = (type: FilterType) => {
        setActiveFilter(type);
        setFilterModalStep('filterOptions');
    };

    const onBackToFilterTypes = () => {
        setFilterModalStep('filterType');
        setActiveFilter(null);
    };

    const modalOptions = (() => {
        switch (activeFilter) {
            case 'year':
                return years;
            case 'month':
                return months;
            case 'day':
                return days;
            case 'category':
                return categories;
            case 'currency':
                return currencies;
            default:
                return [];
        }
    })();

    const selectedValue = (() => {
        switch (activeFilter) {
            case 'year':
                return selectedYear;
            case 'month':
                return selectedMonth;
            case 'day':
                return selectedDay;
            case 'category':
                return selectedCategory;
            case 'currency':
                return selectedCurrency;
            default:
                return null;
        }
    })();

    return (
        <View className="flex-1 bg-white  px-4 py-2">
            <ScrollView>
                {loading ? (
                    <Text className="text-center pt-6">Yükleniyor...</Text>
                ) : (
                    <>
                        <Chart monthlyData={monthlyData} />

                        <View className="flex-row justify-between items-center">
                            <Text className="text-[24px] text-center py-5">Liste</Text>
                            <Pressable
                                onPress={onFilterIconPress}
                                className="p-2 rounded-full"
                                accessibilityLabel="Filtreleri Aç"
                            >
                                <Filter width={24} height={24} color="#000" />
                            </Pressable>
                        </View>

                        <Transaction transactions={filteredTransactions} />
                    </>
                )}
            </ScrollView>

            <FilterModal
                visible={filterModalVisible}
                setVisible={setFilterModalVisible}
                activeStep={filterModalStep}
                setActiveStep={setFilterModalStep}
                onSelectFilterType={onFilterTypeSelect}
                filterType={activeFilter}
                options={modalOptions}
                selected={selectedValue}
                setSelected={(val) => {
                    switch (activeFilter) {
                        case 'year':
                            setSelectedYear(val as number | null);
                            break;
                        case 'month':
                            setSelectedMonth(val as number | null);
                            break;
                        case 'day':
                            setSelectedDay(val as number | null);
                            break;
                        case 'category':
                            setSelectedCategory(val as string | null);
                            break;
                        case 'currency':
                            setSelectedCurrency(val as string | null);
                            break;
                    }
                    setFilterModalVisible(false);
                }}
                onClearAll={() => {
                    clearAllFilters();
                    setFilterModalVisible(false);
                }}
                onBackToTypes={onBackToFilterTypes}
            />
        </View>
    );
}
