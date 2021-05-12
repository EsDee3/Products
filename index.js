const newrelic = require('newrelic');

const Koa = require('koa');
const router = require('koa-router');
const app = new Koa();

const mgClient = require('./mongo/db');
const pgPool = require('./postgres/db');

const pgRoutes = './postgres';
const mgRoutes = './mongo';
const npRoutes = './node-pg';

const routes = npRoutes; // CHANGE THIS TO CHANGE DB

const server = require(routes);
app.use(server());

if (routes === mgRoutes) {

  mgClient.connect('mongodb://localhost:27017/', (err) => {
    if (err) {
      console.log('Unable to connect to Mongo.');
      process.exit(1);
    } else {
      console.log('Mongo connected');

      try {
        server.listen(7763);
        console.log('listening on port 7763');
      } catch {
        console.log(err);
          process.exit(1);
      }
    }
  });

} else {

  try {
    server.listen(7763);
    console.log('listening on port 7763');
  } catch {
    console.log(err);
      process.exit(1);
  }

}