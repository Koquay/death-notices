require("./memoriams.model");

const Memoriams = require("mongoose").model("Memoriams");
const mongoose = require("mongoose");
const { getGridFSBucket } = require("../util/gridfs");
const { uploadNoticeImage } = require("../util/imageUpload.service");
const { deleteImageIfExists } = require("../util/imageCleanup.service");
const { generateRandomNo } = require("../util/generateRandomNo");
const sharp = require('sharp');
const nodemailer = require('../util/email/nodemailer.service');

exports.enterMemoriam = async (req, res) => {
  try {
    console.log('Memoriams.service.enterMemoriam called...');

    console.log('req.body.memoriam:', req.body.memoriam);

    const memoriamData = JSON.parse(req.body.memoriam);

    console.log('memoriamData:', memoriamData);

    if (!req.file) {
      return res.status(400).json({ error: 'No file received' });
    }


    const memoriam_no = generateRandomNo();

    // Normalize text
    memoriamData.announcement = (memoriamData.announcement || '')
      .replace(/\r\n/g, '\n')
      .trim();

    // STEP 1: Compress image
    const compressedBuffer = await sharp(req.file.buffer)
      .rotate()
      .resize({ width: 1200, withoutEnlargement: true })
      .jpeg({ quality: 80, mozjpeg: true })
      .toBuffer();

    // STEP 2: Save image to GridFS
    const gfsBucket = getGridFSBucket();

    const uploadStream = gfsBucket.openUploadStream(
      req.file.originalname.replace(/\.\w+$/, '.jpg'),
      {
        contentType: 'image/jpeg',
        metadata: {
          originalName: req.file.originalname,
          originalSize: req.file.size,
          compressedSize: compressedBuffer.length,
        },
      }
    );

    uploadStream.end(compressedBuffer);

    uploadStream.on('error', (err) => {
      console.error('GridFS error:', err);
      return res.status(500).json({ error: 'Image upload failed' });
    });

    uploadStream.on('finish', async () => {
      const imageId = uploadStream.id; // ✅ THIS IS THE KEY
     
      const memoriam = await Memoriams.create({
        name: memoriamData.name,
        announcement: memoriamData.announcement,
        email: memoriamData.email,
        buyer_name: memoriamData.buyer_name,
        imageId: imageId, // ✅ VALID
        memoriam_no
      });
      sendConfirmationEmail({name: memoriam.name, buyer_name: memoriam.buyer_name, email: memoriam.email, memoriam_no: memoriam.memoriam_no})
    
      return res.status(201).json(memoriam);
    });
    

  } catch (error) {
    console.error('Error in enterNotice:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getMemoriam = async (req, res) => {
  console.log('memoriams.service.getMemoriam called...')

  console.log('req.params.memoriamId', req.params.memoriamId);

  try {
  const memoriam = await Memoriams.findOne({_id:req.params.memoriamId})
      .exec();

    console.log("memoriam retrieved:", memoriam);
    return res.status(200).json(memoriam);
  } catch (error) {
    console.error("Error in getMemoriam:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

exports.getMemoriamByNo = async (req, res) => {
  console.log('memoriams.service.getMemoriam called...')

  console.log('req.params.memoriamNo', req.params.memoriamNo);

  try {
  const memoriam = await Memoriams.findOne({memoriam_no:req.params.memoriamNo})
      .exec();

    console.log("memoriam retrieved:", memoriam);
    return res.status(200).json(memoriam);
  } catch (error) {
    console.error("Error in getMemoriamByNo:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}


exports.getMemoriams = async (req, res) => {
  console.log("Memoriams.service.getMemoriams called...");

  try {
    const memoriams = await Memoriams.find()
      .sort({ createdAt: "desc" })
      .exec();

    console.log("Memoriams retrieved:", Memoriams);
    return res.status(200).json(memoriams);
  } catch (error) {
    console.error("Error in getMemoriams:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.searchForMemoriams = async (req, res) => {
  console.log("ProductsService.searchForProducts");

  const searchField = req.query.searchField;
  console.log("searchField", searchField);

  if (!searchField || !searchField.trim()) {
    return res.status(400).send("Missing or empty search term.");
  }

  const escapeRegex = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  console.log("EscapedRegex", escapeRegex(searchField));

  try {
    const regex = new RegExp(escapeRegex(searchField), "i");
    const searchMemoriams = await Memoriams.find({ name: regex });

    console.log("searchMemoriams", searchMemoriams);
    res.status(200).json(searchMemoriams);
  } catch (error) {
    console.error(error);
    res.status(500).send("Problem searching for Notices.");
  }
  
};

exports.getMemoriamImage = (req, res) => {
  try {
    const gfsBucket = getGridFSBucket();
    const imageId = new mongoose.Types.ObjectId(req.params.id);

    const stream = gfsBucket.openDownloadStream(imageId);

    stream.on('error', () => {
      return res.status(404).send('Image not found');
    });

    res.set('Content-Type', 'image/jpeg');
    res.set('Cache-Control', 'public, max-age=86400');

    stream.pipe(res);
  } catch (err) {
    return res.status(400).send('Invalid image id');
  }
};

exports.editMemoriam = async ({ memoriamData, file }) => {
  console.log('memoriamService.memoriamData:', memoriamData);
  const useTransactions = process.env.MONGO_TRANSACTIONS === "true";

  let session = null;
  if (useTransactions) {
    session = await mongoose.startSession();
    session.startTransaction();
  }

  try {

    // Fetch existing memoriam
    const findQuery = Memoriams.findById(memoriamData.memoriamId);
    if (session) findQuery.session(session);

    const existingMemoriam = await findQuery;
    if (!existingMemoriam) {
      throw new Error("Memoriam not found");
    }

    // Upload new image if provided
    let newImageId = null;
    if (file) {
      newImageId = await uploadNoticeImage(file);
    }

    // Build update
    const update = {
      name: memoriamData.name,
      announcement: memoriamData.announcement,
    };

    if (newImageId) {
      update.imageId = newImageId;
    }

    const updateQuery = await Memoriams.findByIdAndUpdate(
      memoriamData.memoriamId,
      { $set: update },
      { new: true }
    ).exec();

    if (session) updateQuery.session(session);

    const updatedMemoriam = await updateQuery;

    // Delete old image AFTER successful update
    if (newImageId && existingMemoriam.imageId) {
      await deleteImageIfExists(existingMemoriam.imageId);
    }

    if (session) {
      await session.commitTransaction();
      session.endSession();
    }

    return updatedMemoriam;
  } catch (error) {
    if (session) {
      await session.abortTransaction();
      session.endSession();
    }
    throw error;
  }
};

exports.getMemoriams = async (req, res) => {
  console.log("Memoriams.service.getMemoriams called...");

  try {
    const memoriams = await Memoriams.find()
      .sort({ createdAt: "desc" })
      .exec();

    console.log("Memoriams retrieved:", Memoriams);
    return res.status(200).json(memoriams);
  } catch (error) {
    console.error("Error in getMemoriams:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


const sendConfirmationEmail = (memoriamData) => {
  console.log('***** sendBuyerEmail called', memoriamData)  
  console.log('***** memoriamData.email', memoriamData.email)  
  if(!memoriamData.email) {
    console.log('memoriamData.email does not exist');
    return;
  }

const mailOptions = {
      from: `Libeian Death Announcement <kkwilson852@gmail.com>`,
      to: `${memoriamData.email}`,
      subject: `Your memoriam No. ${memoriamData.memoriam_no}`, 

      html: `
      <p>Dear ${memoriamData.buyer_name},<br>
      We are pleased to inform you that your memoriam for ${memoriamData.name} 
      was successfully placed.<br>Your memoriam number is ${memoriamData.memoriam_no}. Please save this number
      as it will be required if you wish to change details of your memoriam. 
      <br>You will be able to make changes to this memoriam within 30 days of purchase.
      <br>Kind regards,
      <br> Liberian Death Announcement</p>,
      `
    };    

    console.log('***** sendBuyerEmail mailOptions', mailOptions)

    // ' placed on ' + moment.tz(notice.created_on, 'America/Toronto').format('MM-DD-YYYY') + 

  try {
    nodemailer.sendEmail(mailOptions);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Problem sending notice confirmation..");
  }
}