const postgres = require('postgres');

const options = {
  database: 'sdc'
};

module.exports = postgres(options);