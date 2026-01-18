const contactUsService = require('./contact-us.service');

exports.sendMessage = (req, res) => {
    console.log('contactUs.controller called...')
    contactUsService.sendMessage(req, res);
}