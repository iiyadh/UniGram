const BaseModel = require('./_base');

class Departement extends BaseModel {}

Departement.table = 'departements';
Departement.columns = ['id', 'name', 'chef_id'];
Departement.pk = 'id';

module.exports = Departement;
