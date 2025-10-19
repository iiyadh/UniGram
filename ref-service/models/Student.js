const BaseModel = require('./_base');

class Student extends BaseModel {}

Student.table = 'students';
Student.columns = ['id', 'uid', 'groupe_id'];
Student.pk = 'id';

module.exports = Student;
