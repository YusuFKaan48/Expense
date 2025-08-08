import React, { useState, useMemo, useCallback } from 'react';
import {
    View,
    Text,
    Pressable,
    ScrollView,
    NativeSyntheticEvent,
    NativeScrollEvent,
} from 'react-native';
import ApiService from '@/helper/fetch';
import Chart from '@/app/../components/List/Chart';
import { Filter, ShareIos } from 'iconoir-react-native';
import FilterModal, { FilterType, ModalOption } from './FilterModal';
import TransactionList, { TransactionType } from './Transaction';
import Toast from 'react-native-toast-message';
import { useFocusEffect } from '@react-navigation/native';

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

export default function ListPage() {
    const [allTransactions, setAllTransactions] = useState<TransactionType[]>([]);
    const [filteredTransactions, setFilteredTransactions] = useState<TransactionType[]>([]);
    const [displayedTransactions, setDisplayedTransactions] = useState<TransactionType[]>([]);

    const [selectedValues, setSelectedValues] = useState<
        Record<Exclude<FilterType, null>, string | number | null>
    >({
        month: null,
        category: null,
        currency: null,
    });

    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [filterModalVisible, setFilterModalVisible] = useState(false);

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

    const categoryTotals = useMemo(() => {
        const totals: Record<string, Record<string, { emoji: string; amount: number }>> = {};

        allTransactions.forEach((t) => {
            if (!totals[t.category_name]) {
                totals[t.category_name] = {};
            }
            if (!totals[t.category_name][t.currency]) {
                totals[t.category_name][t.currency] = { emoji: t.category_emoji, amount: 0 };
            }
            totals[t.category_name][t.currency].amount += t.amount;
        });

        return totals;
    }, [allTransactions]);

    const fetchTransactions = useCallback(async () => {
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
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            fetchTransactions();
        }, [fetchTransactions])
    );

    React.useEffect(() => {
        const filtered = allTransactions.filter((t) => {
            const d = new Date(t.created_at);
            return (
                (selectedValues.month === null || d.getMonth() === selectedValues.month) &&
                (selectedValues.category === null || t.category_name === selectedValues.category) &&
                (selectedValues.currency === null || t.currency === selectedValues.currency)
            );
        });
        setFilteredTransactions(filtered);
        setDisplayedTransactions(filtered.slice(0, 15));
    }, [selectedValues, allTransactions]);

    const loadMore = useCallback(() => {
        if (loadingMore) return;
        if (displayedTransactions.length >= filteredTransactions.length) return;

        setLoadingMore(true);
        setTimeout(() => {
            setDisplayedTransactions((prev) => [
                ...prev,
                ...filteredTransactions.slice(prev.length, prev.length + 15),
            ]);
            setLoadingMore(false);
        }, 300);
    }, [loadingMore, displayedTransactions, filteredTransactions]);

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
        const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 50;
        if (isCloseToBottom) {
            loadMore();
        }
    };

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
        setSelectedValues({
            month: null,
            category: null,
            currency: null,
        });
    };

    const onFilterIconPress = () => {
        setFilterModalVisible(true);
    };

    const sendPdfMail = async () => {
        try {
            const api = await ApiService.getInstance();

            const response = await api.post({
                url: 'send-transactions-pdf',
                parameters: { transactions: filteredTransactions },
            });

            if (response.success) {
                Toast.show({
                    type: 'success',
                    text1: 'Başarılı',
                    text2: 'İşlem listeniz e-posta olarak gönderildi.',
                });
            } else {
                throw new Error('Gönderilemedi');
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Hata',
                text2: 'İşlem listeniz gönderilirken hata oluştu.',
            });
        }
    };

    return (
        <View className="flex-1 bg-[#121826] px-4">
            <ScrollView scrollEventThrottle={16} onScroll={handleScroll}>
                {loading ? (
                    <Text className="text-center text-white pt-6">Yükleniyor...</Text>
                ) : (
                    <>
                        <Chart monthlyData={monthlyData} />

                        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
                            {Object.entries(categoryTotals).map(([categoryName, currencyMap]) => (
                                <View
                                    key={categoryName}
                                    className="bg-gray-800 rounded-lg p-4 mt-6 mr-4 items-start"
                                    style={{ minWidth: 120 }}
                                >
                                    <Text className="text-[32px] mb-1">{Object.values(currencyMap)[0]?.emoji}</Text>
                                    <Text className="text-white text-[20px] font-semibold text-center">
                                        {categoryName}
                                    </Text>

                                    {Object.entries(currencyMap).map(([currency, { amount }]) => (
                                        <Text key={currency} className="text-gray-300 text-[16px] gap-1">
                                            {currency}: {amount.toFixed(2)}
                                        </Text>
                                    ))}
                                </View>
                            ))}
                        </ScrollView>

                        <View className="flex-row justify-between items-center">
                            <Text className="text-[24px] text-center text-white py-5">Liste</Text>

                            <View className="flex-row">
                                <Pressable
                                    onPress={onFilterIconPress}
                                    className="p-2 rounded-full"
                                    accessibilityLabel="Filtreleri Aç"
                                >
                                    <Filter width={24} height={24} color="#fff" />
                                </Pressable>

                                <Pressable
                                    onPress={sendPdfMail}
                                    className="p-2 rounded-full"
                                    accessibilityLabel="İşlem Listesini Paylaş"
                                >
                                    <ShareIos width={24} height={24} color="#fff" />
                                </Pressable>
                            </View>
                        </View>

                        <TransactionList transactions={displayedTransactions} />

                        {loadingMore && <Text className="text-center text-white py-3">Yükleniyor...</Text>}
                    </>
                )}
            </ScrollView>

            <FilterModal
                visible={filterModalVisible}
                setVisible={setFilterModalVisible}
                selectedValues={selectedValues}
                setSelectedValues={setSelectedValues}
                onClearAll={() => {
                    clearAllFilters();
                    setFilterModalVisible(false);
                }}
                categories={categories}
                currencies={currencies}
                months={months}
            />
        </View>
    );
}
