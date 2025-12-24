const path = require('path');
const express = require('express');

const indexRoutes = require('../index/index.routes');
const noticesRoutes = require('../notices/notices.routes');

process.env.DIST = path.join(__dirname, "../../../client/dist/client/browser");
console.log("DIST", process.env.DIST)
process.env.INDEX = path.join(process.env.DIST, "/index.html");

module.exports = (app) => {
    console.log('server.routes called...')

    app.use(express.static(process.env.DIST))

    app.use('/api/notices', noticesRoutes)
    app.use(/(.*)/, indexRoutes);
}

