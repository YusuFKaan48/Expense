import React from 'react';
import {View, Text} from 'react-native';
import {NavArrowDown, NavArrowUp} from 'iconoir-react-native';

export type Transaction = {
    id: number;
    type: 'gelir' | 'gider';
    amount: number;
    currency: string;
    category_name: string;
    category_emoji: string;
    created_at: string;
};

type TransactionListProps = {
    transactions: Transaction[];
};

const Transaction: React.FC<TransactionListProps> = ({transactions}) => {
    const renderTransaction = (item: Transaction) => {
        const date = new Date(item.created_at);
        const formattedDate = date.toLocaleDateString('tr-TR');
        const isIncome = item.type === 'gelir';

        return (
            <View
                key={item.id}
                className="flex-row items-center border-b border-gray-200 py-3 px-2"
            >
                <View className="relative">
                    <Text className="text-4xl">{item.category_emoji}</Text>
                    <View className="absolute -top-3 -right-3">
                        {isIncome ? (
                            <NavArrowDown width={20} height={20} color="#16a34a"/>
                        ) : (
                            <NavArrowUp width={20} height={20} color="#dc2626"/>
                        )}
                    </View>
                </View>

                <View className="flex-1 px-3">
                    <Text className="text-lg font-semibold">Açıklama</Text>
                    <Text className="text-sm text-gray-600">
                        {item.category_name} / {formattedDate}
                    </Text>
                </View>

                <Text className={`text-lg ${isIncome ? 'text-green-600' : 'text-red-600'}`}>
                    {isIncome ? '+' : '-'} {item.amount.toFixed(2)} {item.currency}
                </Text>
            </View>
        );
    };

    if (transactions.length === 0) {
        return (
            <Text className="text-center text-gray-400 pt-5">
                Seçilen kriterlere uygun işlem bulunamadı.
            </Text>
        );
    }

    return <>{transactions.map(renderTransaction)}</>;
};

export default Transaction;
