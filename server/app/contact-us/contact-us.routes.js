const router = require('express').Router();
const contactUsController = require('./contact-us.controller');


router.post('/', contactUsController.sendMessage);

module.exports = router;