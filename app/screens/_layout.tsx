import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './Home'
import Profile from './Profile';
import { Calendar, HomeSimple , User } from 'iconoir-react-native';
import TaskScreen from './TaskScreen';

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
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Task" component={TaskScreen} />
      <Tab.Screen name="Profile" component={Profile} />

    </Tab.Navigator>

  );
}
