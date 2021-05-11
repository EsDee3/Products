const MongoClient = require('mongodb').MongoClient;
const { Pool } = require('pg')
const Cursor = require('pg-cursor')

const url = 'mongodb://localhost:27017';
const dbName = 'sdc';

const relatedQuery = `
  SELECT
    pid AS _id,
    array_agg(related_id) AS related
  FROM related
  GROUP BY pid
`;

const prodQuery = `WITH styles_agg AS (
  SELECT
    pid,
    style_id,
    name,
    original_price::decimal,
    sale_price::decimal,
    COALESCE(sk_array, json_build_array(json_build_object(
      'sku', 0,
      'size', 'none',
      'quantity', 0
    ))) AS skus,
    COALESCE(ph_array, json_build_array(json_build_object(
      'thumbnail_url', null,
      'url', null
    ))) AS photos
  FROM styles st
  LEFT JOIN LATERAL (
    SELECT json_agg(json_build_object(
      'sku', sk.sku,
      'size', sk.size,
      'quantity', sk.quantity
    )) AS sk_array
    FROM skus sk
    WHERE sk.style_id = st.style_id
  ) skus ON true
  LEFT JOIN LATERAL (
    SELECT json_agg(json_build_object(
      'thumbnail_url', ph.thumbnail_url,
      'url', ph.url
    )) AS ph_array
    FROM photos ph
    WHERE ph.style_id = st.style_id
  ) photos ON true
), product_agg AS (
  SELECT
    pid,
    name,
    slogan,
    description,
    category,
    COALESCE(f_array, json_build_array()) AS features
  FROM products pr
  LEFT JOIN LATERAL (
    SELECT json_agg(json_build_object(
      'feature', f.feature,
      'value', f.value
    )) AS f_array
    FROM features f
    WHERE f.pid = pr.pid
  ) features ON true
) SELECT
    pid AS _id,
    product,
    styles
  FROM products p
  LEFT JOIN LATERAL (
    SELECT json_build_object(
      'name', pa.name,
      'slogan', pa.slogan,
      'description', pa.description,
      'category', pa.category,
      'features', pa.features
    ) AS product
    FROM product_agg pa
    WHERE pa.pid = p.pid
  ) product ON true
  LEFT JOIN LATERAL (
    SELECT json_agg(json_build_object(
      'style_id', sa.style_id,
      'name', sa.name,
      'original_price', sa.original_price,
      'sale_price', sa.sale_price,
      'skus', sa.skus,
      'photos', sa.photos
    )) AS styles
    FROM styles_agg sa
    WHERE sa.pid = p.pid
  ) styles ON true
`;

(async function() {
  const mgClient = new MongoClient(url, { useUnifiedTopology: true });
  const pgPool = new Pool({
    database: 'sdc'
  });

  try {
    var start = Date.now();
    console.log(`Start: ${String(start)}`)

    await mgClient.connect();
    console.log(`Connected to ${url}`)
    const db = mgClient.db(dbName);

    const pgClient = await pgPool.connect();
    console.log('pg client connected');

    const prodCursor = pgClient.query(new Cursor(prodQuery));
    const relatedCursor = pgClient.query(new Cursor(relatedQuery));

    const readToEnd = (cursor, collection) => {
      cursor.read(1000, async (err, rows) => {
        if (err) {
          console.log(err);
        }
        if (rows.length > 0) {
          await db.collection(collection).insertMany(rows);
          readToEnd(cursor, collection);
        } else {
          cursor.close();
          if (collection = 'products') {
            await db.collection('products').createIndex([{'styles.style_id': 1}, {'styles.skus.sku': 1}])
          }
          let end = Date.now();
          console.log(`${collection} end: ${String(end)}`)
          console.log(`Total Elapsed Time: ${String(end - start)} ms`)
          return;
        }
      })
    }

    await readToEnd(prodCursor, 'products');
    await readToEnd(relatedCursor, 'related');
    return;

  } catch (err) {
    console.log(err.stack);
    return;
  }
})();