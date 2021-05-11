const sql = require('./db')

module.exports = {

  getProduct: async (pid) => {
    try {
      let [ productData ] = await sql`
      WITH styles_agg AS (
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
      ), product_fnl AS (
        SELECT
          pid AS currentProductId,
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
      ) SELECT json_agg(pf.*)
      FROM product_fnl pf
      WHERE pf.currentProductId = ${pid}
      `;

      return productData.json_agg[0];
    } catch (err) {
      console.log('getProduct', err);
      return;
    }
  },

  getRelated: async (pid) => {
    try {
      const [ related ] = await sql`
        SELECT array_agg(related_id)
        FROM related
        WHERE pid=${pid}
      `;
      if (related) {
        return related.array_agg;
      }
    } catch (err) {
      console.log('getRelated', err);
      return null;
    }
  },

  getArrayProducts: async (relatedArray) => {
    let queryString = relatedArray.toString();

    try {
      let [ productData ] = await sql`
      WITH styles_agg AS (
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
      ), product_fnl AS (
        SELECT
          pid AS currentProductId,
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
      ) SELECT json_agg(pf.*)
      FROM product_fnl pf
      WHERE currentProductId IN (${relatedArray})
      `;
      return productData.json_agg;
    } catch (err) {
      console.log('getArrayProducts', err);
      return;
    }
  },

  getQuantities: async (skusArr) => {
    const currentQty = await sql`
      SELECT
        sku,
        quantity
      FROM skus
      WHERE sku IN (${skusArr})
    `;
    return currentQty;
  },

  updateInventory: async (cartArray) => {
    let count = 0;
    try {
      for (let i = 0; i < cartArray.length; i++) {
        await sql`
          UPDATE skus SET ${sql(cartArray[i], 'quantity')}
          WHERE sku=${cartArray[i].sku}
        `;
        count++;
      }
      return `${count} sku quantities updates`;
    } catch (err) {
      console.log(err);
      return err
    }
  }
}