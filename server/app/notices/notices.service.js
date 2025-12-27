require("./notices.model");
require("../contacts/contacts.model");

const Notices = require("mongoose").model("Notices");
const Contacts = require("mongoose").model("Contacts");
const Events = require("mongoose").model("Events");
const mongoose = require("mongoose");
const sharp = require('sharp');
const { getGridFSBucket } = require('../util/gridfs');

exports.enterNotice = async (req, res) => {
  try {
    console.log('notices.service.enterNotice called...');

    const noticeData = JSON.parse(req.body.notice);

    if (!req.file) {
      return res.status(400).json({ error: 'No file received' });
    }


    const notice_no = generateNoticeNo();

    // Normalize text
    noticeData.announcement = (noticeData.announcement || '')
      .replace(/\r\n/g, '\n')
      .trim();

    noticeData.additionalInformation = (noticeData.additionalInformation || '')
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
    
      const contactIds = await createContacts(noticeData.contacts);
      const eventIds = await createEvents(noticeData.events);
    
      const notice = await Notices.create({
        name: noticeData.name,
        birth_date: noticeData.birth_date,
        death_date: noticeData.death_date,
        announcement: noticeData.announcement,
        additionalInformation: noticeData.additionalInformation,
        contacts: contactIds,
        events: eventIds,
        imageId: imageId, // ✅ VALID
        notice_no
      });
    
      return res.status(201).json(notice);
    });
    

  } catch (error) {
    console.error('Error in enterNotice:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


const createContacts = async (contacts) => {
  const contactDocs = await Contacts.insertMany(
    contacts.map((c) => ({
      name: c.name,
      relationship: c.relationship,
      phone: c.phone,
    }))
  );

  // 2️⃣ Extract contact IDs
  const contactIds = contactDocs.map((c) => c._id);

  return contactIds;
};

const createEvents = async (events) => {
  const eventDocs = await Events.insertMany(
    events.map((e) => ({
      type: e.type,
      date: e.date,
      time: e.time,
      location: e.location,
      address: e.address,
      city: e.city,
      state: e.state,
    }))
  );

  // 2️⃣ Extract contact IDs
  const eventIds = eventDocs.map((e) => e._id);

  return eventIds;
};

exports.getNotices = async (req, res) => {
  console.log("Notices.service.getNotices called...");

  try {
    const notices = await Notices.find()
      .sort({ createdAt: "desc" })
      .populate("contacts") // populate contacts
      .populate("events")
      .exec();

    console.log("notices retrieved:", notices);
    return res.status(200).json(notices);
  } catch (error) {
    console.error("Error in getNotices:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


exports.getNoticeImage = (req, res) => {
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

exports.getNoticeByNo = async (req, res) => {
  console.log('notices.controller.getNoticeByNo called...')

  // const noticeNo = new mongoose.Types.ObjectId(req.params.noticeNo);

  try {
  const notice = await Notices.findOne({notice_no:req.params.noticeNo})
      .populate("contacts") // populate contacts
      .populate("events")
      .exec();

    console.log("notice retrieved:", notice);
    return res.status(200).json(notice);
  } catch (error) {
    console.error("Error in getNoticeByNo:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

const generateNoticeNo = () => {
  const minCeiled = Math.ceil(9999);
  const maxFloored = Math.floor(1000);
  const random1 = Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); 
  const random2 = Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); 
  const random3 = Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); 
  const notice_no = random1 + '-' + random2 + '-' + random3;

  console.log('notice_no', notice_no)
  return notice_no;
}

exports.searchForNotices = async (req, res) => {
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
    const searchNotices = await Notices.find({ name: regex });
    // const searchNotices = await Product.find({ name: /boot/i });

    console.log("searchNotices", searchNotices);
    res.status(200).json(searchNotices);
  } catch (error) {
    console.error(error);
    res.status(500).send("Problem searching for Notices.");
  }
};

