import React, { useEffect, useState } from 'react';
import { Text, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WhiteInfoCard from './WhiteInfoCard';

export default function Address() {
    const [address, setAddress] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState(null);
    async function loadUser() {
        try {
            const userData = await AsyncStorage.getItem('userData');
            if (userData) {
                const user = JSON.parse(userData);
                setAddress(user.address);
            } else {
                setErrorMsg('User data not found.');
            }
        } catch (error) {
            setErrorMsg('An error occurred while loading data.');
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
