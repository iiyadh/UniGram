const pool = require("../lib/db");

async function createTables() {
  const queries = `
    CREATE TABLE IF NOT EXISTS schedule_entries (
        id SERIAL PRIMARY KEY,
        subject_id INT REFERENCES subjects(id) ON DELETE SET NULL,
        teacher_id INT REFERENCES teachers(id) ON DELETE SET NULL,
        classroom_id INT REFERENCES classrooms(id) ON DELETE SET NULL,
        groupe_id INT REFERENCES groupes(id) ON DELETE SET NULL,
        day TEXT CHECK (day IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')) NOT NULL,
        time_slot TEXT CHECK (time_slot IN ('8:30 - 10:00', '10:10 - 11:40', '11:50 - 13:20', '14:30 - 16:00', '16:10 - 17:40')) NOT NULL
    );
    CREATE TABLE IF NOT EXISTS sessions (
        id SERIAL PRIMARY KEY,
        student_id INT REFERENCES students(id) ON DELETE CASCADE,
        schedule_entry_id INT REFERENCES schedule_entries(id) ON DELETE CASCADE,
        status TEXT CHECK (status IN ('Present', 'Absent', 'Excused')) NOT NULL DEFAULT 'Present',
        date DATE NOT NULL DEFAULT CURRENT_DATE
    );
  `;

  try {
    await pool.query(queries);
    console.log("✅ All tables and triggers created (or already exist).");
  } catch (err) {
    console.error("❌ Error creating tables:", err);
  }
}

module.exports = { createTables };
