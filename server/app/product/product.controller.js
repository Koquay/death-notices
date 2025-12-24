const productsService = require('./products.service');

exports.fetchProducts = (req, res) => {
    productsService.fetchProducts(req, res);
}