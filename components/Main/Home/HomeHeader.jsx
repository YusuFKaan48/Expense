import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text } from 'react-native';
import ApiService from '@/helper/fetch';

export default function HomeHeader() {
    const [userName, setUserName] = useState('');
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        async function loadProfile() {
            try {
                const api = await ApiService.create();
                const data = await api.get('me');

                if (data && data.user) {
                    setUserName(data.user.name || '');
                } else {
                    setUserName('');
                }

                setErrorMsg(null);
            } catch (error) {
                setErrorMsg('Error loading user info');
            } finally {
                setLoading(false);
            }
        }

        loadProfile();
    }, []);

    if (loading) return <ActivityIndicator className="mt-1" />;
    if (errorMsg) return <Text>{errorMsg}</Text>;
    if (!userName) return <Text>User information not found.</Text>;

    return (
        <Text className="text-[24px] font-medium text-black mb-4">
            Hey {userName}!
        </Text>
    );
}
