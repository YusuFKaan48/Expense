import React, { useEffect, useState } from 'react';
import { UserCircle } from 'iconoir-react-native';
import { Text, View, ActivityIndicator } from 'react-native';
import { getRequest } from '../../../helper/fetch';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProfileTopPart() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState(null);

    async function loadUser() {
        try {
            const user = await getRequest('me');

            if (user && user.user) {
                await AsyncStorage.setItem('userData', JSON.stringify(user.user));

                setProfile({
                    name: user.user.name,
                    jobTitleName: user.jobTitleName || '-',
                });
            } else {
                setErrorMsg('User information not found.');
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
    if (!profile) return <Text>User information not found.</Text>;

    return (
        <View className="items-center w-full">
            <Text className="text-[24px] font-jacques font-medium text-black ">
                Profile
            </Text>
            <View className="bg-white p-4 rounded-xl shadow-sm flex mb-2 mt-4 w-full items-center">
                <View className="justify-center items-center">
                    <UserCircle width={96} height={86} color="#000" />
                    <Text className="text-[18px] font-regular text-black mt-1.5">{profile.name}</Text>
                    <Text className="text-[12px] font-regular text-[#717073] mt-1">{profile.jobTitleName}</Text>
                </View>
            </View>
        </View>
    );
}

