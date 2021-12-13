const Product = require('../models/product');

/* 
  TODO: make all the routes needed for a true api 
  - The addNewProduct Method should have a image upload helper function
  - updateProduct
  - getProductById
  - getProductsByCategory
  - deleteProductById
*/
const getAllProductsStatic = async (req, res) => {
  const products = await Product.find({})
    .sort('price')
    .select('name price');

  res.status(200).json({ products, nbHits: products.length });
};
const getAllProducts = async (req, res) => {
  const { featured, category, name, sort, fields, numericFilters } = req.query;
  const queryObject = {};

  if (featured) {
    queryObject.featured = featured === 'true' ? true : false;
  }
  if (category) {
    queryObject.category = category;
  }
  if (name) {
    queryObject.name = { $regex: name, $options: 'i' };
  }
  if (numericFilters) {
    const operatorMap = {
      '>': '$gt',
      '>=': '$gte',
      '=': '$eq',
      '<': '$lt',
      '<=': '$lte',
    };
    const regEx = /\b(<|>|>=|=|<|<=)\b/g;
    let filters = numericFilters.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    );
    const options = ['price', 'rating'];
    filters = filters.split(',').forEach((item) => {
      const [field, operator, value] = item.split('-');
      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) };
      }
    });
  }

  let result = Product.find(queryObject);
  // sort
  if (sort) {
    const sortList = sort.split(',').join(' ');
    result = result.sort(sortList);
  } else {
    result = result.sort('createdAt');
  }

  if (fields) {
    const fieldsList = fields.split(',').join(' ');
    result = result.select(fieldsList);
  }
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);
  // 23
  // 4 7 7 7 2

  const products = await result;
  res.status(200).json({ products, nbHits: products.length });
};

module.exports = {
  getAllProducts,
  getAllProductsStatic,
};
