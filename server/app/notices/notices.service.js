require("./notices.model");
require("../contacts/contacts.model");

const Notices = require("mongoose").model("Notices");
const Contacts = require("mongoose").model("Contacts");
const Events = require("mongoose").model("Events");
const Groups = require("mongoose").model("Groups");
// const Memoriams = require("mongoose").model("Memoriams");
const mongoose = require("mongoose");
const sharp = require('sharp');
const { getGridFSBucket } = require('../util/gridfs');
const { generateRandomNo } = require("../util/generateRandomNo");
const nodemailer = require('../util/email/nodemailer.service');

exports.enterNotice = async (req, res) => {
  try {
    console.log('notices.service.enterNotice called...');

    const noticeData = JSON.parse(req.body.notice);
    console.log('noticeData', noticeData)

    if (!req.file) {
      return res.status(400).json({ error: 'No file received' });
    }


    const notice_no = generateRandomNo();

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
      // const groupIds = await createGroups(noticeData.groups);

      const groupIds = noticeData.groups.map((g) => g._id);
    
      const notice = await Notices.create({
        name: noticeData.name,
        birth_date: noticeData.birth_date,
        death_date: noticeData.death_date,
        announcement: noticeData.announcement,
        additionalInformation: noticeData.additionalInformation,
        email: noticeData.email,
        contacts: contactIds,
        events: eventIds,
        groups: groupIds,
        imageId: imageId, // ✅ VALID
        notice_no
      });

      sendConfirmationEmail({name: notice.name, email: notice.email, notice_no: notice.notice_no})
    
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

const createGroups = async (groups) => {
  const groupDocs = await Groups.insertMany(
    groups.map((g) => ({
      name: g.name,
    }))
  );

  // 2️⃣ Extract contact IDs
  const groupIds = groupDocs.map((g) => g._id);

  return groupIds;
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


  try {
  const notice = await Notices.findOne({notice_no:req.params.noticeNo})
      .populate("contacts") // populate contacts
      .populate("events")
      .populate("groups")
      .exec();

    console.log("notice retrieved:", notice);
    return res.status(200).json(notice);
  } catch (error) {
    console.error("Error in getNoticeByNo:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
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

exports.getGroups = async (req, res) => {
  console.log('service.getGroups called...')
  try {
    const groups = await Groups.find()
      .sort({ createdAt: "asc" })
      .exec();

    console.log("Groups retrieved:", Groups);
    return res.status(200).json(groups);
  } catch (error) {
    console.error("Error in getGroups:", error);
    return res.status(500).json({ message: "getGroups Internal server error" });
  }
}

exports.addGroup = async (req, res) => {
  console.log('service.addGroup called...')
  const group = req.body;
  console.log('addGroup.group', group);
  try {
    group._id = new mongoose.Types.ObjectId();

    const newGroup = await Groups.insertOne(group);
    console.log('addGroup.newGroup', newGroup);
  
    const groups = await Groups.find()
      .sort({ createdAt: "asc" })
      .exec();

    console.log("Groups retrieved:", groups);
    return res.status(200).json(groups);
  } catch (error) {
    console.error("Error in addGroup:", error);
    return res.status(500).json({ message: "addGroup Internal server error" });
  }
}

exports.getNoticesForGroup = async (req, res) => {
  try {
    const groupId = new mongoose.Types.ObjectId(req.params.id);

    const notices = await Notices.find({
      groups: groupId
    });

    console.log("notices retrieved:", notices);
    res.status(200).json(notices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching notices by group' });
  }
};

const sendConfirmationEmail = (noticeData) => {
  console.log('***** sendBuyerEmail called', noticeData)  
  console.log('***** noticeData.email', noticeData.email)  
  if(!noticeData.email) {
    console.log('noticeData.email does not exist');
    return;
  }

const mailOptions = {
      from: `Libeian Death Announcement <kkwilson852@gmail.com>`,
      to: `${noticeData.email}`,
      subject: `Your notice No. ${noticeData.notice_no}`, 

      html: `
      <p>Dear ${noticeData.name},<br>
      We are pleased to inform you that your death notice for ${noticeData.name} 
      was successfully placed.<br>Your notice number is ${noticeData.notice_no}. Please save this number
      as it will be required if you wish to change details of your death notice.
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
