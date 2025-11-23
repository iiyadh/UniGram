const pool = require("../lib/db");


const listSubjects = async () => {
    try {
        const result = await pool.query(
            `SELECT id, name_subject FROM subjects`
        );
        return result.rows;
    }catch(err){
        console.log("Error in listSubjects:", err);
    }
};

const listTeachersBySubject = async (subject_id) => {
    try{
        const result = await pool.query(
            `SELECT t.id, u.name
            FROM teacher_subjects AS ts
            JOIN teachers AS t ON ts.teacher_id = t.id
            JOIN users AS u ON t.uid = u.id
            WHERE ts.subject_id = $1`,
            [subject_id]
        );
        return result.rows;
    }catch(err){
        console.log("Error in listTeachersBySubject:", err);
    }
};


const listClassrooms = async () =>{
    try{
        const result = await pool.query(
            `SELECT id, code_classroom FROM classrooms`
        );
        return result.rows;
    }catch(err){
        console.log("Error in listClassrooms:", err);
    }
}

const getAllStudentsByGroupe = async (groupe_id) => {
    try{
        const result = await pool.query(
            `SELECT s.id, u.name
            FROM students AS s
            JOIN users AS u ON s.uid = u.id
            WHERE s.groupe_id = $1`,
            [groupe_id]
        );
        return result.rows;
    }catch(err){
        console.log("Error in getAllStudentsByGroupe:", err);
    }
};


const UIRenderCustomModel = {
    listSubjects,
    listTeachersBySubject,
    listClassrooms,
    getAllStudentsByGroupe,
};

module.exports = UIRenderCustomModel;