import React from 'react';
import {View, Pressable, Text} from 'react-native';
import {useRouter} from 'expo-router';
import {User, Menu} from 'iconoir-react-native';
import {useNavigation, DrawerActions} from '@react-navigation/native';

const mockCompany = {
    name: 'Giderli.app',
};

export default function Header() {
    const router = useRouter();
    const navigation = useNavigation();

    return (
        <View className="flex-row justify-between items-center bg-white border-b border-b-gray-300 px-4 py-2">
            <Pressable
                onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
                className="p-2"
                hitSlop={10}
            >
                <Menu width={28} height={28}/>
            </Pressable>

            <Text className="text-[24px] font-regular">{mockCompany.name}</Text>

            <Pressable
                onPress={() => router.push('../profile/Profile')}
                className="p-2"
                hitSlop={10}
            >
                <User width={28} height={28}/>
            </Pressable>
        </View>
    );
}
