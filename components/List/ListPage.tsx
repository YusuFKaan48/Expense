import React, {useState, useMemo, useCallback, useEffect} from 'react';
import {
    View,
    Text,
    Pressable,
    ScrollView,
    Modal,
    NativeSyntheticEvent,
    NativeScrollEvent,
    SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiService from '@/helper/fetch';
import Chart from '@/app/../components/List/Chart';
import {Filter, ShareIos, MoreVert} from 'iconoir-react-native';
import FilterModal, {FilterType, ModalOption} from './FilterModal';
import TransactionList, {TransactionType} from './Transaction';
import Toast from 'react-native-toast-message';
import {useFocusEffect} from '@react-navigation/native';
import Button from "@/components/Shared/Buton";

const months: ModalOption[] = [
    {label: 'Ocak', value: 0}, {label: 'Şubat', value: 1}, {label: 'Mart', value: 2},
    {label: 'Nisan', value: 3}, {label: 'Mayıs', value: 4}, {label: 'Haziran', value: 5},
    {label: 'Temmuz', value: 6}, {label: 'Ağustos', value: 7}, {label: 'Eylül', value: 8},
    {label: 'Ekim', value: 9}, {label: 'Kasım', value: 10}, {label: 'Aralık', value: 11},
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

    const [defaultCurrency, setDefaultCurrency] = useState<string | null>(null);

    const [categoryModalVisible, setCategoryModalVisible] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    useEffect(() => {
        const fetchDefaultCurrency = async () => {
            try {
                const storedCurrency = await AsyncStorage.getItem('defaultCurrency');
                if (storedCurrency) setDefaultCurrency(storedCurrency);
            } catch (e) {
                console.error('Default currency yüklenemedi:', e);
            }
        };
        fetchDefaultCurrency();
    }, []);

    const categories: ModalOption[] = useMemo(() => {
        const catSet = new Set<string>();
        allTransactions.forEach((t) => catSet.add(t.category_name));
        return Array.from(catSet).map((cat) => ({label: cat, value: cat}));
    }, [allTransactions]);

    const currencies: ModalOption[] = useMemo(() => {
        const currSet = new Set<string>();
        allTransactions.forEach((t) => currSet.add(t.currency));
        return Array.from(currSet).map((c) => ({label: c, value: c}));
    }, [allTransactions]);

    useEffect(() => {
        const filtered = allTransactions.filter((t) => {
            const d = new Date(t.created_at);
            return (
                (selectedValues.month === null || d.getMonth() === selectedValues.month) &&
                (selectedValues.category === null || t.category_name === selectedValues.category)
            );
        });
        setFilteredTransactions(filtered);
        setDisplayedTransactions(filtered.slice(0, 15));
    }, [selectedValues, allTransactions]);

    const categoryTotals = useMemo(() => {
        if (!defaultCurrency) return {};
        const totals: Record<string, { emoji: string; amount: number }> = {};
        allTransactions.forEach((t) => {
            if (t.currency !== defaultCurrency) return;
            if (!totals[t.category_name]) {
                totals[t.category_name] = {emoji: t.category_emoji, amount: 0};
            }
            totals[t.category_name].amount += t.amount;
        });
        return totals;
    }, [allTransactions, defaultCurrency]);

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
        const {layoutMeasurement, contentOffset, contentSize} = event.nativeEvent;
        const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 50;
        if (isCloseToBottom) {
            loadMore();
        }
    };

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
                parameters: {transactions: filteredTransactions},
            });
            if (response.success) {
                Toast.show({type: 'success', text1: 'Başarılı', text2: 'İşlem listeniz e-posta olarak gönderildi.'});
            } else {
                throw new Error('Gönderilemedi');
            }
        } catch (error) {
            Toast.show({type: 'error', text1: 'Hata', text2: 'İşlem listeniz gönderilirken hata oluştu.'});
        }
    };

    return (
        <View className="flex-1 bg-[#121826] px-4">
            <ScrollView scrollEventThrottle={16} onScroll={handleScroll}>
                {loading ? (
                    <Text className="text-center text-white pt-6">Yükleniyor...</Text>
                ) : (
                    <>
                        <Chart monthlyData={monthlyData}/>

                        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
                            {Object.entries(categoryTotals).map(([categoryName, {emoji, amount}]) => (
                                <View
                                    key={categoryName}
                                    className="bg-gray-800 rounded-lg p-4 mt-6 mr-4 relative min-w-[120px] items-start"
                                >
                                    <Pressable
                                        onPress={() => {
                                            setSelectedCategory(categoryName);
                                            setCategoryModalVisible(true);
                                        }}
                                        className="absolute top-2 right-2 p-1"
                                    >
                                        <MoreVert width={20} height={20} color="#fff"/>
                                    </Pressable>

                                    <Text className="text-[32px] mb-1">{emoji}</Text>
                                    <Text className="text-white text-[20px] font-semibold text-left">
                                        {categoryName}
                                    </Text>
                                    <Text className="text-gray-300 text-[16px] gap-1">
                                        {defaultCurrency}: {amount.toFixed(2)}
                                    </Text>
                                </View>
                            ))}
                        </ScrollView>

                        <View className="flex-row justify-between items-center">
                            <Text className="text-[24px] text-center text-white py-4">Liste</Text>
                            <View className="flex-row">
                                <Pressable onPress={onFilterIconPress} className="p-2 rounded-full">
                                    <Filter width={24} height={24} color="#fff"/>
                                </Pressable>
                                <Pressable onPress={sendPdfMail} className="p-2 rounded-full">
                                    <ShareIos width={24} height={24} color="#fff"/>
                                </Pressable>
                            </View>
                        </View>

                        <TransactionList transactions={displayedTransactions}/>
                        {loadingMore && <Text className="text-center text-white py-3">Yükleniyor...</Text>}
                    </>
                )}
            </ScrollView>

            <Modal visible={categoryModalVisible} animationType="slide" transparent={false}>
                <SafeAreaView className="flex-1 bg-[#121826]">
                    <View className="px-4 py-2">
                        <View className="flex-row justify-between items-center gap-20 ">
                            <Text className="text-2xl font-bold text-white ">{selectedCategory} İşlemleri</Text>

                            <Button label="Kapat" color="bg-gray-700" onPress={() => setCategoryModalVisible(false)}/>
                        </View>
                        <TransactionList
                            transactions={filteredTransactions.filter(t => t.category_name === selectedCategory)}
                        />
                    </View>
                </SafeAreaView>
            </Modal>

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
