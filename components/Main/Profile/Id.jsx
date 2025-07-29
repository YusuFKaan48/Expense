import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { ActivityIndicator, Modal, Text, Alert } from 'react-native';
import MRZScanner from '@/helper/MRZScanner';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WhiteInfoCard from './WhiteInfoCard';
import ApiService from '@/helper/fetch';

export default function Id() {
  const [scanning, setScanning] = useState(false);
  const [idNumber, setIdNumber] = useState('ID Number');
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  async function loadUserData() {
    try {
      setLoading(true);
      const userDataString = await AsyncStorage.getItem('userData');
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        if (userData?.id_number) {
          setIdNumber(userData.id_number);
        } else {
          setIdNumber('No ID Card Saved');
        }
        setErrorMsg(null);
      } else {
        setIdNumber('No User Data Found');
        setErrorMsg('User data not found.');
      }
    } catch (error) {
      setErrorMsg('Failed to load user data.');
      setIdNumber('ID Number');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUserData();
  }, []);

  const showResults = async (result) => {
    setLoading(true);
    try {
      let parsedResult;

      if (typeof result === 'string' && result.trim().startsWith('{')) {
        parsedResult = JSON.parse(result);
      } else {
        parsedResult = { id_number: result };
      }

      const scannedIdNumber = parsedResult.id_number || 'Not found';

      const api = await ApiService.create();

      const postResponse = await api.post({
        url: 'id-card',
        parameters: { id_number: scannedIdNumber },
      });

      if (postResponse && postResponse.message) {
        console.log('Successfully saved ID card:', postResponse.message);

        const userResponse = await api.get('me');

        if (userResponse && userResponse.user && userResponse.user.id_number) {
          const backendIdNumber = userResponse.user.id_number;

          setIdNumber(backendIdNumber);

          const userDataString = await AsyncStorage.getItem('userData');
          let userData = userDataString ? JSON.parse(userDataString) : {};
          userData.id_number = backendIdNumber;
          await AsyncStorage.setItem('userData', JSON.stringify(userData));

          setErrorMsg(null);
        } else {
          setErrorMsg('Failed to get updated user data.');
        }
      } else {
        setErrorMsg('Failed to save ID card.');
      }
    } catch (error) {
      console.error(error);
      setErrorMsg('An error occurred while processing data.');
      Alert.alert('Error', 'An error occurred while processing data.');
    } finally {
      setLoading(false);
      setScanning(false);
    }
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 20 }} />;
  if (errorMsg) return <Text>{errorMsg}</Text>;

  return (
      <>
        <WhiteInfoCard
            title="ID"
            value={idNumber}
            variant="withButton"
            buttonText="Scan"
            onPress={() => setScanning(true)}
        />

        <Modal visible={scanning} animationType="slide" presentationStyle="fullScreen">
          <MRZScanner onScanned={showResults} onClosed={() => setScanning(false)} />
        </Modal>

        <StatusBar style="auto" />
      </>
  );
}
