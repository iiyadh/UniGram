const BaseModel = require('./_base');

class Chef extends BaseModel {}

Chef.table = 'chefs';
Chef.columns = ['id', 'uid'];
Chef.pk = 'id';

module.exports = Chef;
