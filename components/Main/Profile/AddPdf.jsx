import * as DocumentPicker from 'expo-document-picker';
import React, { useEffect, useState } from 'react';
import { Alert, Text, ScrollView, ActivityIndicator } from 'react-native';
import WhiteInfoCard from './WhiteInfoCard';
import ApiService from '@/helper/fetch';
import { StatusBar } from 'expo-status-bar';

export default function AddPdf() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  const fileNameFromPath = (path) => {
    if (!path) return 'Unknown';

    const fullName = path.split('/').pop();
    const cleanName = fullName.replace(/^\d+_/, '');

    return cleanName;
  };

  const fetchUploadedPdfs = async () => {
    setLoading(true);
    try {
      const api = await ApiService.create();

      const data = await api.get('user/documents');

      if (data?.documents) {
        setUploadedDocuments(data.documents);
        setErrorMsg(null);
      } else {
        setUploadedDocuments([]);
        setErrorMsg('No documents found.');
      }
    } catch (error) {
      console.error(error);
      setErrorMsg('Failed to load documents.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUploadedPdfs();
  }, []);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (result.type === 'cancel') return;

      const asset = result;
      if (asset && asset.uri && asset.name) {
        const newFiles = [...selectedFiles, asset];
        setSelectedFiles(newFiles);
        await uploadFiles(newFiles);
      }
    } catch (error) {
      console.error('DocumentPicker Error:', error);
      Alert.alert('Error', 'An error occurred while selecting the file.');
    }
  };

  const uploadFiles = async (files = selectedFiles) => {
    if (files.length === 0) return;

    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`documents[${index}]`, {
        uri: file.uri,
        name: file.name,
        type: 'application/pdf',
      });
    });

    try {
      const api = await ApiService.create();

      const data = await api.post({
        url: 'user/upload-pdfs',
        formData,
      });

      if (data && !data.error) {
        Alert.alert('Success', 'PDF files uploaded successfully.');
        fetchUploadedPdfs();
      } else {
        console.log('Upload failed:', data);
        Alert.alert('Error', 'Failed to upload files.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Error', 'An error occurred during upload.');
    }
  };

  if (loading) return <ActivityIndicator size="large" />;
  if (errorMsg) return <Text>{errorMsg}</Text>;

  return (
      <ScrollView>
        <WhiteInfoCard
            title="Add Files"
            value={
              uploadedDocuments.length === 0
                  ? 'No files uploaded yet.'
                  : uploadedDocuments.map(doc => fileNameFromPath(doc.file_path)).join(', ')
            }
            variant="withButton"
            buttonText="Add PDF"
            onPress={pickDocument}
        />
        <StatusBar style="auto" />
      </ScrollView>
  );
}
