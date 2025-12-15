// Test the accuracy calculation logic
const testAccuracyCalculation = (userId) => {
  // Generate random accuracy between 70-75% (consistent for same user)
  const seed = parseInt(userId) * 7 + 13; // Simple seed for consistency
  const baseAccuracy = 70;
  const range = 5; // 70-75%
  const accuracy = baseAccuracy + (seed % (range * 100)) / 100;
  const finalAccuracy = Math.round(accuracy * 100) / 100; // Round to 2 decimal places

  console.log(`User ID: ${userId}`);
  console.log(`Seed: ${seed}`);
  console.log(`Accuracy: ${finalAccuracy}%`);
  console.log(`Grade: ${finalAccuracy >= 74 ? 'Excellent' : finalAccuracy >= 72 ? 'Good' : 'Satisfactory'}`);
  console.log('---');
};

// Test with different user IDs
console.log('🧪 Testing Accuracy Calculation:');
for (let i = 1; i <= 10; i++) {
  testAccuracyCalculation(i);
}