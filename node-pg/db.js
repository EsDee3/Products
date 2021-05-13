const { Pool } = require('pg');

module.exports = new Pool({
  database: 'sdc',
  // max: 2000,
  // idleTimeoutMillis: 0,
  // connectionTimeoutMillis: 0
})
