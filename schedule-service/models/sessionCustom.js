const pool = require("../lib/db");

const createSession = async (student_id, schedule_entry_id, status = 'Absent', date = null) => {
    try{
        const sessionDate = date || new Date().toISOString().split('T')[0];
        
        const result = await pool.query(
            `INSERT INTO sessions (student_id, schedule_entry_id, status, date) VALUES ($1, $2, $3, $4) RETURNING *`,
            [student_id, schedule_entry_id, status, sessionDate]
        );
        return result.rows[0];
    }catch(err){
        console.log("Error in createSession:", err);
        throw err;
    }
};


const getSessionsByStudent = async (student_id) => {
    try{
        const result = await pool.query(
            `SELECT 
                sub.id,
                sub.name_subject,
                COALESCE(COUNT(CASE WHEN s.status IN ('Absent', 'Excused') THEN 1 END), 0) AS absence_count
            FROM students AS st
            JOIN groupes AS g ON st.groupe_id = g.id
            JOIN levels AS l ON g.level_id = l.id
            JOIN subjects AS sub ON sub.id_level = l.id
            LEFT JOIN schedule_entries AS se ON se.subject_id = sub.id
            LEFT JOIN sessions AS s ON s.schedule_entry_id = se.id AND s.student_id = st.id
            WHERE st.id = $1
            GROUP BY sub.id, sub.name_subject
            ORDER BY sub.name_subject`,
            [student_id]
        );
        return result.rows;

    }catch(err){
        console.log("Error in getSessionsByStudent:", err);
        throw err;
    }
}

const getExistingAttendance = async (schedule_entry_id, date) => {
    try{
        const result = await pool.query(
            `SELECT s.student_id, s.status
            FROM sessions AS s
            WHERE s.schedule_entry_id = $1 AND s.date = $2`,
            [schedule_entry_id, date]
        );
        return result.rows;
    }catch(err){
        console.log("Error in getExistingAttendance:", err);
        return [];
    }
}


const SessionModel = {
    createSession,
    getSessionsByStudent,
    getExistingAttendance
};

module.exports = SessionModel;



