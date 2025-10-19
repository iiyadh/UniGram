const pool = require("../lib/db");

class BaseModel {
  static _ensureConfigured() {
    if (!this.table || !Array.isArray(this.columns) || this.columns.length === 0) {
      throw new Error(`${this.name} is not configured. Set static table and columns.`);
    }
  }

  static _toArrayPk() {
    return Array.isArray(this.pk) ? this.pk : [this.pk];
  }

  static _pickAllowed(data) {
    const cols = new Set(this.columns);
    const pkSet = new Set(this._toArrayPk());
    const picked = {};
    for (const [k, v] of Object.entries(data || {})) {
      if (cols.has(k) && !pkSet.has(k)) picked[k] = v;
    }
    return picked;
  }

  static _buildWhere(conditions = {}, startIndex = 1) {
    const entries = Object.entries(conditions).filter(([_, v]) => v !== undefined);
    if (entries.length === 0) return { clause: '', values: [], nextIndex: startIndex };
    const parts = [];
    const values = [];
    let idx = startIndex;
    for (const [key, value] of entries) {
      parts.push(`${key} = $${idx++}`);
      values.push(value);
    }
    return { clause: `WHERE ${parts.join(' AND ')}`, values, nextIndex: idx };
  }

  static async findOne(where = {}) {
    this._ensureConfigured();
    const { clause, values } = this._buildWhere(where, 1);
    const sql = `SELECT * FROM ${this.table} ${clause} LIMIT 1`;
    const { rows } = await pool.query(sql, values);
    return rows[0] || null;
  }

  static async findAll(options = {}) {
    this._ensureConfigured();
    const { where = {}, limit, offset, orderBy } = options;
    const { clause, values, nextIndex } = this._buildWhere(where, 1);
    const parts = [`SELECT * FROM ${this.table}`, clause].filter(Boolean);
    if (orderBy) parts.push(`ORDER BY ${orderBy}`);
    if (typeof limit === 'number') parts.push(`LIMIT $${nextIndex}`);
    const finalValues = [...values];
    let idx = nextIndex;
    if (typeof limit === 'number') finalValues.push(limit);
    if (typeof offset === 'number') {
      parts.push(`OFFSET $${idx}`);
      finalValues.push(offset);
    }
    const sql = parts.join(' ');
    const { rows } = await pool.query(sql, finalValues);
    return rows;
  }

  static async findById(idOrKey) {
    this._ensureConfigured();
    const pk = this._toArrayPk();
    let where = {};
    if (pk.length === 1) {
      where[pk[0]] = idOrKey;
    } else {
      if (typeof idOrKey !== 'object' || idOrKey === null) {
        throw new Error(`${this.name}.findById expects an object with keys: ${pk.join(', ')}`);
      }
      where = Object.fromEntries(pk.map(k => [k, idOrKey[k]]));
    }
    return this.findOne(where);
  }

  static async create(data = {}) {
    this._ensureConfigured();
    const payload = this._pickAllowed(data);
    const keys = Object.keys(payload);
    if (keys.length === 0) throw new Error(`${this.name}.create received no valid columns.`);
    const placeholders = keys.map((_, i) => `$${i + 1}`);
    const sql = `INSERT INTO ${this.table} (${keys.join(', ')}) VALUES (${placeholders.join(', ')}) RETURNING *`;
    const { rows } = await pool.query(sql, keys.map(k => payload[k]));
    return rows[0];
  }

  static async update(idOrKey, data = {}) {
    this._ensureConfigured();
    const payload = this._pickAllowed(data);
    const setKeys = Object.keys(payload);
    if (setKeys.length === 0) throw new Error(`${this.name}.update received no updatable columns.`);

    const setClause = setKeys.map((k, i) => `${k} = $${i + 1}`).join(', ');

    const pk = this._toArrayPk();
    const whereObj = pk.length === 1 ? { [pk[0]]: idOrKey } : Object.fromEntries(pk.map(k => [k, idOrKey[k]]));
    const { clause, values } = this._buildWhere(whereObj, setKeys.length + 1);

    const sql = `UPDATE ${this.table} SET ${setClause} ${clause} RETURNING *`;
    const params = [...setKeys.map(k => payload[k]), ...values];
    const { rows } = await pool.query(sql, params);
    return rows[0] || null;
  }

  static async deleteById(idOrKey) {
    this._ensureConfigured();
    const pk = this._toArrayPk();
    const whereObj = pk.length === 1 ? { [pk[0]]: idOrKey } : Object.fromEntries(pk.map(k => [k, idOrKey[k]]));
    const { clause, values } = this._buildWhere(whereObj, 1);
    const sql = `DELETE FROM ${this.table} ${clause} RETURNING *`;
    const { rows } = await pool.query(sql, values);
    return rows[0] || null;
  }
}
// Defaults to be overridden by subclasses
BaseModel.table = null;
BaseModel.columns = [];
BaseModel.pk = 'id';

module.exports = BaseModel;
