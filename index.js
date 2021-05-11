const fastify = require('fastify');
const autoload = require('fastify-autoload');
const path = require('path');

const pgRoutes = './postgres';
const mgRoutes = './mongo';

const routes = pgRoutes; // CHANGE THIS TO CHANGE DB

const server = fastify({logger: false});

server.register(autoload, {
  dir: path.join(__dirname, routes)
});

server.listen(7763, (err) => {
  if (err) {
    server.log.error(err);
    console.log(err);
    process.exit(1);
  }
  server.log.info('Server Started');
})