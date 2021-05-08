const sql = require('./db')

module.exports = {

  getProduct: async (pid) => {
    let productData = {}

    const [ prodQuery ] = await sql`
      SELECT
        name,
        slogan,
        description,
        category
      FROM products
      WHERE
        pid=${pid}
    `;
    try {
      if (prodQuery) {
        productData = prodQuery;

        const featQuery = await sql`
          SELECT feature, value
          FROM features
          WHERE pid=${pid}
            AND to_jsonb(features)=jsonb_strip_nulls(to_jsonb(features))
        `;

        try {
          if (featQuery) {
            productData.features = featQuery;
            return productData;
          }
        } catch (err) {
          console.log('Error getting product:', err);
          return;
        }
      }
    } catch (err) {
      console.log('Error getting features:', err);
      return;
    }
  },

  getStyles: async (pid) => {
    let styles = await sql`
      SELECT
        style_id,
        name,
        original_price::decimal,
        sale_price::decimal,
        array_agg (
          row_to_json(
            photos
          )
          ORDER BY id
        ) photos,
        array_agg (
          row_to_json(
            skus
          )
          ORDER BY sku
        ) skus
      FROM styles
      LEFT JOIN photos USING (style_id)
      LEFT JOIN skus USING (style_id)
      WHERE pid=${pid}
      GROUP BY style_id
      ORDER BY default_style desc
    `;

    try {
      if (styles.length > 0) {
        for (let i = 0; i < styles.length; i++) {
          if (styles[i].photos === null) {
            styles[i].photos = [{
              thumbnail_url: null,
              url: null
            }]
          }
          if (styles[i].skus === null) {
            styles[i].skus = [{
              quantity: 0,
              size: 0,
              sku: 0
            }]
          }
        }
        return styles;
      }
    } catch (err) {
      console.log('getStyles', err);
      return null;
    }
  },

  getRelated: async (pid) => {
    const [ related ] = await sql`
      SELECT array_agg(related_id)
      FROM related
      WHERE pid=${pid}
    `;

    try {
      if (related) {
        return related.array_agg;
      }
    } catch (err) {
      console.log('getRelated', err);
      return null;
    }
  }
}