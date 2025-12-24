const router = require('express').Router();
const productController = require('./product.controller');

router.get('/', productController.fetchProducts)
// router.get('/:productId', productController.getProduct)
// router.get('/search/1', productController.searchForProducts)


module.exports = router;