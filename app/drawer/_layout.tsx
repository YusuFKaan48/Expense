import React from 'react';
import {createDrawerNavigator, DrawerContentScrollView, DrawerItemList} from '@react-navigation/drawer';
import HomeScreen from './Home';
import Category from './Category';
import Header from "@/components/Home/Header";
import {SafeAreaView, View, Text} from "react-native";
import Footer from "@/components/Drawer/Footer";

const Drawer = createDrawerNavigator();

export default function DrawerLayout() {

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


                        <Footer/>
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
