const fastify = require('fastify')({ logger: false });

fastify.register(require('fastify-mongodb'), {
  // force to close the mongodb connection when app stopped
  // the default value is false
  forceClose: true,

  url: 'mongodb://localhost:27017/sdc'
})

module.export = {

  getProduct: async (req, res) => {
    let pid = req.params.pid || 1;

    const db = fastify.mongo.db
    db.collection('products', onCollection)

    const onCollection = (err, col) => {
      if (err) return reply.send(err)

      col.findOne({ id: pid }, (err, data) => {
        let product = data;
        product.currentProductId = data._id;
        delete product._id;
        reply.send(product)
      })
    }
  },

  getRelated: async (req, res) => {
    let pid = req.params.pid || 1;

    try {
      return await pgController.getRelatedData(pid)
    } catch (err) {
      fastify.log.error(err)
      return err
    }
  },

  updateInventory: async (req, res) => {
    let skus = req.body;

    try {
      return await pgController.updateCart(skus)
    } catch (err) {
      fastify.log.error(err)
      return err
    }
  }
}