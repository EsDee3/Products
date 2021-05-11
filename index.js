const fastify = require('fastify');
const autoload = require('fastify-autoload');
const path = require('path');

const pgRoutes = './postgres';
const mgRoutes = './mongo';

const routes = pgRoutes;

const server = fastify({logger: false});

server.register(autoload, {
  dir: path.join(__dirname, routes)
});




// ROUTE ////////////////////////////////////////
// fastify.get('/:pid', route.getProduct);

// fastify.get('/related/:pid', route.getRelated);

// fastify.put('/cart', route.updateInventory);


//   const mgController = require('./mongo/controllers');

//   fastify.register(require('fastify-mongodb'), {
//     // force to close the mongodb connection when app stopped
//     // the default value is false
//     forceClose: true,

//     url: 'mongodb://localhost:27017/sdc'
//   })


//   fastify.get('/related/:pid', async (req, res) => {
//     let pid = req.params.pid || 1;

//     try {
//       const {related} = await pgController.getRelatedData(pid);
//       return related;
//     } catch (err) {
//       fastify.log.error(err)
//       return err
//     }
//   })



// SERVER START /////////////////////////////////
server.listen(7763, (err) => {
  if (err) {
    server.log.error(err);
    console.log(err);
    process.exit(1);
  }
  server.log.info('Server Started');
})