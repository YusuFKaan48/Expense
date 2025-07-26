import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { getTasks } from '@/components/Api/getTasks';
import { getData } from '@/components/Api/getData';
export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

    useEffect(() => {
        void (async function fetchTasks() {
            const data = await getTasks();
            if (data) {
                setTasks(data);
            }
            setLoading(false);
        })();
    }, []);

    useEffect(() => {
        void (async function fetchData() {
            const data = await getData();
            if (data) {
                setData(data);
            }
            setLoading(false);
        })();
    }, []);


    if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View>
      <FlatList
        data={tasks}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ padding: 10, borderBottomWidth: 1 }}>
            <Text>ID: {item.id}</Text>
            <Text>Title: {item.title}</Text>
          </View>
        )}
      />

      <FlatList
        data={data}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ padding: 10, borderBottomWidth: 1 }}>
            <Text>ID: {item.id}</Text>
            <Text>Title: {item.title}</Text>
          </View>
        )}
      />
    </View>
  );
}
