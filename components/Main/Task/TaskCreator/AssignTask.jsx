import { useEffect, useState } from 'react';
import { FlatList, Modal, Pressable, Text, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { Check } from 'iconoir-react-native';
import ApiService from '@/helper/fetch';

export default function AssignTask({ selectedEmployees, setSelectedEmployees }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCancelPressed, setIsCancelPressed] = useState(false);
  const [isAssignPressed, setIsAssignPressed] = useState(false);

  const toggleEmployee = (id) => {
    if (selectedEmployees.includes(id)) {
      setSelectedEmployees(selectedEmployees.filter(eid => eid !== id));
    } else {
      setSelectedEmployees([...selectedEmployees, id]);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const api = await ApiService.create();

      const response = await api.get('users');
      setEmployees(response.users || []);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
      <View>
        <Text style={{ fontFamily: 'CustomFont' }} className="text-[24px] font-medium text-black">
          Assign a task
        </Text>

        <Pressable
            onPress={() => setModalVisible(true)}
            className="bg-white rounded-xl shadow-sm px-4"
        >
          <Text className="w-full text-[18px] bg-white text-black rounded-xl mb-4 mt-3">
            {selectedEmployees.length > 0
                ? `Selected: ${selectedEmployees.length} employee${selectedEmployees.length > 1 ? 's' : ''}`
                : 'Tap to select employee'}
          </Text>
        </Pressable>

        <Modal
            visible={modalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setModalVisible(false)}
        >
          <BlurView intensity={30} tint="light" className="flex-1 justify-center px-5">
            <View className="bg-[#F3F1EF] rounded-xl p-5 max-h-[80%] shadow-sm mx-4">
              <Text
                  style={{ fontFamily: 'CustomFont' }}
                  className="text-[24px] font-regular text-black text-center mb-3"
              >
                Select employee
              </Text>

              {loading ? (
                  <Text className="text-center text-gray-500">Loading...</Text>
              ) : (
                  <FlatList
                      data={employees}
                      keyExtractor={(item) => item.id.toString()}
                      renderItem={({ item }) => {
                        const selected = selectedEmployees.includes(item.id);
                        return (
                            <Pressable
                                onPress={() => toggleEmployee(item.id)}
                                className="flex-row justify-between items-center py-3 px-4 border-gray-300 border-b rounded-lg mb-2 bg-white"
                            >
                              <Text className="text-black text-[20px]">{item.name}</Text>
                              {selected && <Check width={24} height={24} color="#4B9782" />}
                            </Pressable>
                        );
                      }}
                  />
              )}

              <View className="flex-row justify-around mt-5">
                <Pressable
                    onPressIn={() => setIsCancelPressed(true)}
                    onPressOut={() => setIsCancelPressed(false)}
                    onPress={() => setModalVisible(false)}
                    className={`py-3 px-6 rounded-lg ${isCancelPressed ? 'bg-gray-300' : 'bg-white'}`}
                >
                  <Text className="text-center text-black">Cancel</Text>
                </Pressable>

                <Pressable
                    onPressIn={() => setIsAssignPressed(true)}
                    onPressOut={() => setIsAssignPressed(false)}
                    onPress={() => setModalVisible(false)}
                    className={`py-3 px-6 rounded-lg ${isAssignPressed ? 'bg-[#004030]' : 'bg-[#4B9782]'}`}
                >
                  <Text className="text-white text-center">Assign</Text>
                </Pressable>
              </View>
            </View>
          </BlurView>
        </Modal>
      </View>
  );
}
