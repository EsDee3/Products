const fastify = require('fastify')({ logger: false });

fastify.register(require('fastify-mongodb'), {
  // force to close the mongodb connection when app stopped
  // the default value is false
  forceClose: true,

  url: 'mongodb://localhost:27017/sdc'
})

module.exports = async (server, options) => {
  server.register(require('fastify-mongodb'), {
    // force to close the mongodb connection when app stopped
    // the default value is false
    forceClose: true,

    url: 'mongodb://localhost:27017/sdc'
  });


  server.get('/:pid',  async (req, res) => {
    let pid = req.params.pid || 1;

    const db = fastify.mongo.db
    db.collection('products', onCollection)

    const onCollection = (err, col) => {
      if (err) return reply.send(err);

      col.findOne({ _id: pid }, (err, data) => {
        let product = data;
        product.currentProductId = data._id;
        delete product._id;
        reply.send(product)
      })
    }
  });

  server.get('/related/:pid', async (req, res) => {
    let pid = req.params.pid || 1;

    const db = fastify.mongo.db
    db.collection('products', onCollection)

    const onCollection = (err, col) => {
      if (err) return reply.send(err);

      col
        .findOne({ _id: pid })
        .project({related: 1, _id: 0}, (err, data) => {
        reply.send(data);
      })
    }
  });

  server.put('cart', async (req, res) => {
    let skus = req.body;
    let skusArray = [];

    for (let sku in skus) {
      skusArray.push(sku);
    }

    try {
      const db = fastify.mongo.db
      db.collection('products', onCollection)

      const onCollection = (err, col) => {
        if (err) return reply.send(err);

        col
          .find({ 'styles.skus.sku': {$all: skusArray} }, getNewQty)
      }

      const getNewQty = (err, data) => {
        if (err) return reply.send(err);

        // GET DIFFERENCE AND
        reply.send('OK');
      }

    } catch (err) {
      server.log.error(err)
      return err
    }
  });
}