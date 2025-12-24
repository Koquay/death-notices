console.log('index.routes called...')

const router = require('express').Router();
const indexController = require('./index.controller')

router.get('/', indexController.redirectClient);

module.exports = router;