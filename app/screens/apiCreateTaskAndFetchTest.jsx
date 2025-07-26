import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, Alert, StyleSheet, TextInput } from 'react-native';
import axios from 'axios';

const API_URL  = 'http://192.168.31.61:8000/api/tasks';

export default function TaskScreen2() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  async function fetchTasks() {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setTasks(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch tasks.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function addTask() {
    if (!title.trim() || !description.trim()) {
      Alert.alert('Warning', 'Title and description cannot be empty.');
      return;
    }

    const newTask = { title, description };

    try {
      setLoading(true);
      const response = await axios.post(API_URL, newTask);
      Alert.alert('Success', 'TaskScreen added successfully!');
      setTitle('');
      setDescription('');
      fetchTasks();
    } catch (error) {
      Alert.alert('Error', 'Failed to add task.');
      console.error(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
      <View style={styles.container}>
        <TextInput
            style={styles.input}
            placeholder="TaskScreen Title"
            value={title}
            onChangeText={setTitle}
        />
        <TextInput
            style={styles.input}
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
        />
        <Button title="Add New TaskScreen" onPress={addTask} disabled={loading} />
        {loading && <Text>Loading...</Text>}
        <FlatList
            data={tasks}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
                <View style={styles.taskItem}>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text>{item.description}</Text>
                </View>
            )}
            ListEmptyComponent={<Text>No tasks available.</Text>}
        />
      </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1 },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
  },
  taskItem: { marginVertical: 10, padding: 10, backgroundColor: '#eee', borderRadius: 5 },
  title: { fontWeight: 'bold', fontSize: 16 },
});
