const newrelic = require('newrelic');
const dotenv = require('dotenv').config();

const Koa = require('koa');
const app = new Koa();

const pgPool = require('./postgres/db');
const controller = require('./postgres');

// ROUTES ///////////////////////////////////////
const router = require('@koa/router')();

router
  .get('/loaderio-3b303524c9bdca80e9e630b00467a94b', async (ctx) => {
    ctx.body = 'loaderio-3b303524c9bdca80e9e630b00467a94b';
  })
  .get('/:pid', controller.getProductObj)
  .get('/related/:pid', controller.getRelatedArray)
  .put('/cart', controller.updateSkuQty);


app.use(router.routes());
// CONNECT APP //////////////////////////////////

try {
  app.listen(3000);
  console.log('listening on port 3000');
} catch {
  console.log(err);
    process.exit(1);
}
