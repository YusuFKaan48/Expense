import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text } from 'react-native';
import WorkHoursTracker from '../../components/Main/Home/WorkHoursTracker';
import Activedays from '../../components/Main/Home/Activedays';
import ActiveTasks from '../../components/Main/Task/ActiveTasks';

import ApiService from '@/helper/fetch';

export default function Home() {
    const [userName, setUserName] = useState('');
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        async function loadProfile() {
            try {
                const api = await ApiService.create();

                const data = await api.get('me');

                if (data && data.user) {
                    setUserName(data.user.name || null);
                } else {
                    setUserName(null);
                }
                setErrorMsg(null);
            } catch (error) {
                setErrorMsg(error.message);
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
        <ScrollView className="bg-[#F3F1EF] pt-[8px] px-[32px]">
            <Text className="text-[24px] font-jacques font-medium text-black">Hey {userName}!</Text>
            <WorkHoursTracker />
            <Activedays />
            <ActiveTasks />
        </ScrollView>
    );
}
