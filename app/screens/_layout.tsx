import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './HomeScreen'
import ProfileScreen from './ProfileScreen';
import { Calendar, HomeSimple , User } from 'iconoir-react-native';
import Test from './apiFetchTest';
import TaskScreen2 from './apiCreateTaskAndFetchTest';
import TaskScreen from './TaskScreen';
import { View } from 'react-native';

export default function TabsLayout() {
  const Tab = createBottomTabNavigator();

  return (

    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Home') {
            return <HomeSimple color={color} width={size} height={size} />;
          } else if (route.name === 'Task') {
            return <Calendar color={color} width={size} height={size} />;
          } else if (route.name === 'Profile') {
            return <User color={color} width={size} height={size} />;
          }
        },
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Task" component={TaskScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
        {/* <Tab.Screen name="fetchTask" component={Test} />
<Tab.Screen name="createTask" component={TaskScreen2} /> */}

    </Tab.Navigator>

  );
}
