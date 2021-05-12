require('newrelic');

const fastify = require('fastify');
const autoload = require('fastify-autoload');
const path = require('path');

const mgClient = require('./mongo/db');

const pgRoutes = './postgres';
const mgRoutes = './mongo';

const routes = pgRoutes; // CHANGE THIS TO CHANGE DB

const server = fastify({logger: false});

server.register(autoload, {
  dir: path.join(__dirname, routes)
});

// server.register(require('fastify-mongodb'), {
//   // force to close the mongodb connection when app stopped
//   // the default value is false

//   url: 'mongodb://localhost:27017/sdc'
// });
if (routes === mgRoutes) {

  mgClient.connect('mongodb://localhost:27017/', (err) => {
    if (err) {
      console.log('Unable to connect to Mongo.');
      process.exit(1);
    } else {
      console.log('Mongo connected');

      server.listen(7763, (err) => {
        if (err) {
          server.log.error(err);
          console.log(err);
          process.exit(1);
        }
        server.log.info('Server Started');
      })
    }
  });

} else {

  server.listen(7763, (err) => {
    if (err) {
      server.log.error(err);
      console.log(err);
      process.exit(1);
    }
    server.log.info('Server Started');
  })

}