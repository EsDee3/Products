const newrelic = require('newrelic');

const Koa = require('koa');
const app = new Koa();

const pgPool = require('./postgres/db');

const controller = require('./postgres');

const router = require('@koa/router')();

// ROUTES ///////////////////////////////////////
router
  .get('/:pid', controller.getProductObj)
  .get('/related/:pid', controller.getRelatedArray)
  .put('/cart', controller.updateSkuQty);


app.use(router.routes());

// CONNECT APP //////////////////////////////////

try {
  app.listen(7763);
  console.log('listening on port 7763');
} catch {
  console.log(err);
    process.exit(1);
}