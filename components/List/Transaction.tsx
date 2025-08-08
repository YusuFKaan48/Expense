import React from 'react';
import {View, Text, Pressable} from 'react-native';
import {useRouter} from 'expo-router';

export type TransactionType = {
    id: number;
    type: 'gelir' | 'gider';
    amount: number;
    currency: string;
    category_name: string;
    category_emoji: string;
    created_at: string;
    description?: string | null;
};

type TransactionListProps = {
    transactions: TransactionType[];
};

const TransactionList: React.FC<TransactionListProps> = ({transactions}) => {
    const router = useRouter();

    const renderTransaction = (item: TransactionType) => {
        const date = new Date(item.created_at);
        const formattedDate = date.toLocaleDateString('tr-TR');
        const isIncome = item.type === 'gelir';

        return (
            <Pressable
                key={item.id}
                onPress={() => router.push({
                    pathname: '../Transaction/[id]',
                    params: {id: item.id.toString()}
                })}
                className="flex-row items-center border-b border-gray-500 py-3 px-2"
            >
                <View className="relative">
                    <Text className="text-4xl">{item.category_emoji}</Text>

                </View>

                <View className="flex-1 px-3">
                    <Text className="text-lg font-semibold text-white">
                        {item.description || '...'}
                    </Text>
                    <Text className="text-sm text-gray-300">
                        {item.category_name} / {formattedDate}
                    </Text>
                </View>

                <Text
                    className={`text-lg ${isIncome ? 'text-green-600' : 'text-red-600'}`}
                >
                    {isIncome ? '+' : '-'} {item.amount.toFixed(2)} {item.currency}
                </Text>
            </Pressable>
        );
    };

    if (transactions.length === 0) {
        return (
            <Text className="text-center text-gray-400 pt-5">
            </Text>
        );
    }

    return <>{transactions.map(renderTransaction)}</>;
};

export default TransactionList;
