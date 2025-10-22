const db = require("../lib/db");

const Custom_EditProfile = async (key, value, userId) => {
  try {
    const result = await db.query(
      `UPDATE users SET ${key} = $1 WHERE id = $2`,
      [value, userId]
    );
    return result.rows[0];
  } catch (err) {
    console.error("Error in Custom_EditProfile:", err);
  }
};


const Custom_CreateNewUser = async (cin , name , email , password , role) =>{
  try{
    const result = await db.query(
      `INSERT INTO users (cin, name, email, password , role) VALUES ($1, $2, $3, $4 ,$5) RETURNING *`,
      [cin , name , email , password , role]
    );
    return result.rows[0];
  }catch( err ){
    console.error("Error in Custom_CreateNewUser:", err);
  }
}

module.exports = {
  Teacher: require('./Teacher'),
  Chef: require('./Chef'),
  Departement: require('./Departement'),
  Speciality: require('./Speciality'),
  Level: require('./Level'),
  Groupe: require('./Groupe'),
  Student: require('./Student'),
  Subject: require('./Subject'),
  TeacherSubject: require('./TeacherSubject'),
  Classroom: require('./Classroom'),
  Custom_EditProfile,
  Custom_CreateNewUser,
};
