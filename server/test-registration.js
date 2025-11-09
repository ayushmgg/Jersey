// Quick test script to check registration endpoint
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

async function testRegistration() {
  try {
    console.log('Testing registration endpoint...\n');
    
    const testUser = {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'password123'
    };

    console.log('Sending request:', testUser);
    
    const response = await axios.post(`${API_URL}/auth/register`, testUser);
    
    console.log('\n✅ SUCCESS!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error('\n❌ ERROR:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Error:', error.response.data);
    } else if (error.request) {
      console.error('No response received. Is the server running?');
      console.error('Error:', error.message);
    } else {
      console.error('Error:', error.message);
    }
  }
}

testRegistration();

