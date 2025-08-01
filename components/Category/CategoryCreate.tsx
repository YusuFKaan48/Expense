import React, { useState } from 'react';
import { View, Text, TextInput} from 'react-native';
import Button from "@/components/Shared/Buton";
import CategoryScroll from "@/components/Shared/CategoryScroll";

export default function CategoryCreate() {
    const [categoryName, setCategoryName] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    return (
        <View className=" flex-1 bg-white">

            <Text className="text-[24px]">Emoji seçin</Text>

            <CategoryScroll
                onSelect={(name) => setSelectedCategory(name)}
                selectedCategory={selectedCategory}
            />

            <View className="flex-1 gap-4">

            <Text className="text-[24px]">İsim verin</Text>

            <TextInput
                value={categoryName}
                onChangeText={setCategoryName}
                placeholder="Kategori adı..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2  text-[20px]"
            />

            <View className="flex-row justify-center">
                <Button
                    label="Oluştur"
                    color="bg-blue-500"
                    onPress={() => alert('Oluştur.')}
                />
            </View>

            </View>
        </View>
    );
}
