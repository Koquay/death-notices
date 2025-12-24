require('dotenv').config({ path: './.env' });

const express = require('express');
const app = express();

const configureMiddleware = require('./app/middleware/server.middleware');
const configureRoutes = require('./app/routes/server.routes');

const connectDB = require('./app/database/mongoDb');
const { initGridFS } = require('./app/util/gridfs');

configureMiddleware(app);
configureRoutes(app);

(async () => {
  await connectDB();   // ✅ connect ONCE
  initGridFS();        // ✅ now db exists
})();

const PORT = process.env.PORT || process.env.LOCAL_PORT;

app.listen(PORT, () => {
  console.log(`DeathNotices listening on port ${PORT}`);
});
