const model = require('./model');

module.exports = {
  getProductObj: async ctx => {
    let pid = ctx.params.pid || 1;

    try {
      ctx.body = await model.getOverviewData(pid)
    } catch (err) {
      server.log.error(err)
      return err
    }
  },

  getRelatedArray: async ctx => {
    let pid = ctx.params.pid || 1;

    try {
      ctx.body = await model.getRelatedData(pid)
    } catch (err) {
      server.log.error(err)
      return err
    }
  },

  getRelatedProds: async ctx => {
    let pid = ctx.params.pid || 1;

    try {
      ctx.body = await model.getRelatedProds(pid)
    } catch (err) {
      server.log.error(err)
      return err
    }
  },

  updateSkuQty: async ctx => {
    let skus = ctx.request.body;

    try {
      ctx.body = await model.updateInventory(skus)
    } catch (err) {
      server.log.error(err)
      return err
    }
  }
}
