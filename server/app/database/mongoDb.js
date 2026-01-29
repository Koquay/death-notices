const mongoose = require('mongoose');
const { initGridFS } = require('../util/gridfs');

module.exports = async () => {
  const DB = process.env.DB || 'mongodb://localhost:27017/deathnotices';

  await mongoose.connect(DB);
  initGridFS();

  console.log('*** CONNECTED TO MONGODB ***');
};

