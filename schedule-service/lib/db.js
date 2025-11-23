const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: "neondb_owner",
  password: "npg_rLQVx3NAgF5Z",
  host: "ep-summer-snow-adg5yii7-pooler.c-2.us-east-1.aws.neon.tech",
  database: "neondb",
  port: 5432,
  ssl: { rejectUnauthorized: false },
});

pool.connect()
  .then(client => {
    console.log("✅ Connected to Neon PostgreSQL!");
    client.release();
  })
  .catch(err => console.error("❌ Connection error:", err.stack));

module.exports = pool;