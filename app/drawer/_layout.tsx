import React from 'react';
import {createDrawerNavigator, DrawerContentScrollView, DrawerItemList} from '@react-navigation/drawer';
import HomeScreen from './Home';
import Category from './Category';
import Header from "@/components/Home/Header";
import {SafeAreaView, View, Text} from "react-native";
import Button from "@/components/Shared/Buton";

const Drawer = createDrawerNavigator();

export default function DrawerLayout() {
    const mockProfile = {
        name: 'Yusuf Kaan Usta',
        email: 'yusuf@example.com',
    };

    return (
        <SafeAreaView className="flex-1 bg-white ">
            <Drawer.Navigator
                initialRouteName="Ana sayfa"
                drawerContent={(props) => (
                    <DrawerContentScrollView
                        {...props}
                        contentContainerStyle={{
                            flex: 1,
                            justifyContent: 'space-between',
                            paddingTop: 0,
                            paddingBottom: 0
                        }}
                    >

                        <View className=" gap-4">
                            <View className=" flex items-center">
                                <Text className="text-[24px] font-medium">Giderli.app</Text>
                            </View>
                            <DrawerItemList {...props} />
                        </View>

                        <View className="flex items-center gap-4">
                            <View>
                                <Text className="font-medium text-[20px]">{mockProfile.name}</Text>
                                <Text className="text-gray-500 text-[16px]">{mockProfile.email}</Text>
                            </View>

                            <View className=" flex-row">
                                <Button
                                    label="Çıkış"
                                    color="bg-red-500"
                                    onPress={() => alert('Çıkış yapılıyor')}
                                />
                            </View>
                        </View>
                    </DrawerContentScrollView>
                )}
            >
                <Drawer.Screen
                    name="Ana sayfa"
                    component={HomeScreen}
                    options={{header: () => <Header/>}}
                />
                <Drawer.Screen
                    name="Kategori Ekle"
                    component={Category}
                    options={{header: () => <Header/>}}
                />
            </Drawer.Navigator>
        </SafeAreaView>
    );
}
