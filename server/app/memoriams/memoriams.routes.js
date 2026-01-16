const router = require('express').Router();
const memoriamsController = require('./memoriams.controller');
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });


router.get('/:memoriamId', memoriamsController.getMemoriam);
router.get('/', memoriamsController.getMemoriams);
router.get('/:memoriamNo/2', memoriamsController.getMemoriamByNo);
router.get('/image/:id', memoriamsController.getMemoriamImage);
router.post('/memoriam', upload.single('image'), memoriamsController.enterMemoriam);
router.get('/search/memoriams/name/1', memoriamsController.searchForMemoriams)

router.put('/:id', upload.single('image'), memoriamsController.editMemoriam);
module.exports = router;