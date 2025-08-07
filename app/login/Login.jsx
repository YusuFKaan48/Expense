import {useRouter} from 'expo-router';
import React, {useState} from 'react';
import {Alert, Text, TextInput, View} from 'react-native';
import {loginUser} from '../../components/Api/login';
import Button from '../../components/Shared/Buton';

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState('kaan@mail.com');
    const [password, setPassword] = useState('123');
    const [isPressed, setIsPressed] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        try {
            console.log('Trying login with:', email, password);

            const token = await loginUser(email, password);

            console.log('Token:', token);
            router.replace('/drawer/Home');
        } catch (error) {
            console.log('Login error:', error);
            console.log('Login error message:', error.message);

            Alert.alert('Login failed', error.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 items-center justify-center bg-[#F3F1EF] px-8">
            <Text className="text-[24px] font-medium text-black mb-6">Log In</Text>

            <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                placeholderTextColor="rgba(0,0,0,0.44)"
                className="w-full text-[22px] bg-white text-black px-4 py-3 rounded-xl mb-4 shadow-sm"
            />

            <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                placeholderTextColor="rgba(0,0,0,0.44)"
                secureTextEntry
                className="w-full text-[22px] bg-white text-black px-4 py-3 rounded-xl shadow-sm"
            />

            <View className="flex-row mt-6">
                <Button
                    label="Continue"
                    color="bg-blue-500"
                    onPressIn={() => setIsPressed(true)}
                    onPressOut={() => setIsPressed(false)}
                    onPress={handleLogin}
                />

            </View>
        </View>
    );
}
