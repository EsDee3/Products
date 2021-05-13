const newrelic = require('newrelic');

const Koa = require('koa');
const app = new Koa();

const mgClient = require('./mongo/db');
const pgPool = require('./postgres/db');

const pgController = require('./postgres');
const mgController = require('./mongo');
const npController = require('./node-pg');

const controller = mgController; // CHANGE THIS TO CHANGE DB

const router = require('@koa/router')();

// ROUTES ///////////////////////////////////////
router
  .get('/pg/:pid', pgController.getProductObj)
  .get('/mg/:pid', mgController.getProductObj)
  .get('/np/:pid', npController.getProductObj)
  .get('/related/:pid', controller.getRelatedArray)
  .put('/cart', controller.updateSkuQty);


app.use(router.routes());

// CONNECT APP //////////////////////////////////
if (controller === mgController) {

  mgClient.connect('mongodb://localhost:27017/', (err) => {
    if (err) {
      console.log('Unable to connect to Mongo.');
      process.exit(1);
    } else {
      console.log('Mongo connected');

      try {
        app.listen(7763);
        console.log('listening on port 7763');
      } catch {
        console.log(err);
          process.exit(1);
      }
    }
  });

} else {

  try {
    app.listen(7763);
    console.log('listening on port 7763');
  } catch {
    console.log(err);
      process.exit(1);
  }

}