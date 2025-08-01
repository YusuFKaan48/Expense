import React, { useState } from 'react';
import { View, Text, TextInput} from 'react-native';
import Button from "@/components/Shared/Buton";
import CategoryScroll from "@/components/Shared/CategoryScroll";

export default function CategoryCreate() {
    const [categoryName, setCategoryName] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    return (
        <View className=" flex-1 bg-white ">

            <Text className="text-[24px]">Emoji seçin</Text>

            <CategoryScroll
                onSelect={(name) => setSelectedCategory(name)}
                selectedCategory={selectedCategory}
            />

            <Text className="text-[24px]">İsim verin</Text>

            <TextInput
                value={categoryName}
                onChangeText={setCategoryName}
                placeholder="Kategori adı..."
                className="w-full border border-gray-300 rounded-lg px-4 py-4 mb-6  text-[20px]"
            />

            <View className="flex-row justify-center mt-2">
                <Button
                    label="Oluştur"
                    color="bg-blue-500"
                    onPress={() => alert('Oluştur.')}
                />
            </View>
        </View>
    );
}
