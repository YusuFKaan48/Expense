import { useRouter } from 'expo-router';
import { NavArrowLeft } from 'iconoir-react-native';
import { useState } from 'react';
import { Alert, Image, Pressable, Text, TextInput, View } from 'react-native';
import Button from '../../components/Shared/Button';
import { loginUser } from '../../components/Api/login';

export default function Index() {
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
            router.replace('/screens/Home');
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
            <View className="absolute top-[60px] left-[32px]">
                <Pressable onPress={() => router.replace('/')}>
                    <NavArrowLeft width={32} height={32} color="black" />
                </Pressable>
            </View>

            <View className="flex-row mb-6">
                <Image
                    source={require('../../assets/images/robot.png')}
                    className="w-110 h-136"
                />
            </View>

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

            <Button
                word={loading ? 'Loading...' : 'Continue'}
                onPress={handleLogin}
                onPressIn={() => setIsPressed(true)}
                onPressOut={() => setIsPressed(false)}
            />
        </View>
    );
}
