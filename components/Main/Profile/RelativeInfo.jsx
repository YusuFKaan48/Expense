import { Text, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getRequest } from '@/helper/fetch';
import WhiteInfoCard from '@/components/Main/Profile/WhiteInfoCard';

export default function RelativeInfo() {
  const [relative, setRelative] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  async function loadUser() {
    try {
      const user = await getRequest('me');

      if (user && user.user) {
        await AsyncStorage.setItem('userData', JSON.stringify(user.user));

        setRelative({
          relative: user.relative.RelativeName || '-',
          relativeNumber: user.relative.RelativeNumber || '-',
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
