const { Pool } = require('pg');

module.exports = new Pool({
  database: 'sdc',
  max: 2000,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
})
