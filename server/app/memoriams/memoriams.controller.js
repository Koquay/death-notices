const memoriamsService = require('./memoriams.service');

exports.enterMemoriam = (req, res) => {
    console.log('memoriams.controller.enterMemoriam called...')
    memoriamsService.enterMemoriam(req, res);
}

exports.getMemoriams = (req, res) => {
    console.log('memoiams.controller.getMemoriams called...')
    memoriamsService.getMemoriam(req, res);
}

exports.getMemoriam = (req, res) => {
    console.log('memoiams.controller.getMemoriam called...')
    memoriamsService.getMemoriam(req, res);
}

exports.getMemoriamByNo = (req, res) => {
    console.log('memoiams.controller.getMemoriam called...')
    memoriamsService.getMemoriamByNo(req, res);
}

exports.getMemoriamImage = (req, res) => {
    console.log('memoriams.controller.getMemoriamImage called...')
    memoriamsService.getMemoriamImage(req, res);
}

exports.searchForMemoriams = (req, res) => {
    console.log('Memoriams.controller.searchForMemoriams called...')
    memoriamsService.searchForMemoriams(req, res);
}

exports.editMemoriam = async (req, res) => {
    console.log('Content-Type:', req.headers['content-type']);
    console.log('req.file:', req.file);
    console.log('req.body keys:', Object.keys(req.body));
    
    try {
      const memoriamData = JSON.parse(req.body.memoriam);
  
      memoriamData.memoriamId = req.params.id;
  
      console.log('memoriamData', memoriamData)
  
      const updatedMemoriam = await memoriamsService.editMemoriam({
        memoriamData,
        file: req.file, // may be undefined
      });
  
      return res.status(200).json(updatedMemoriam);
    } catch (error) {
      console.error('Edit memoriam failed:', error.message);
      return res.status(400).json({ error: error.message });
    }
  };