const model = require('./model')

module.exports = {
  getProductObj: async ctx => {
    let pid = ctx.params.pid || 1;

    try {
      ctx.body = await model.getOverviewData(pid)
    } catch (err) {
      console.error(err)
      return err
    }
  },

  getRelatedArray: async ctx => {
    let pid = ctx.params.pid || 1;

    try {
      ctx.body = await model.getRelatedData(pid)
    } catch (err) {
      console.error(err)
      return err
    }
  },

  updateSkuQty: async ctx => {
    let skus = ctx.request.body;

    try {
      ctx.body = await model.updateInventory(skus)
    } catch (err) {
      console.error(err)
      return err
    }
  }
}