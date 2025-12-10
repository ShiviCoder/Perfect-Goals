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
  
  // Test 2: Admin login
  await testEndpoint(`${BASE_URL}/login`, 'POST', {
    username: 'admin',
    password: 'admin123'
  });
  
  // Test 3: Get resumes list
  await testEndpoint(`${BASE_URL}/api/resumes`);
  
  // Test 4: Get users progress (admin endpoint)
  await testEndpoint(`${BASE_URL}/api/admin/users-progress`);
  
  // Test 5: Setup database (should already be done)
  await testEndpoint(`${BASE_URL}/setup-database`);
  
  console.log('🎉 Backend testing completed!');
}

runTests();