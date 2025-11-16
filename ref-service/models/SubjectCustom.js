const pool = require("../lib/db");

const createSubject = async (type_subject, name_subject, id_level, credits, coefficient) => {
    try{
        const result = await pool.query(
            `INSERT INTO subjects (type_subject, name_subject, id_level, credits, coefficient) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [type_subject, name_subject, id_level, credits, coefficient]
        );
        return result.rows[0];
    }catch(err){
        console.log("Error in createSubject:", err);
    }
};

const getAllSubjectsByLevel = async (id_level) => {
    try{
        const result = await pool.query(
            'SELECT * FROM subjects WHERE id_level = $1',
            [id_level]
        );
        return result.rows;
    }catch(err){
        console.log("Error in getAllSubjectsByLevel:", err);
    }
}

const updateSubjectById = async (id, type_subject, name_subject, id_level, credits, coefficient) => {
    try{
        const result = await pool.query(
            `UPDATE subjects SET type_subject = $1, name_subject = $2, id_level = $3, credits = $4, coefficient = $5 WHERE id = $6 RETURNING *`,
            [type_subject, name_subject, id_level, credits, coefficient, id]
        );
        return result.rows[0];
    }catch(err){
        console.log("Error in updateSubjectById:", err);
    }
};

const deleteSubjectById = async (id) =>{
    try{
        const result = await pool.query(
            `DELETE FROM subjects WHERE id = $1 RETURNING *`,
            [id]
        );
        return result.rows[0];
    }catch(err){
        console.log("Error in deleteSubjectById:", err);
    }
};

const SubjectModel = {
    createSubject,
    getAllSubjectsByLevel,
    updateSubjectById,
    deleteSubjectById
};

module.exports = SubjectModel;