import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WelcomeScreen from './welcome/welcomeScreen';

export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        router.replace('/screens/HomeScreen');
      } else {
        setLoading(false);
      }
    };
    checkLogin();
  }, []);

  if (loading) return null;

  return <WelcomeScreen />;
}
