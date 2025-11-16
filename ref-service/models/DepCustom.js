const pool = require("../lib/db");


const createDep = async (name) => {
    try{
        const result = await pool.query(
            `INSERT INTO departements (name) VALUES ($1) RETURNING *`,
            [name]
        );
        return result.rows[0];
    }catch(err){
        console.log("Error in createDep:", err);
    }
};


const getAllDeps = async () => {
    try{
        const result = await pool.query(
            'SELECT D.id ,D.name , D.uid , U.name AS teacher_name FROM departements D LEFT JOIN teachers T ON D.uid = T.id LEFT JOIN users U ON T.uid = U.id');
        return result.rows;
    }catch(err){
        console.log("Error in getAllDeps:", err);
    }
};

const listTeachers = async () =>{
    try{
        const result = await pool.query(
            `SELECT T.id , U.name FROM teachers T LEFT JOIN users U ON T.uid = U.id`
        );
        return result.rows;
    }catch(err){
        console.log("Error in listteachers:", err);
    }
}

const updateDepbyId = async (id, name, uid) => {
    try{
        console.log(id,name,uid);
        const result = await pool.query(
            `UPDATE departements SET name = $1 , uid = $2 WHERE id = $3 RETURNING *`,
            [name, uid, id]
        );
        return result.rows[0];
    }catch(err){
        console.log("Error in updateDepbyId:", err);
    }
} 


const deleteDepbyId = async (id) => {
    try{
        const result = await pool.query(
            `DELETE FROM departements WHERE id = $1 RETURNING *`,
            [id]
        );
        return result.rows[0];
    }catch(err){
        console.log("Error in deleteDepbyId:", err);
    }   
};

const DepartementModel = {
    createDep,
    getAllDeps,
    updateDepbyId,
    deleteDepbyId,
    listTeachers
}

module.exports = DepartementModel;