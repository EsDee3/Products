const postgres = require('postgres');

const options = {
  host: process.env.HOST,
  port: 5432,
  database: 'sdc',
  username: process.env.USERNAME,
  password: process.env.PASSWORD
};

module.exports = postgres(options);