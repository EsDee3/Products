const fastify = require('fastify')({ logger: false })

const database = 'postgres';

// POSTGRES ROUTES //////////////////////////////
if (database === 'postgres') {
  const pgController = require('./postgres/controllers')

  fastify.get('/:pid', async (req, res) => {
    let pid = req.params.pid || 1;

    try {
      return await pgController.getOverviewData(pid)
    } catch (err) {
      fastify.log.error(err)
      return err
    }
  })

  fastify.get('/related/:pid', async (req, res) => {
    let pid = req.params.pid || 1;

    try {
      return await pgController.getRelatedData(pid)
    } catch (err) {
      fastify.log.error(err)
      return err
    }
  })

  fastify.put('/cart', async (req, res) => {
    let skus = req.body;

    try {
      return await pgController.updateCart(skus)
    } catch (err) {
      fastify.log.error(err)
      return err
    }
  })
} else {
// MONGO ROUTES //////////////////////////////
  const mgController = require('./mongo/controllers');

  fastify.register(require('fastify-mongodb'), {
    // force to close the mongodb connection when app stopped
    // the default value is false
    forceClose: true,

    url: 'mongodb://localhost:27017/sdc'
  })

  fastify.get('/:pid', async (req, res) => {
    let pid = req.params.pid || 1;

    const db = this.mongo.db
    db.collection('products', onCollection)

    const onCollection = (err, col) => {
      if (err) return reply.send(err)

      col.findOne({ id: pid }, (err, user) => {
        reply.send(user)
      })
    }
  })

  fastify.get('/related/:pid', async (req, res) => {
    let pid = req.params.pid || 1;

    try {
      const {related} = await pgController.getRelatedData(pid);
      return related;
    } catch (err) {
      fastify.log.error(err)
      return err
    }
  })

}


// SERVER START /////////////////////////////////
const start = async () => {
  try {
    await fastify.listen(7763)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()