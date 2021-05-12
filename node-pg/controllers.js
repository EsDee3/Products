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

  updateInventory: async (skus) => {
    // let cart = [];

    // for (let sku in skus) {
    //   let obj = {
    //     sku: sku,
    //     quantity: skus[sku]
    //   };
    //   cart.push(obj);
    // }

    // try {
    //   return await query.updateInventory(cart);
    // } catch (err) {
    //   console.log(err);
    //   return err;
    // }


    let skusArray = [];
    let newQty = skus;
    for (let sku in skus) {
      skusArray.push(sku);
    }

    const currentQty = await query.getQuantities(skusArray);

    for (let i = 0; i < currentQty.length; i++) {
      let quantity = currentQty[i].quantity - skus[currentQty[i].sku];
      newQty[currentQty[i].sku] = quantity >=0 ? quantity: 0;
    }

    let cartArray = [];

    for (let prop in newQty) {
      let obj = {sku: prop, quantity: newQty[prop]};
      cartArray.push(obj);
    }

    return await query.updateInventory(cartArray);
  }
}