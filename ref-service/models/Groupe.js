const BaseModel = require('./_base');

class Groupe extends BaseModel {}

Groupe.table = 'groupes';
Groupe.columns = ['id', 'code_groupe', 'level_id'];
Groupe.pk = 'id';

module.exports = Groupe;
