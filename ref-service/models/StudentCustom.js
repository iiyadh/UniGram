const pool = require("../lib/db");
const bcrypt = require("bcrypt");


const createStudent = async (cin,name,email) =>{
    try{
        const password = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(password, 10);
        const userResult = await pool.query(
            `INSERT INTO users (cin, name, email, password, role) VALUES ($1, $2, $3, $4, 'student') RETURNING *`,
            [cin, name, email, hashedPassword]
        );
        const user = userResult.rows[0];
        const studentResult = await pool.query(
            `INSERT INTO students (uid) VALUES ($1) RETURNING *`,
            [user.id]
        );
        const student = studentResult.rows[0];
        return {...student ,...user};
    }catch(err){
        console.log("Error in createStudent:", err);
    }
};


const getAllStudents = async () =>{
    try{
        const result = await pool.query(
            `SELECT s.id as id, u.cin, u.name, u.email, u.account_status , g.code_groupe
             FROM students s
             INNER JOIN users u ON s.uid = u.id LEFT JOIN groupes g ON s.groupe_id = g.id`
        );
        console.log(result.rows);
        return result.rows;
    }catch(err){
        console.log("Error in getAllStudents:", err);
    }
};

const updateStudent = async (studentId, cin, name, email, account_status , groupe_id) =>{
    try{
        const studentResult = await pool.query(
            `SELECT uid FROM students WHERE id = $1`,
            [studentId]
        );
        const uid = studentResult.rows[0].uid;
        const updatedUserResult = await pool.query(
            `UPDATE users SET cin = $1, name = $2, email = $3 , account_status = $4 WHERE id = $5 RETURNING *`,
            [cin, name, email, account_status , uid]
        );
        const updatedStudentResult = await pool.query(
            `UPDATE students SET groupe_id = $1 WHERE id = $2 RETURNING *`,
            [groupe_id, studentId]
        );
        const student = updatedStudentResult.rows[0];
        const user = updatedUserResult.rows[0];
        return { ...user, ...student };
    }catch(err){
        console.log("Error in updateStudent:", err);
    }
};

const deleteStudent = async (studentId) =>{
    try{
        const studentResult = await pool.query(
            `SELECT uid FROM students WHERE id = $1`,
            [studentId]
        );
        const uid = studentResult.rows[0].uid;
        const deletedStudentResult = await pool.query(
            `DELETE FROM students WHERE id = $1 RETURNING *`,
            [studentId]);
        const deletedUserResult = await pool.query(
            `DELETE FROM users WHERE id = $1 RETURNING *`,
            [uid]);
        const student = deletedStudentResult.rows[0];
        const user = deletedUserResult.rows[0];
        return { ...user, ...student };
    }catch(err){
        console.log("Error in deleteStudent:", err);
    }
};


const listAllGroups = async () =>{
    try{
        const result = await pool.query(
            `SELECT * FROM groupes`
        );
        return result.rows;
    }catch(err){
        console.log("Error in listAllGroups:", err);
    }
}

const StudentModel = {
    createStudent,
    getAllStudents,
    updateStudent,
    deleteStudent,
    listAllGroups
};

module.exports = StudentModel;

