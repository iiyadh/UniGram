const pool = require('../lib/db');

class User {
  static async findOne(conditions) {
    try {
      let query = 'SELECT * FROM users WHERE ';
      const params = [];
      let paramCount = 1;
      
      const entries = Object.entries(conditions);
      const clauses = entries.map(([key, value]) => {
        params.push(value);
        return `${key} = $${paramCount++}`;
      });
      
      query += clauses.join(' AND ');
      query += ' LIMIT 1';
      
      const result = await pool.query(query, params);
      return result.rows[0] || null;
    } catch (err) {
      console.error('Error in findOne:', err);
      throw err;
    }
  }

  static async findById(id) {
    try {
      const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
      return result.rows[0] || null;
    } catch (err) {
      console.error('Error in findById:', err);
      throw err;
    }
  }

  static async create(userData) {
    try {
      const { cin, username, email, password, role = 'student' } = userData;
      
      const query = `
        INSERT INTO users (cin, name, email, password, role)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;
      
      const result = await pool.query(query, [
        cin, 
        username, 
        email, 
        password, 
        role
      ]);
      
      return result.rows[0];
    } catch (err) {
      console.error('Error in create:', err);
      throw err;
    }
  }

  static async updateResetToken(email, resetToken, expiration) {
    try {
      const query = `
        UPDATE users 
        SET reset_token = $1, reset_token_expires = $2
        WHERE email = $3
        RETURNING *
      `;
      
      const result = await pool.query(query, [resetToken, new Date(expiration), email]);
      return result.rows[0];
    } catch (err) {
      console.error('Error in updateResetToken:', err);
      throw err;
    }
  }

  static async updatePassword(resetToken, password) {
    try {
      const query = `
        UPDATE users 
        SET password = $1, reset_token = NULL, reset_token_expires = NULL
        WHERE reset_token = $2
        RETURNING *
      `;
      
      const result = await pool.query(query, [password, resetToken]);
      return result.rows[0];
    } catch (err) {
      console.error('Error in updatePassword:', err);
      throw err;
    }
  }
}

module.exports = User;


