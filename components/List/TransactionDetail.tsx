import React, {useEffect, useState} from 'react';
import {
    Text,
    View,
    TextInput,
    SafeAreaView,
    ActivityIndicator,
    Alert,
    ScrollView,
} from 'react-native';
import {useRouter, useLocalSearchParams} from 'expo-router';
import ApiService from '@/helper/fetch';
import Button from '@/components/Shared/Buton';
import {NavArrowLeft} from 'iconoir-react-native';

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

const TransactionDetail = () => {
    const {id} = useLocalSearchParams();
    const router = useRouter();

    const [transaction, setTransaction] = useState<TransactionType | null>(null);
    const [loading, setLoading] = useState(true);

    const [description, setDescription] = useState('');
    const [type, setType] = useState<'gelir' | 'gider'>('gider');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date());

    useEffect(() => {
        if (!id || Array.isArray(id)) {
            Alert.alert('Hata', 'Geçersiz işlem ID');
            router.back();
            return;
        }

        const fetchTransaction = async () => {
            try {
                setLoading(true);
                const api = await ApiService.getInstance();
                const response = await api.get(`transactions/${id}`);

                if (response && response.id) {
                    setTransaction(response);
                    setDescription(response.description ?? '');
                    setType(response.type === 'gelir' ? 'gelir' : 'gider');
                    setAmount(response.amount.toString());
                    setDate(new Date(response.created_at));
                } else {
                    Alert.alert('Hata', 'İşlem alınamadı.');
                    router.back();
                }
            } catch (error) {
                console.error(error);
                Alert.alert('Sunucu Hatası', 'İşlem alınırken hata oluştu.');
                router.back();
            } finally {
                setLoading(false);
            }
        };

        fetchTransaction();
    }, [id]);

    const saveTransaction = async () => {
        if (!transaction) return;

        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount)) {
            Alert.alert('Hata', 'Geçerli bir tutar girin.');
            return;
        }

        try {
            const api = await ApiService.getInstance();
            const response = await api.put(`transactions/${transaction.id}`, {
                description,
                type,
                amount: parsedAmount,
                created_at: date.toISOString(),
            });

            if (response && response.success === true) {
                setTransaction(response.transaction);
                Alert.alert('Başarılı', 'İşlem güncellendi.');
                router.back();
            } else {
                Alert.alert('Hata', 'Güncelleme başarısız.');
            }
        } catch (err) {
            console.error(err);
            Alert.alert('Sunucu Hatası', 'Güncelleme sırasında hata oluştu.');
        }
    };

    if (loading) {
        return (
            <View className="flex-1 bg-[#121826] items-center justify-center">
                <ActivityIndicator size="large" color="white" />
            </View>
        );
    }


    if (!transaction) {
        return (
            <Text className="text-center mt-10 text-lg text-white">
                İşlem bulunamadı.
            </Text>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-[#121826]">
            <View className="flex-row items-center px-4 pt-4 pb-2">
                <NavArrowLeft
                    width={28}
                    height={28}
                    color="white"
                    onPress={() => router.push('/drawer/List')}
                />
            </View>

            <ScrollView
                className="flex-1 px-4 pt-2"
                keyboardShouldPersistTaps="handled"
            >
                <View className="items-center mb-6">
                    <Text className="text-4xl font-medium text-white">
                        {transaction.category_emoji} {transaction.category_name}
                    </Text>
                    <Text className="text-lg text-gray-300">
                        {date.toLocaleDateString('tr-TR')}
                    </Text>
                </View>

                <View className="space-y-4 gap-4">
                    <View>
                        <Text className="text-base font-semibold text-gray-200 mb-1">
                            Tutar
                        </Text>
                        <TextInput
                            keyboardType="decimal-pad"
                            value={amount}
                            onChangeText={setAmount}
                            placeholder="0.00"
                            placeholderTextColor="#9CA3AF"
                            className="w-full border-b border-gray-300 rounded-lg px-4 py-2 text-[20px] text-white"
                        />
                    </View>

                    <View>
                        <Text className="text-base font-semibold text-gray-300 mb-1">
                            Açıklama
                        </Text>
                        <TextInput
                            multiline
                            value={description}
                            onChangeText={setDescription}
                            placeholder="Açıklama girin"
                            placeholderTextColor="#9CA3AF"
                            className="w-full border-b border-gray-300 rounded-lg px-4 py-2 text-[20px] text-white"
                        />
                    </View>

                    <View>
                        <Text className="text-base font-semibold text-gray-300 mb-2">
                            Tür
                        </Text>
                        <View className="flex-row gap-4">
                            <Button
                                label="Gelir"
                                onPress={() => setType('gelir')}
                                color={type === 'gelir' ? 'bg-green-500' : 'bg-gray-700'}
                            />
                            <Button
                                label="Gider"
                                onPress={() => setType('gider')}
                                color={type === 'gider' ? 'bg-red-500' : 'bg-gray-700'}
                            />
                        </View>
                    </View>

                    <Button label="Kaydet" color="bg-blue-600" onPress={saveTransaction}/>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default TransactionDetail;
