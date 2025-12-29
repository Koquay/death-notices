const router = require('express').Router();
const noticesController = require('./notices.controller');
const editNoticesController = require('./edit-notice/edit-notice.controller');
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });

console.log('notices.routes called...')
router.get('/', noticesController.getNotices)
router.post('/', upload.single('image'), noticesController.enterNotice);
router.put('/:id', upload.single('image'), editNoticesController.editNotice);
router.get('/image/:id', noticesController.getNoticeImage);
router.get('/notice/no/:noticeNo', noticesController.getNoticeByNo);

router.get('/groups', noticesController.getGroups);
router.post('/group', noticesController.addGroup);

router.get('/search/notices/name/1', noticesController.searchForNotices)


router.get('/memoriam', noticesController.getMemoriams);
router.post('/memoriam', upload.single('image'), noticesController.enterMemoriam);
router.get('/search/memoriams/name/1', noticesController.searchForMemoriams)

module.exports = router;