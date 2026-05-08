// Test script to check if signature endpoints are deployed
const testEndpoint = async () => {
  try {
    console.log('🔍 Testing signature endpoint deployment...');

    const response = await fetch('https://perfect-goals-15mr.onrender.com/api/signature-status/1');

    if (response.ok) {
      console.log('✅ Signature endpoint is working!');
      const data = await response.json();
      console.log('📄 Response:', data);
    } else if (response.status === 404) {
      console.log('❌ Endpoint not found - deployment still in progress');
      console.log('⏳ Please wait 5-10 minutes for Render to deploy the changes');
    } else {
      console.log(`⚠️ Unexpected status: ${response.status}`);
    }
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }
};

// Test every 30 seconds
const interval = setInterval(testEndpoint, 30000);

// Initial test
testEndpoint();

// Stop after 10 minutes
setTimeout(() => {
  clearInterval(interval);
  console.log('🛑 Test completed');
}, 600000);