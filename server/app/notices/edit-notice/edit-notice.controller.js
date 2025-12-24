const { editNoticeService } = require('./edit-notice.service');

exports.editNotice = async (req, res) => {
  console.log('Content-Type:', req.headers['content-type']);
  console.log('req.file:', req.file);
  console.log('req.body keys:', Object.keys(req.body));
  
  try {
    const noticeData = JSON.parse(req.body.notice);

    noticeData.noticeId = req.params.id;

    console.log('req.file', req.file)

    const updatedNotice = await editNoticeService({
      noticeData,
      file: req.file, // may be undefined
    });

    return res.status(200).json(updatedNotice);
  } catch (error) {
    console.error('Edit notice failed:', error.message);
    return res.status(400).json({ error: error.message });
  }
};
