const BaseModel = require('./_base');

class Level extends BaseModel {}

Level.table = 'levels';
Level.columns = ['id', 'num_level', 'speciality_id'];
Level.pk = 'id';

module.exports = Level;
