const mongoose = require("mongoose");

require("../notices.model");
require("../../contacts/contacts.model");

const Contacts = require("mongoose").model("Contacts");
const Notices = require("mongoose").model("Notices");
const Events = require("mongoose").model("Events");

const { uploadNoticeImage } = require("../../util/imageUpload.service");
const { deleteImageIfExists } = require("../../util/imageCleanup.service");

exports.editNoticeService = async ({ noticeData, file }) => {
  // console.log('noticeData edit', noticeData);
  // createContacts(noticeData.contacts)

  const useTransactions = process.env.MONGO_TRANSACTIONS === "true";

  let session = null;
  if (useTransactions) {
    session = await mongoose.startSession();
    session.startTransaction();
  }

  try {
    // Normalize text
    noticeData.announcement = (noticeData.announcement || "")
      .replace(/\r\n/g, "\n")
      .trim();

    noticeData.additionalInformation = (noticeData.additionalInformation || "")
      .replace(/\r\n/g, "\n")
      .trim();

    // Fetch existing notice
    const findQuery = Notices.findById(noticeData.noticeId);
    if (session) findQuery.session(session);

    const existingNotice = await findQuery;
    if (!existingNotice) {
      throw new Error("Notice not found");
    }

    // Upload new image if provided
    let newImageId = null;
    if (file) {
      newImageId = await uploadNoticeImage(file);
    }

    const contacts = await createContacts(noticeData.contacts);
    const events = await createEvents(noticeData.events);

    // Build update
    const update = {
      name: noticeData.name,
      birth_date: noticeData.birth_date,
      death_date: noticeData.death_date,
      announcement: noticeData.announcement,
      additionalInformation: noticeData.additionalInformation,
      contacts: contacts,
      events: events,
      // groups: noticeData.groups,
    };

    if (newImageId) {
      update.imageId = newImageId;
    }

    if (Array.isArray(noticeData.groups)) {
      const groupIds = noticeData.groups
        .map(g => g?._id || g)          // support {_id} or raw id
        .filter(id => mongoose.Types.ObjectId.isValid(id));
    
      if (groupIds.length > 0) {
        update.groups = groupIds;
      }
    }


    const updateQuery = await Notices.findByIdAndUpdate(
      noticeData.noticeId,
      { $set: update },
      { new: true }
    )
      .populate("contacts")
      .populate("events")
      .populate("groups")
      .exec();

    if (session) updateQuery.session(session);

    const updatedNotice = await updateQuery;

    // Delete old image AFTER successful update
    if (newImageId && existingNotice.imageId) {
      await deleteImageIfExists(existingNotice.imageId);
    }

    if (session) {
      await session.commitTransaction();
      session.endSession();
    }

    return updatedNotice;
  } catch (error) {
    if (session) {
      await session.abortTransaction();
      session.endSession();
    }
    throw error;
  }
};

const createContacts = async (contacts) => {
  // 1️⃣ Separate existing vs new contacts
  const existingContactIds = contacts
    .filter(c => c._id)
    .map(c => c._id);

  const newContacts = contacts
    .filter(c => !c._id)
    .map(c => ({
      name: c.name,
      relationship: c.relationship,
      phone: c.phone,
    }));

  // 2️⃣ Insert only new contacts (if any)
  let newContactDocs = [];
  if (newContacts.length > 0) {
    newContactDocs = await Contacts.insertMany(newContacts);
  }

  // 3️⃣ Collect newly created IDs
  const newContactIds = newContactDocs.map(c => c._id);

  // 4️⃣ Return all contact IDs
  return [...existingContactIds, ...newContactIds];
};


const createEvents = async (events) => {
  const existingEventIds = events
    .filter(e => e._id)
    .map(e => e._id);

    const newEvents = events
    .filter(e => !e._id)
    .map(e => ({
      type: e.type,
      date: e.date,
      time: e.time,
      location: e.location,
      address: e.address,
      city: e.city,
      state: e.state,
    }));

    let newEventDocs = [];
  if (newEvents.length > 0) {
    newEventDocs = await Events.insertMany(newEvents);
  }

  const newEventIds = newEventDocs.map(c => c._id);

  return [...existingEventIds, ...newEventIds];

};