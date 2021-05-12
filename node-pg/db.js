const { Pool } = require('pg');

module.exports = new Pool({
  database: 'sdc',
  max: 200,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
})
