const BaseModel = require('./_base');

class Classroom extends BaseModel {}

Classroom.table = 'classrooms';
Classroom.columns = ['id', 'code_classroom', 'capacity', 'type_classroom', 'id_departement'];
Classroom.pk = 'id';

module.exports = Classroom;
