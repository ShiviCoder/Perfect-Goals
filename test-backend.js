// Backend API Test Script
// Run with: node test-backend.js

const BASE_URL = 'https://perfect-goals.onrender.com';

async function testEndpoint(url, method = 'GET', body = null) {
  try {
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' }
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }
    
    const response = await fetch(url, options);
    const data = await response.json();
    
    console.log(`✅ ${method} ${url}`);
    console.log(`   Status: ${response.status}`);
    console.log(`   Response:`, data);
    console.log('');
    
    return { success: response.ok, data };
  } catch (error) {
    console.log(`❌ ${method} ${url}`);
    console.log(`   Error:`, error.message);
    console.log('');
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log('🚀 Testing Perfect Goals Backend API\n');
  
  // Test 1: Ping endpoint
  await testEndpoint(`${BASE_URL}/ping`);
  
  // Test 2: Original Admin login
  await testEndpoint(`${BASE_URL}/login`, 'POST', {
    username: 'admin',
    password: 'admin123'
  });
  
  // Test 3: New Admin login (AnkitPatel)
  await testEndpoint(`${BASE_URL}/login`, 'POST', {
    username: 'AnkitPatel',
    password: 'ankit@20'
  });
  
  // Test 4: Get resumes list
  await testEndpoint(`${BASE_URL}/api/resumes`);
  
  // Test 5: Get users progress (admin endpoint)
  await testEndpoint(`${BASE_URL}/api/admin/users-progress`);
  
  // Test 6: Add new admin user
  await testEndpoint(`${BASE_URL}/add-admin`);
  
  // Test 7: Setup database (should already be done)
  await testEndpoint(`${BASE_URL}/setup-database`);
  
  console.log('🎉 Backend testing completed!');
}

runTests();