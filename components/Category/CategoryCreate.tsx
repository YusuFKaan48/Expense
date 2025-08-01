import React, {useState} from 'react';
import {View, Text, TextInput, Alert, ScrollView, Pressable} from 'react-native';
import Button from '@/components/Shared/Buton';
import ApiService from '@/helper/fetch';

const emojiOptions = [
    '📚', '🛒', '💰', '🚗', '💻',
    '🍔', '🎁', '✂️', '🏡', '🎓',
    '🎮', '📷', '🧘', '🐶', '🌍',
    '🚴', '🎵', '🎬', '👕', '🍿'
];

export default function CategoryCreate() {
    const [categoryName, setCategoryName] = useState('');
    const [selectedEmoji, setSelectedEmoji] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleCreateCategory = async () => {
        if (!selectedEmoji || !categoryName.trim()) {
            Alert.alert('Eksik Bilgi', 'Lütfen hem emoji hem de kategori ismini girin.');
            return;
        }

        setIsLoading(true);

        try {
            const api = await ApiService.getInstance();

            const response = await api.post({
                url: 'user/categories',
                parameters: {
                    name: categoryName,
                    emoji: selectedEmoji,
                },
            });

            if (response && response.id) {
                Alert.alert('Başarılı', 'Kategori başarıyla oluşturuldu.');
                setCategoryName('');
                setSelectedEmoji('');
            } else {
                console.log('Sunucu yanıtı:', response);
                Alert.alert('Hata', 'Kategori oluşturulamadı.');
            }
        } catch (error) {
            console.error('İstek hatası:', error);
            Alert.alert('Hata', 'Sunucuya bağlanılamadı.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View className=" bg-white px-6 py-4">
            <Text className="text-[24px] mb-2">Emoji seçin</Text>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{gap: 8}}

            >
                {emojiOptions.map((emoji, index) => (
                    <Pressable
                        key={index}
                        onPress={() => setSelectedEmoji(emoji)}
                        className={`px-4 py-2  ${
                            selectedEmoji === emoji ? 'bg-blue-200 border-blue-500 border rounded-lg' : ''
                        }`}
                    >
                        <Text className="text-[24px]">{emoji}</Text>
                    </Pressable>
                ))}
            </ScrollView>

            <View className="mt-4 gap-4">
                <Text className="text-[24px]">Kategori ismi</Text>

                <TextInput
                    value={categoryName}
                    onChangeText={setCategoryName}
                    placeholder="Kategori adı..."
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-[20px]"
                />

                <View className="flex-row justify-center mt-2">
                    <Button
                        label={isLoading ? 'Oluşturuluyor...' : 'Oluştur'}
                        onPress={handleCreateCategory}
                        color="bg-blue-500"
                        disabled={isLoading}
                    />
                </View>
            </View>
        </View>
    );
}
