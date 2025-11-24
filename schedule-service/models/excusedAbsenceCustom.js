const pool = require("../lib/db");

const createExcusedAbsence = async (teacher_id, schedule_entry_id, reason, date) => {
    try {
        const result = await pool.query(
            `INSERT INTO ExcusedAbsences (teacher_id, schedule_entry_id, reason, date)
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [teacher_id, schedule_entry_id, reason, date]
        );
        return result.rows[0];
    } catch (err) {
        console.log("Error in createExcusedAbsence:", err);
    }
};

const getAllExcusedAbsencesByStudent = async (teacher_id) => {
    try {
        const result = await pool.query(
            `SELECT * FROM ExcusedAbsences WHERE teacher_id = $1`,
            [teacher_id]
        );
        return result.rows;
    } catch (err) {
        console.log("Error in getAllExcusedAbsencesByStudent:", err);
    }
};

const updateExcusedAbsence = async (id, reason, date) => {
    try {
        const result = await pool.query(
            `UPDATE ExcusedAbsences SET reason = $1, date = $2 WHERE id = $3 RETURNING *`,
            [reason, date, id]
        );
        return result.rows[0];
    } catch (err) {
        console.log("Error in updateExcusedAbsence:", err);
    }
};

const deleteExcusedAbsence = async (id) => {
    try {
        const result = await pool.query(
            `DELETE FROM ExcusedAbsences WHERE id = $1 RETURNING *`,
            [id]
        );
        return result.rows[0];
    } catch (err) {
        console.log("Error in deleteExcusedAbsence:", err);
    }
};

module.exports = {
    createExcusedAbsence,
    getAllExcusedAbsencesByStudent,
    updateExcusedAbsence,
    deleteExcusedAbsence
};