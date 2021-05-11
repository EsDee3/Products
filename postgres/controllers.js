const query = require('./queries');


module.exports = {

  getOverviewData: async (pid) => {
    return await query.getProduct(pid)
    .catch((err) => {
      console.log('getOverviewData', err);
      throw err;
    })
  },

  getRelatedData: async (pid) => {
    return await query.getRelated(pid)
    .then( async relatedArray => {
      if (relatedArray) {
        return await query.getArrayProducts(relatedArray)
      }
      else {
        return null
      }
    })
    .catch( err => {
      console.log('getRelatedData', err)
    })
  },

  updateCart: async (skus) => {
    let skusArray = [];
    let newQty = skus;
    for (let sku in skus) {
      skusArray.push(sku);
    }

    const currentQty = await query.getQuantities(skusArray);

    for (let i = 0; i < currentQty.length; i++) {
      currentQty[i].sku
    }

    // return await sql`
    //   UPDATE skus SET ${
    //     sql(cartArray, 'quantity')
    //   } WHERE sku=${cartArray.sku}
    // `
  }
}