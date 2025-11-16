const pool = require("../lib/db");




const createClassroom = async (code_classroom, capacity ,type_classroom ,id_departement) => {
    console.log(code_classroom, capacity ,type_classroom ,id_departement);
    try{
        const result = await pool.query(
            `INSERT INTO classrooms (code_classroom, capacity, type_classroom, id_departement) VALUES ($1, $2, $3, $4) RETURNING *`,
            [code_classroom, capacity ,type_classroom ,id_departement]
        );
        return result.rows[0];
    }catch(err){
        console.log("Error in createClassroom:", err);
    }
};


const getAllClassroomsByDep = async (id_departement) => {
    try{
        const result = await pool.query(
            `SELECT * FROM classrooms WHERE id_departement = $1`,
            [id_departement]
        );
        return result.rows;
    }catch(err){
        console.log("Error in getAllClassroomsByDep:", err);
    }
};


const updateClassroomById = async (id, code_classroom, capacity ,type_classroom ,id_departement) => {
    try{
        const result = await pool.query(
            `UPDATE classrooms SET code_classroom = $1, capacity = $2, type_classroom = $3, id_departement = $4 WHERE id = $5 RETURNING *`,
            [code_classroom, capacity ,type_classroom ,id_departement, id]
        );
        return result.rows[0];
    }catch(err){
        console.log("Error in updateClassroomById:", err);
    }
};


const deleteClassroomById = async (id) => {
    try{
        const result = await pool.query(
            `DELETE FROM classrooms WHERE id = $1 RETURNING *`,
            [id]
        );
        return result.rows[0];
    }catch(err){
        console.log("Error in deleteClassroomById:", err);
    }
};


const ClassroomModel = {
    createClassroom,
    getAllClassroomsByDep,
    updateClassroomById,
    deleteClassroomById
}

module.exports = ClassroomModel;