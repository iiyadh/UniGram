const pool = require("../lib/db");

const createGroup = async (code_groupe, level_id) => {
	try{
		const result = await pool.query(
			`INSERT INTO groupes (code_groupe, level_id) VALUES ($1, $2) RETURNING *`,
			[code_groupe, level_id]
		);
		return result.rows[0];
	}catch(err){
		console.log("Error in createGroup:", err);
	}
};

const getAllGroupsByLevel = async (id_level) => {
	try{
		const result = await pool.query(
			`SELECT g.id, g.code_groupe, l.num_level FROM groupes g LEFT JOIN levels l ON g.level_id = l.id WHERE l.id = $1`,
            [id_level]
		);
		return result.rows;
	}catch(err){
		console.log("Error in getAllGroups:", err);
	}
}

const updateGroupById = async (id, code_groupe) => {
	try{
		const result = await pool.query(
			`UPDATE groupes SET code_groupe = $1 WHERE id = $2 RETURNING *`,
			[code_groupe, id]
		);
		return result.rows[0];
	}catch(err){
		console.log("Error in updateGroupById:", err);
	}
};

const deleteGroupById = async (id) =>{
	try{
		const result = await pool.query(
			`DELETE FROM groupes WHERE id = $1 RETURNING *`,
			[id]
		);
		return result.rows[0];
	}catch(err){
		console.log("Error in deleteGroupById:", err);
	}
};

const GroupModel = {
	createGroup,
	getAllGroupsByLevel,
	updateGroupById,
	deleteGroupById
};

module.exports = GroupModel;

