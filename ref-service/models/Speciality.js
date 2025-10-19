const BaseModel = require('./_base');

class Speciality extends BaseModel {}

Speciality.table = 'specialities';
Speciality.columns = ['id', 'code_speciality', 'name_speciality', 'departement_id'];
Speciality.pk = 'id';

module.exports = Speciality;
