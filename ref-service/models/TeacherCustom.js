const pool = require("../lib/db");
const bcrypt = require("bcrypt");


const createTeacher = async (cin, name, email) => {
    try {
        const password = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(password, 10);
        const userResult = await pool.query(
            `INSERT INTO users (cin, name, email, password, role) VALUES ($1, $2, $3, $4, 'teacher') RETURNING *`,
            [cin, name, email, hashedPassword]
        );
        const user = userResult.rows[0];
        const teacherResult = await pool.query(
            `INSERT INTO teachers (uid) VALUES ($1) RETURNING *`,
            [user.id]
        );
        const teacher = teacherResult.rows[0];
        return { ...user, ...teacher };
    } catch (err) {
        console.log("Error in createTeacher:", err);
    }
};


const getAllTeachers = async () => {
    try {
        const result = await pool.query(
            `SELECT t.id as teacher_id, u.cin, u.name, u.email, u.account_status
             FROM teachers t
             JOIN users u ON t.uid = u.id`
        );
        return result.rows;
    } catch (err) {
        console.log("Error in getAllTeachers:", err);
    }
};

const listAllSubjects = async () => {
    try {
        const result = await pool.query(
            `SELECT id, name_subject FROM subjects `
        );
        return result.rows;
    } catch (err) {
        console.log("Error in listAllSubjects:", err);
    }
};

const updateTeacher = async (teacherId, cin, name, email, account_status) => {
    try {
        const teacherResult = await pool.query(
            `SELECT uid FROM teachers WHERE id = $1`,
            [teacherId]
        );
        
        if (teacherResult.rows.length === 0) {
            throw new Error('Teacher not found');
        }
        
        const uid = teacherResult.rows[0].uid;
        const updatedUserResult = await pool.query(
            `UPDATE users SET cin = $1, name = $2, email = $3, account_status = $4 WHERE id = $5 RETURNING *`,
            [cin, name, email, account_status, uid]
        );
        
        // Get the updated teacher data
        const updatedTeacher = await pool.query(
            `SELECT t.id as teacher_id, u.cin, u.name, u.email, u.account_status
             FROM teachers t
             JOIN users u ON t.uid = u.id
             WHERE t.id = $1`,
            [teacherId]
        );

        const user = updatedUserResult.rows[0];
        const teacher = updatedTeacher.rows[0];
        return { ...user, ...teacher };
    } catch (err) {
        console.log("Error in updateTeacher:", err);
        throw err;
    }
};

const deleteTeacher = async (teacherId) => {
    try {
        const teacherResult = await pool.query(
            `SELECT uid FROM teachers WHERE id = $1`,
            [teacherId]
        );
        const uid = teacherResult.rows[0].uid;
        const deletedTeacherResult = await pool.query(
            `DELETE FROM teachers WHERE id = $1 RETURNING *`,
            [teacherId]
        );
        const deletedUserResult = await pool.query(
            `DELETE FROM users WHERE id = $1 RETURNING *`,
            [uid]
        );
        const teacher = deletedTeacherResult.rows[0];
        const user = deletedUserResult.rows[0];
        return { user, teacher };
    } catch (err) {
        console.log("Error in deleteTeacher:", err);
    }
};

const addSubjectsToTeacher = async (id_teacher, id_subject) => {
    try{
        // Use ON CONFLICT to handle duplicates gracefully
        const result = await pool.query(
            `INSERT INTO teacher_subjects (teacher_id, subject_id) 
             VALUES ($1, $2) 
             ON CONFLICT (teacher_id, subject_id) DO NOTHING 
             RETURNING *`,
            [id_teacher, id_subject]
        );
        return result.rows[0];
    }catch(err){
        console.log("Error in addSubjectsToTeacher:", err);
        throw err;
    }
};

const deleteSubjectsFromTeacher = async (id_teacher, id_subject) => {
    try{
        const result = await pool.query(
            `DELETE FROM teacher_subjects WHERE teacher_id = $1 AND subject_id = $2 RETURNING *`,
            [id_teacher, id_subject]
        );
        return result.rows[0] || { deleted: true };
    }catch(err){
        console.log("Error in deleteSubjectsFromTeacher:", err);
        throw err;
    }
};


const listSubjectByTeacher = async (teacherId) => {
    try{
        const result = await pool.query(
            `SELECT s.id, s.name_subject 
             FROM subjects s
             JOIN teacher_subjects ts ON s.id = ts.subject_id 
             WHERE ts.teacher_id = $1
             ORDER BY s.name_subject`,
            [teacherId]
        );
        return result.rows;
    }catch(err){
        console.log("Error in listSubjectByTeacher:", err);
        throw err;
    }
};

const TeacherModel = {
    createTeacher,
    getAllTeachers,
    listAllSubjects,
    updateTeacher,
    deleteTeacher,
    addSubjectsToTeacher,
    listSubjectByTeacher,
    deleteSubjectsFromTeacher
};

module.exports = TeacherModel;