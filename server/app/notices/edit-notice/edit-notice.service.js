const mongoose = require("mongoose");

require("../notices.model");
const Notices = require("mongoose").model("Notices");

const { uploadNoticeImage } = require("../../util/imageUpload.service");
const { deleteImageIfExists } = require("../../util/imageCleanup.service");

exports.editNoticeService = async ({ noticeData, file }) => {
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

    // Build update
    const update = {
      name: noticeData.name,
      birth_date: noticeData.birth_date,
      death_date: noticeData.death_date,
      announcement: noticeData.announcement,
      additionalInformation: noticeData.additionalInformation,
      contacts: noticeData.contacts,
      events: noticeData.events,
    };

    if (newImageId) {
      update.imageId = newImageId;
    }

    const updateQuery = await Notices.findByIdAndUpdate(
      noticeData.noticeId,
      { $set: update },
      { new: true }
    )
      .populate("contacts")
      .populate("events")
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
