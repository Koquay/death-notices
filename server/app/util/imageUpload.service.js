const sharp = require('sharp');
const { getGridFSBucket } = require('./gridfs');


/**
 * Compresses and uploads an image to GridFS
 * @returns {Promise<ObjectId>} imageId
 */
exports.uploadNoticeImage = async (file) => {
  if (!file) return null;

  const compressedBuffer = await sharp(file.buffer)
    .rotate()
    .resize({ width: 1200, withoutEnlargement: true })
    .jpeg({ quality: 80, mozjpeg: true })
    .toBuffer();

  const gfsBucket = getGridFSBucket();

  return new Promise((resolve, reject) => {
    const uploadStream = gfsBucket.openUploadStream(
      file.originalname.replace(/\.\w+$/, '.jpg'),
      { contentType: 'image/jpeg' }
    );

    uploadStream.on('finish', () => resolve(uploadStream.id));
    uploadStream.on('error', reject);

    uploadStream.end(compressedBuffer);
  });
};
