const query = require('./queries');


module.exports = {
  // BATCH QUERIES
  getOverviewData: (pid) => {
    let fnlRes = {currentProductId: pid};
    return query.getProduct(pid)
    .then((productData) => {
      fnlRes.product = productData;
      return query.getStyles(pid);
    })
    .then((stylesData) => {
      fnlRes.styles = stylesData;
      return fnlRes;
    })
    .catch((err) => {
      console.log('Error getting data for related', err);
      throw err;
    })
  },

  getDetailsSlim: (pid) => {
    let fnlRes = {currentProductId: pid};
    return query.getProduct(pid)
    .then((productData) => {
      fnlRes.product = productData;
      return query.getStyles(pid)
    })
    .then((stylesData) => {
      fnlRes.styles = stylesData;
      fnlRes.meta = null;
      return fnlRes;
    })
    .catch((err) => {
      console.log('Error getting data for related', err);
      return fnlRes;
    })
  }
}