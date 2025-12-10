// Script to clean up duplicate users
// This will keep the first user and remove duplicates based on email + fullName

import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";

dotenv.config();

const db = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://perfectgoal_user:9KKadgzjAf6TsgLcuonsCfevtDLDehEj@dpg-d4sms8k9c44c73eq7r60-a.singapore-postgres.render.com/perfectgoal',
  ssl: { rejectUnauthorized: false }
});

async function cleanupDuplicates() {
  try {
    console.log('🔍 Finding duplicate users...');
    
    // Find duplicates based on email and fullName
    const duplicatesQuery = `
      SELECT 
        "fullName", 
        email, 
        COUNT(*) as count,
        array_agg(id ORDER BY "registrationDate") as user_ids
      FROM userregistrations 
      GROUP BY "fullName", email 
      HAVING COUNT(*) > 1
    `;
    
    const duplicates = await db.query(duplicatesQuery);
    
    if (duplicates.rows.length === 0) {
      console.log('✅ No duplicates found!');
      return;
    }
    
    console.log(`📋 Found ${duplicates.rows.length} sets of duplicates:`);
    
    for (const duplicate of duplicates.rows) {
      console.log(`\n👤 User: ${duplicate.fullName} (${duplicate.email})`);
      console.log(`   📊 Count: ${duplicate.count}`);
      console.log(`   🆔 IDs: ${duplicate.user_ids.join(', ')}`);
      
      // Keep the first user (oldest registration), delete the rest
      const idsToDelete = duplicate.user_ids.slice(1); // Remove first ID, keep the rest for deletion
      
      if (idsToDelete.length > 0) {
        console.log(`   🗑️ Deleting IDs: ${idsToDelete.join(', ')}`);
        
        // Delete from user_progress first (foreign key constraint)
        await db.query('DELETE FROM user_progress WHERE user_id = ANY($1)', [idsToDelete]);
        
        // Delete from data_entries (if any)
        await db.query('DELETE FROM data_entries WHERE user_id = ANY($1)', [idsToDelete]);
        
        // Delete the duplicate users
        const deleteResult = await db.query('DELETE FROM userregistrations WHERE id = ANY($1)', [idsToDelete]);
        
        console.log(`   ✅ Deleted ${deleteResult.rowCount} duplicate users`);
      }
    }
    
    // Show final count
    const finalCount = await db.query('SELECT COUNT(*) as total FROM userregistrations');
    console.log(`\n🎉 Cleanup completed! Total users remaining: ${finalCount.rows[0].total}`);
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error.message);
  } finally {
    await db.end();
    console.log('🔚 Database connection closed');
  }
}

cleanupDuplicates();