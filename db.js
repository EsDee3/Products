const postgres = require('postgres');
// const auth = require('./../../db.config.js');
const options = {
  database: 'sdc'
};

const sql = postgres(options);

// const test = async () => {

//   const [ test ] = await sql`
//     SELECT pid, name FROM products WHERE pid=1
//   `;
//   try {
//     if (test) {
//       console.log(test);
//     }
//   } catch (err) {
//     console.log(err);
//     return;
//   }
// };

// test();

module.exports = sql;