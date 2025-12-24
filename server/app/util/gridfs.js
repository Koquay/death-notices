const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');

let bucket;

const initGridFS = () => {
  const db = mongoose.connection.db;

  if (!db) {
    throw new Error('MongoDB connection not ready for GridFS');
  }

  bucket = new GridFSBucket(db, {
    bucketName: 'noticeImages'
  });

  console.log('*** GRIDFS INITIALIZED ***');
};

const getGridFSBucket = () => {
  if (!bucket) {
    throw new Error('GridFSBucket not initialized');
  }
  return bucket;
};

module.exports = { initGridFS, getGridFSBucket };

