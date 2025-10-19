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
};
