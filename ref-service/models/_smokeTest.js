// Non-destructive smoke test for models: imports and simple SELECTs with LIMIT 1.
const pool = require('../lib/db');
const Models = require('./index');

async function main() {
  const modelNames = Object.keys(Models);
  for (const name of modelNames) {
    const Model = Models[name];
    try {
      const rows = await Model.findAll({ limit: 1 });
      console.log(`✅ ${name}: OK (returned ${rows.length})`);
    } catch (e) {
      console.error(`❌ ${name}:`, e.message);
    }
  }
}

main()
  .catch(err => console.error('Smoke test failed:', err))
  .finally(() => pool.end());
