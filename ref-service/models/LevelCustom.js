const pool = require("../lib/db");

const createLevel = async (num_level, speciality_id) => {
    try{
        const result = await pool.query(
            `INSERT INTO levels (num_level, speciality_id) VALUES ($1, $2) RETURNING *`,
            [num_level, speciality_id]
        );
        return result.rows[0];
    }catch(err){
        console.log("Error in createLevel:", err);
    }
};

const getLevelsBySpeciality = async (speciality_id) => {
    try{
        const result = await pool.query(
            `SELECT * FROM levels WHERE speciality_id = $1`,
            [speciality_id]
        );
        return result.rows;
    }catch(err){
        console.log("Error in getLevelsBySpeciality:", err);
    } 
};

const deleteLevelById = async (id) => {
    try{
        const result = await pool.query(
            `DELETE FROM levels WHERE id = $1 RETURNING *`,
            [id]
        );
        return result.rows[0];
    }catch(err){
        console.log("Error in deleteLevelById:", err); 
    }
};



const LevelModel = {
    createLevel,
    getLevelsBySpeciality,
    deleteLevelById,
}

module.exports = LevelModel;