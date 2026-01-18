const path = require('path');
const express = require('express');

const indexRoutes = require('../index/index.routes');
const noticesRoutes = require('../notices/notices.routes');
const memoriamsRoutes = require('../memoriams/memoriams.routes');
const paymentRoutes = require('../payment/payment.routes');
const contactUsRoutes = require('../contact-us/contact-us.routes');

process.env.DIST = path.join(__dirname, "../../../client/dist/client/browser");
console.log("DIST", process.env.DIST)
process.env.INDEX = path.join(process.env.DIST, "/index.html");

module.exports = (app) => {
    console.log('server.routes called...')

    app.use(express.static(process.env.DIST))

    app.use('/api/notices', noticesRoutes)
    app.use('/api/memoriams', memoriamsRoutes)
    app.use('/api/payment', paymentRoutes)
    app.use('/api/contact-us', contactUsRoutes)
    app.use(/(.*)/, indexRoutes);
}

