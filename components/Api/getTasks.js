import axios from 'axios';

const backendURL = 'http://192.168.31.61:8000'; 

export async function getTasks() {
  try {
    const response = await axios.get(`${backendURL}/api/tasks`);
    return response.data;
  } catch (error) {
    console.error('API call failed:', error);
    return null;
  }
}
