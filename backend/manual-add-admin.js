// Manual script to add admin user to production database
// This connects directly to the PostgreSQL database and adds the user

import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";

dotenv.config();

// Use the same connection string as the server
const db = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://perfectgoal_user:9KKadgzjAf6TsgLcuonsCfevtDLDehEj@dpg-d4sms8k9c44c73eq7r60-a.singapore-postgres.render.com/perfectgoal',
  ssl: { rejectUnauthorized: false }
});

async function addAdminUser() {
  try {
    console.log('🔗 Connecting to database...');
    
    // Add the new admin user
    const result = await db.query(`
      INSERT INTO admins (username, password, role) 
      VALUES ('AnkitPatel', 'ankit@20', 'admin')
      ON CONFLICT (username) DO NOTHING
      RETURNING id, username, role
    `);
    
    if (result.rows.length > 0) {
      console.log('✅ Admin user added successfully!');
      console.log('📋 User details:', result.rows[0]);
    } else {
      console.log('ℹ️ Admin user already exists');
    }
    
    // Verify by listing all admins
    const allAdmins = await db.query('SELECT id, username, role, created_at FROM admins ORDER BY id');
    console.log('\n📋 All admin users:');
    allAdmins.rows.forEach(admin => {
      console.log(`   ${admin.id}: ${admin.username} (${admin.role}) - Created: ${admin.created_at}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await db.end();
    console.log('\n🔚 Database connection closed');
  }
}

addAdminUser();