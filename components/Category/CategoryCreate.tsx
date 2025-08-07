import React, {useRef, useState, useEffect} from 'react';
import {View, Text, TextInput, Alert, ScrollView, Pressable, LayoutChangeEvent} from 'react-native';
import Button from '@/components/Shared/Buton';
import ApiService from '@/helper/fetch';
import {LinearGradient} from 'expo-linear-gradient';
import {Dimensions} from 'react-native';

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
    const scrollViewRef = useRef<ScrollView>(null);
    const itemLayouts = useRef<Record<string, {x: number; width: number}>>({});
    const screenWidth = Dimensions.get('window').width;

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

    useEffect(() => {
        if (!selectedEmoji) return;

        const layout = itemLayouts.current[selectedEmoji];
        if (!layout || !scrollViewRef.current) return;

        const offset = layout.x + layout.width / 2 - screenWidth / 2 + 35;
        scrollViewRef.current.scrollTo({
            x: Math.max(0, offset),
            animated: true,
        });
    }, [selectedEmoji]);

    return (
        <View className="bg-white">
            <Text className="text-[24px] pb-2">Emoji seçin</Text>

            <View className="pt-2 h-16 justify-center relative">
                <LinearGradient
                    colors={['white', 'rgba(255,255,255,0)']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: 40,
                        zIndex: 10,
                    }}
                    pointerEvents="none"
                />
                <LinearGradient
                    colors={['rgba(255,255,255,0)', 'white']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    style={{
                        position: 'absolute',
                        right: 0,
                        top: 0,
                        bottom: 0,
                        width: 40,
                        zIndex: 10,
                    }}
                    pointerEvents="none"
                />

                <ScrollView
                    ref={scrollViewRef}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{gap: 12, paddingHorizontal: 120}}
                >
                    {emojiOptions.map((emoji, index) => (
                        <View
                            key={index}
                            onLayout={(e: LayoutChangeEvent) => {
                                const layout = e.nativeEvent.layout;
                                itemLayouts.current[emoji] = {x: layout.x, width: layout.width};
                            }}
                        >
                            <Pressable
                                onPress={() => setSelectedEmoji(emoji)}
                                className={`px-4 py-2 ${
                                    selectedEmoji === emoji
                                        ? 'bg-blue-200 border-blue-500 border rounded-lg'
                                        : ''
                                }`}
                            >
                                <Text className="text-[24px]">{emoji}</Text>
                            </Pressable>
                        </View>
                    ))}
                </ScrollView>
            </View>

            <View className="pt-4 gap-4">
                <Text className="text-[24px]">Kategori ismi</Text>

                <TextInput
                    value={categoryName}
                    onChangeText={setCategoryName}
                    placeholder="Kategori adı..."
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-[20px]"
                />

                <View className="flex-row justify-center pt-2">
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
