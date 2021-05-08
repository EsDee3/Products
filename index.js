const fastify = require('fastify')({ logger: true })
const controller = require('./controllers')

fastify.get('/:pid', async (req, res) => {
  let pid = req.params.pid || 1;

  try {
    return await controller.getOverviewData(pid)
  } catch (err) {
    fastify.log.error(err)
    return err
  }
})

const start = async () => {
  try {
    await fastify.listen(7763)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()