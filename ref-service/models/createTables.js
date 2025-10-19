const pool = require("../lib/db");

async function createTables() {
  const queries = `
  CREATE TABLE IF NOT EXISTS teachers (
    id SERIAL PRIMARY KEY,
    uid INT REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS chefs (
    id SERIAL PRIMARY KEY,
    uid INT REFERENCES teachers(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS departements (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    chef_id INT REFERENCES chefs(id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS specialities (
    id SERIAL PRIMARY KEY,
    code_speciality TEXT UNIQUE NOT NULL,
    name_speciality TEXT NOT NULL,
    departement_id INT REFERENCES departements(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS levels(
    id SERIAL PRIMARY KEY,
    num_level INT UNIQUE NOT NULL,
    speciality_id INT REFERENCES specialities(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS groupes (
    id SERIAL PRIMARY KEY,
    code_groupe TEXT UNIQUE NOT NULL,
    level_id INT REFERENCES levels(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS students (
    id SERIAL PRIMARY KEY,
    uid INT REFERENCES users(id) ON DELETE CASCADE,
    groupe_id INT REFERENCES groupes(id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS subjects (
    id SERIAL PRIMARY KEY,
    type_subject TEXT CHECK (type_subject IN ('TD', 'TP', 'cours')) NOT NULL,
    name_subject TEXT NOT NULL,
    id_level INT REFERENCES levels(id) ON DELETE CASCADE,
    credits INT NOT NULL,
    coefficient REAL NOT NULL
  );

  CREATE TABLE IF NOT EXISTS teacher_subjects (
    teacher_id INT REFERENCES teachers(id) ON DELETE CASCADE,
    subject_id INT REFERENCES subjects(id) ON DELETE CASCADE,
    PRIMARY KEY (teacher_id, subject_id)
  );

  CREATE TABLE IF NOT EXISTS classrooms (
    id SERIAL PRIMARY KEY,
    code_classroom TEXT UNIQUE NOT NULL,
    capacity INT NOT NULL,
    type_classroom TEXT CHECK (type_classroom IN ('amphi', 'special', 'general')) NOT NULL,
    id_departement INT REFERENCES departements(id) ON DELETE CASCADE
  );
  `;

  try {
    await pool.query(queries);
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