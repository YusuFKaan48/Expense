import React, {useEffect, useState} from 'react';
import {View, Text, FlatList} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import ApiService from '@/helper/fetch';

type Transaction = {
    id: number;
    type: 'gelir' | 'gider';
    amount: number;
    currency: string;
    category_name: string;
    category_emoji: string;
    created_at: string;
};

export default function ListPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const isFocused = useIsFocused();

    const fetchTransactions = async () => {
        try {
            const api = await ApiService.getInstance();
            const response = await api.get('transactions');

            if (response.success) {
                setTransactions(response.transactions);
            } else {
                alert('İşlemler alınırken hata oluştu');
            }
        } catch (error) {
            console.error(error);
            alert('Sunucuya bağlanırken hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isFocused) {
            fetchTransactions();
        }
    }, [isFocused]);

    const renderItem = ({item}: { item: Transaction }) => (
        <View className="px-3 py-4 border-b border-gray-200">
            <Text className="text-[24px] font-bold">
                {item.category_emoji} {item.category_name}
            </Text>
            <Text className={`text-[20px] mt-1 ${item.type === 'gelir' ? 'text-green-600' : 'text-red-600'}`}>
                {item.type === 'gelir' ? '+' : '-'} {item.amount.toFixed(2)} {item.currency}
            </Text>
            <Text className="text-[16px] text-gray-500 mt-1">
                {new Date(item.created_at).toLocaleString()}
            </Text>
        </View>
    );

    return (
        <View className="flex-1 px-4 pt-2 pb-2 bg-white">
            {loading ? (
                <Text>Yükleniyor...</Text>
            ) : (
                <FlatList
                    data={transactions}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={{flexGrow: 1, justifyContent: 'flex-start'}}
                />
            )}
        </View>
    );
}

