const pool = require("../lib/db");


const createSpeciality = async (code_speciality, name_speciality, departement_id) => {
    try{
        const result = await pool.query(
            `INSERT INTO specialities (code_speciality, name_speciality, departement_id) VALUES ($1, $2, $3) RETURNING *`,
            [code_speciality, name_speciality, departement_id]
        );
        return result.rows[0];
    }catch(err){
        console.log("Error in createSpeciality:", err);
    }
};

const getAllSpecialities = async (id_departement) => {
    try{
        const result = await pool.query(
            'SELECT S.id, S.code_speciality, S.name_speciality, D.name AS departement_name FROM specialities S LEFT JOIN departements D ON S.departement_id = D.id where S.departement_id = $1',
            [id_departement]
        );
        return result.rows;
    }catch(err){
        console.log("Error in getAllSpecialities:", err);
    }
};

const updateSpecialityById = async (id, code_speciality, name_speciality) => {
    try{
        const result = await pool.query(
            `UPDATE specialities SET code_speciality = $1, name_speciality = $2 WHERE id = $3 RETURNING *`,
            [code_speciality, name_speciality, id]
        );
        return result.rows[0];
    }catch(err){
        console.log("Error in updateSpecialityById:", err);
    }
};

const deleteSpecialityById = async (id) => {
    try{
        const result = await pool.query(
            `DELETE FROM specialities WHERE id = $1 RETURNING *`,
            [id]
        );
        return result.rows[0];
    }catch(err){
        console.log("Error in deleteSpecialityById:", err); 
    }
};

const SpecialityModel = {
    createSpeciality,
    getAllSpecialities,
    updateSpecialityById,
    deleteSpecialityById,
}

module.exports = SpecialityModel;