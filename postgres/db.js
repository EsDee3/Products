const postgres = require('postgres');

const options = {
  database: 'sdc'
};

module.exports = postgres(options);

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