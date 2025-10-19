const BaseModel = require('./_base');

class Teacher extends BaseModel {}

Teacher.table = 'teachers';
Teacher.columns = ['id', 'uid'];
Teacher.pk = 'id';

module.exports = Teacher;
