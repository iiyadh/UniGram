const pool = require("../lib/db");


const createScheduleEntry = async (subject_id, teacher_id, classroom_id, groupe_id, day, time_slot) => {
    try{
        const result = await pool.query(
            `INSERT INTO schedule_entries (subject_id, teacher_id, classroom_id, groupe_id, day, time_slot) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [subject_id, teacher_id, classroom_id, groupe_id, day, time_slot]
        );
        return result.rows[0];
    }catch(err){
        console.log("Error in createScheduleEntry:", err);
    }
};


const getAllScheduleEntriesForGroupe = async (groupe_id) => {
    try{
        const result = await pool.query(
            `SELECT s.name_subject,u.name,c.code_classroom ,g.code_groupe , day, time_slot, schedule_entries.id
            FROM schedule_entries
            JOIN subjects s ON schedule_entries.subject_id = s.id
            JOIN teachers t ON schedule_entries.teacher_id = t.id
            JOIN users u ON t.uid = u.id
            JOIN classrooms c ON schedule_entries.classroom_id = c.id
            JOIN groupes g ON schedule_entries.groupe_id = g.id
            WHERE groupe_id = $1`,
            [groupe_id]
        );
        return result.rows;
    }catch(err){
        console.log("Error in getAllScheduleEntries:", err);
    }
};


const getAllScheduleEntriesForTeacher = async (teacher_id) => {
    try{
        const result = await pool.query(
            `SELECT s.name_subject,u.name,c.code_classroom ,g.code_groupe , day, time_slot, schedule_entries.id , schedule_entries.groupe_id
            FROM schedule_entries
            JOIN subjects s ON schedule_entries.subject_id = s.id
            JOIN teachers t ON schedule_entries.teacher_id = t.id
            JOIN users u ON t.uid = u.id
            JOIN classrooms c ON schedule_entries.classroom_id = c.id
            JOIN groupes g ON schedule_entries.groupe_id = g.id
            WHERE teacher_id = $1`,
            [teacher_id]
        );
        return result.rows;
    }catch(err){
        console.log("Error in getAllScheduleEntriesForGroupeForTeacher:", err);
    }
}

const getAllScheduleEntriesForClassroom = async (classroom_id) => {
    try{
        const result = await pool.query(
            `SELECT s.name_subject,u.name,c.code_classroom ,g.code_groupe , day, time_slot, schedule_entries.id
            FROM schedule_entries
            JOIN subjects s ON schedule_entries.subject_id = s.id
            JOIN teachers t ON schedule_entries.teacher_id = t.id
            JOIN users u ON t.uid = u.id
            JOIN classrooms c ON schedule_entries.classroom_id = c.id
            JOIN groupes g ON schedule_entries.groupe_id = g.id
            WHERE classroom_id = $1`,
            [classroom_id]
        );
        return result.rows;
    }catch(err){
        console.log("Error in getAllScheduleEntriesForGroupeForClassroom:", err);
    }
};


const updateScheduleEntry = async (id, subject_id, teacher_id, classroom_id, groupe_id, day, time_slot) => {
    try{
        const result = await pool.query(
            `UPDATE schedule_entries SET subject_id = $1, teacher_id = $2, classroom_id = $3, groupe_id = $4, day = $5, time_slot = $6 WHERE id = $7 RETURNING *`,
            [subject_id, teacher_id, classroom_id, groupe_id, day, time_slot, id]
        );
        return result.rows[0];
    }catch(err){
        console.log("Error in updateScheduleEntry:", err);
    }
};


const deleteScheduleEntry = async (id) => {
    try{
        const result = await pool.query(
            `DELETE FROM schedule_entries WHERE id = $1 RETURNING *`,
            [id]
        );
        return result.rows[0];
    }catch(err){
        console.log("Error in deleteScheduleEntry:", err);
    }
};



const ScheduleEntryModel = {
    createScheduleEntry,
    getAllScheduleEntriesForGroupe,
    getAllScheduleEntriesForTeacher,
    getAllScheduleEntriesForClassroom,
    updateScheduleEntry,
    deleteScheduleEntry
};

module.exports =  ScheduleEntryModel ;