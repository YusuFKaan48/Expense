import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import WorkHoursTracker from '../../components/Main/Home/WorkHoursTracker';
import Activedays from '../../components/Main/Home/Activedays';
import ActiveTasks from '../../components/Main/Task/ActiveTasks';
import { getRequest } from '@/helper/fetch';

export default function HomeScreen() {
    const [userName, setUserName] = useState('');
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        async function loadProfile() {
            try {
                const data = await getRequest('me');

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

    if (loading) return <ActivityIndicator style={{ marginTop: 20 }} />;
    if (errorMsg) return <Text>{errorMsg}</Text>;
    if (!userName) return <Text>Kullanıcı bilgisi bulunamadı.</Text>;

    return (
        <ScrollView style={{ backgroundColor: '#F3F1EF', paddingTop: 64, paddingHorizontal: 32 }}>
            <Text style={{ fontSize: 24, fontWeight: '500', color: 'black' }}>Hey {userName}!</Text>
            <WorkHoursTracker />
            <Activedays />
            <ActiveTasks />
        </ScrollView>
    );
}
