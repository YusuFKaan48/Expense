import { Text, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WhiteInfoCard from '@/components/Main/Profile/WhiteInfoCard';
import ApiService from '@/helper/fetch';

export default function RelativeInfo() {
  const [relative, setRelative] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  async function loadUser() {
    setLoading(true);
    try {
      const api = await ApiService.create();

      const user = await api.get('me');

      if (user && user.user) {
        await AsyncStorage.setItem('userData', JSON.stringify(user.user));

        setRelative({
          relative: user.relative?.RelativeName || '-',
          relativeNumber: user.relative?.RelativeNumber || '-',
        });
        setErrorMsg(null);
      } else {
        setErrorMsg('User information not found.');
        setRelative(null);
      }
    } catch (error) {
      setErrorMsg('An error occurred while loading data.');
      setRelative(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUser();
  }, []);

  if (loading) return <ActivityIndicator style={{ marginTop: 20 }} />;
  if (errorMsg) return <Text>{errorMsg}</Text>;
  if (!relative) return <Text>Relative information not found.</Text>;

  return (
      <WhiteInfoCard
          title="Relative Info"
          value={relative.relative}
          variant="withExtra"
          extra={relative.relativeNumber}
      />
  );
}
