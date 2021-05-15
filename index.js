const newrelic = require('newrelic');
const dotenv = require('dotenv').config();

const fastify = require('fastify');
const autoload = require('fastify-autoload');
const path = require('path');

const routes = './postgres'; // CHANGE THIS TO CHANGE DB

const server = fastify({logger: false});

server.register(require('fastify-cors'), {
  origin: true
})

server.register(autoload, {
  dir: path.join(__dirname, routes)
});

const start = async () => {

  try {
    await server.listen(3000, '0.0.0.0');
    server.log.info('Server Started');
  } catch (err) {
    server.log.error(err);
      console.log(err);
      process.exit(1);
  }
};
start();
