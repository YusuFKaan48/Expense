import React from 'react';
import {createDrawerNavigator, DrawerContentScrollView, DrawerItemList} from '@react-navigation/drawer';
import HomeScreen from './Home';
import Category from './Category';
import Header from "@/components/Home/Header";
import {SafeAreaView, View, Text} from "react-native";
import Footer from "@/components/Drawer/Footer";
import ListPage from "@/components/List/ListPage";
import Profile from "@/app/drawer/Profile";
import Currency from "@/app/drawer/Currency";

const Drawer = createDrawerNavigator();

export default function DrawerLayout() {

    return (
        <SafeAreaView className="flex-1 bg-[#121826] ">
            <Drawer.Navigator
                initialRouteName="Ana sayfa"
                screenOptions={{
                    drawerLabelStyle: {color: 'white'},
                    drawerInactiveTintColor: 'white',
                    drawerActiveTintColor: 'white',
                    drawerActiveBackgroundColor: '#2d3748',
                }}
                drawerContent={(props) => (
                    <DrawerContentScrollView
                        {...props}
                        contentContainerStyle={{
                            flex: 1,
                            justifyContent: 'space-between',
                            paddingTop: 0,
                            paddingBottom: 0,
                            backgroundColor: '#121826'

                        }}
                    >

                        <View className=" gap-4 ">
                            <View className=" flex items-center ">
                                <Text className="text-[32px] text-white font-medium">Giderli</Text>
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
                    options={{
                        header: () => <Header/>

                    }}
                />
                <Drawer.Screen
                    name="Kategori Ekle"
                    component={Category}
                    options={{header: () => <Header/>}}
                />
                <Drawer.Screen
                    name="Profile"
                    component={Profile}
                    options={{
                        header: () => <Header/>,
                        drawerItemStyle: {display: 'none'}
                    }}
                />
                <Drawer.Screen
                    name="List"
                    component={ListPage}
                    options={{
                        header: () => <Header/>,
                        drawerItemStyle: {display: 'none'}
                    }}
                />

                <Drawer.Screen
                    name="Para Birimi Ekle"
                    component={Currency}
                    options={{header: () => <Header/>}}
                />
            </Drawer.Navigator>
        </SafeAreaView>
    );
}
