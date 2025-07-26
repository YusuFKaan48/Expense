import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import TaskDetail from './taskDetail';
import OtherTasks from './OtherTasks';
import { Animated, View, TouchableOpacity, Platform, Pressable } from 'react-native';
import { useLinkBuilder } from '@react-navigation/native';
import { NavArrowLeft } from 'iconoir-react-native';
import { router } from 'expo-router';

const Tab = createMaterialTopTabNavigator();

function MyTabBar({ state, descriptors, navigation, position }) {
    const { buildHref } = useLinkBuilder();

    return (
        <View className="bg-white pt-12">
            <View className="px-4 pb-3">
                <Pressable onPress={() => router.replace('/screens/TaskScreen')}>
                    <NavArrowLeft width={28} height={28} color="black" />
                </Pressable>
            </View>

            <View className="flex-row border-b border-gray-300">
                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    const label = options.tabBarLabel ?? options.title ?? route.name;

                    const isFocused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };

                    const inputRange = state.routes.map((_, i) => i);
                    const opacity = position.interpolate({
                        inputRange,
                        outputRange: inputRange.map(i => (i === index ? 1 : 0.5)),
                    });

                    return (
                        <TouchableOpacity
                            key={route.key}
                            href={Platform.OS === 'web' ? buildHref(route.name) : undefined}
                            accessibilityRole={Platform.OS === 'web' ? 'link' : 'button'}
                            accessibilityState={isFocused ? { selected: true } : {}}
                            accessibilityLabel={options.tabBarAccessibilityLabel}
                            testID={options.tabBarButtonTestID}
                            onPress={onPress}
                            className="flex-1 py-3 items-center"
                        >
                            <Animated.Text
                                style={{
                                    opacity,
                                    color: isFocused ? 'black' : '#888',
                                    fontWeight: isFocused ? 'bold' : 'normal',
                                }}
                            >
                                {label}
                            </Animated.Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

export default function TaskTopTabs() {
    return (
        <Tab.Navigator
            id="taskTabs"
            tabBar={(props) => <MyTabBar {...props} />}
        >
            <Tab.Screen name="Details" component={TaskDetail} />
            <Tab.Screen name="OtherTasks" component={OtherTasks} />
        </Tab.Navigator>
    );
}
