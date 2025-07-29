import React, { useEffect, useState } from 'react';
import { Text, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WhiteInfoCard from './WhiteInfoCard';
import ApiService from '@/helper/fetch';

export default function Address() {
    const [address, setAddress] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState(null);

    async function loadUser() {
        setLoading(true);
        try {
            const api = await ApiService.create();
            const user = await api.get('me');

            if (user && user.user) {
                await AsyncStorage.setItem('userData', JSON.stringify(user.user));
                setAddress(user.user.addressName || 'No address provided.');
                setErrorMsg(null);
            } else {
                setErrorMsg('User data not found.');
                setAddress(null);
            }
        } catch (error) {
            setErrorMsg('An error occurred while loading data.');
            setAddress(null);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadUser();
    }, []);

    if (loading) return <ActivityIndicator style={{ marginTop: 20 }} />;
    if (errorMsg) return <Text>{errorMsg}</Text>;
    if (!address) return <Text>Address not available.</Text>;

    return (
        <WhiteInfoCard
            title="Address"
            value={address}
            variant="basic"
        />
    );
}
