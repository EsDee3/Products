const newrelic = require('newrelic');
const dotenv = require('dotenv').config();

const fastify = require('fastify');
const autoload = require('fastify-autoload');
const path = require('path');

const mgClient = require('./mongo/db');
const server = fastify({logger: false});

// LOADER.IO ////////////////////////////////////
server.get('/loaderio-5779d20823431a33bac90cec76680362/', async (req, res) => {
  return 'loaderio-5779d20823431a33bac90cec76680362';
});

// POSTGRES ROUTES ////////////////////////////
const pgController = require('./postgres/controllers');

server.get('/pg/:pid', async (req, res) => {
  let pid = req.params.pid || 1;

  try {
    return await pgController.getOverviewData(pid)
  } catch (err) {
    server.log.error(err)
    return err
  }
});

server.get('/pg/related/:pid', async (req, res) => {
  let pid = req.params.pid || 1;

  try {
    return await pgController.getRelatedData(pid)
  } catch (err) {
    server.log.error(err)
    return err
  }
});

server.get('/pg/related/products/:pid', async (req, res) => {
  let pid = req.params.pid || 1;

  try {
    return await pgController.getRelatedProds(pid)
  } catch (err) {
    server.log.error(err)
    return err
  }
});

server.put('/pg/cart', async (req, res) => {
  let skus = req.body;

  try {
    return await pgController.updateInventory(skus)
  } catch (err) {
    server.log.error(err)
    return err
  }
});

// MONGO ROUTES ///////////////////////////////
const { db } = require('./mongo/db');

server.get('/mg/:pid',  async (request, reply) => {
  let pid = request.params.pid || 1;

  const query = { _id: parseInt(pid) };
  const options = {
    projection: { _id: 0, related: 0 }
  }

  try {

  const products = await db('sdc').collection('products');
  return await products.findOne(query, options);

  } catch (err) {
    console.log(err);
    return err;
  }
});

server.get('/mg/related/:pid', async (request, reply) => {
  let pid = request.params.pid || 1;

  const query = { _id: parseInt(pid) };
  const options = {
    projection: { _id: 0, related: 1 }
  }

  try {

    const products = await db('sdc').collection('products');
    const { related } = await products.findOne(query, options);
    return related;
  } catch (err) {
    console.log(err);
    return err;
  }
});

server.put('/mg/cart', async (request, reply) => {
  let skus = request.body;
  let skusArray = [];

  for (let sku in skus) {
    skusArray.push(sku);
  }

  try {
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
});

// CONNECT TO MONGO & START SERVER //////////////
mgClient.connect('mongodb://localhost:27017/', async (err) => {
  if (err) {
    console.log('Unable to connect to Mongo.');
  } else {
    console.log('Mongo connected');
  }

  try {
    await server.listen(3000, '0.0.0.0');
    server.log.info('Server Started');
  } catch (err) {
    server.log.error(err);
    console.log(err);
    process.exit(1);
  }
});