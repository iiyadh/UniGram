const pool = require("../lib/db");

async function createTables() {
  const queries = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      cin TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      imgURL TEXT,
      account_status TEXT CHECK (account_status IN ('active', 'inactive', 'blocked')) DEFAULT 'inactive',
      role TEXT CHECK (role IN ('student', 'teacher', 'admin', 'chef')) DEFAULT 'student',
      reset_token TEXT,
      reset_token_expires TIMESTAMP
    );
  `;

  // Function to automatically update 'updated_at' timestamp
  const updateTimestampFunction = `
    CREATE OR REPLACE FUNCTION update_timestamp()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
    
    DROP TRIGGER IF EXISTS users_update_timestamp ON users;
    
    CREATE TRIGGER users_update_timestamp
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();
  `;

  try {
    await pool.query(queries);
    await pool.query(updateTimestampFunction);
    console.log("✅ All tables and triggers created (or already exist).");
  } catch (err) {
    console.error("❌ Error creating tables:", err);
  } finally {
    // Don't close the pool here, as it might be used elsewhere
    // await pool.end();
  }
}

// Export the function instead of executing it immediately
module.exports = { createTables };