const pool = require("../lib/db");

const createSession = async (student_id, schedule_entry_id, status = 'Absent', date = null) => {
    try{
        // If no date provided, use current date
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
            `SELECT COUNT(s.student_id) AS absence_count, sub.name_subject
            FROM sessions AS s
            JOIN schedule_entries AS se ON s.schedule_entry_id = se.id
            JOIN subjects AS sub ON se.subject_id = sub.id
            WHERE s.student_id = $1 AND s.status IN ('Absent', 'Excused')
            GROUP BY sub.name_subject`,
            [student_id] 
        );
        return result.rows;

    }catch(err){
        console.log("Error in getSessionsByStudent:", err);
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



