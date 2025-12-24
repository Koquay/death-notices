const { getGridFSBucket } = require('./gridfs');
const { ObjectId } = require('mongodb');

exports.deleteImageIfExists = async (imageId) => {
  if (!imageId) return;

  const gfsBucket = getGridFSBucket();

  try {
    await gfsBucket.delete(new ObjectId(imageId));
  } catch (err) {
    // Non-fatal: log but don’t block notice update
    console.warn('Failed to delete old image:', err.message);
  }
};
