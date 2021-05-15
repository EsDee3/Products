const pgController = require('./controllers')

module.exports = async (server, options) => {
  server.get('/:pid', async (req, res) => {
    let pid = req.params.pid || 1;

    try {
      return await pgController.getOverviewData(pid)
    } catch (err) {
      server.log.error(err)
      return err
    }
  });

  server.get('/related/:pid', async (req, res) => {
    let pid = req.params.pid || 1;

    try {
      return await pgController.getRelatedData(pid)
    } catch (err) {
      server.log.error(err)
      return err
    }
  });

  server.put('/cart', async (req, res) => {
    let skus = req.body;

    try {
      return await pgController.updateInventory(skus)
    } catch (err) {
      server.log.error(err)
      return err
    }
  });

}