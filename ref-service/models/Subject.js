const BaseModel = require('./_base');

class Subject extends BaseModel {}

Subject.table = 'subjects';
Subject.columns = ['id', 'type_subject', 'name_subject', 'id_level', 'credits', 'coefficient'];
Subject.pk = 'id';

module.exports = Subject;
