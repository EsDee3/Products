const { db } = require('./db');

module.exports = {
  getProductObj:  async ctx => {
    let pid = ctx.params.pid || 1;

    try {

    const products = await db('sdc').collection('products');
    ctx.body = await products.findOne({ _id: parseInt(pid) });

    } catch (err) {
      console.log(err);
      return err;
    }


  },

  getRelatedArray: async ctx => {
    let pid = ctx.params.pid || 1;

    const query = { _id: parseInt(pid) };
    const options = {
      projection: { _id: 0, related: 1 }
    }

    try {

      const products = await db('sdc').collection('products');
      const { related } = await products.findOne(query, options);
      ctx.body = related;
    } catch (err) {
      console.log(err);
      return err;
    }
  },

  updateSkuQty: async ctx => {
    let skus = ctx.request.body;
    let skusArray = [];

    for (let sku in skus) {
      skusArray.push(sku);
    }

    try {
      const db = server.mongo.db
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
  }
}