const noticesService = require('./notices.service');

exports.getNotices = (req, res) => {
    console.log('notices.controller.getnotices called...')
    noticesService.getNotices(req, res);
}

exports.enterNotice = (req, res) => {
    console.log('notices.controller.enterNotice called...')
    noticesService.enterNotice(req, res);
}


exports.searchForNotices = (req, res) => {
    console.log('notices.controller.searchForNotices called...')
    noticesService.searchForNotices(req, res);
}

exports.getNoticeImage = (req, res) => {
    console.log('notices.controller.getNoticeImage called...')
    noticesService.getNoticeImage(req, res);
}

exports.getNoticeByNo = (req, res) => {
    console.log('notices.controller.getNoticeByNo called...')
    noticesService.getNoticeByNo(req, res);
}

exports.enterMemoriam = (req, res) => {
    console.log('notices.controller.enterMemoriam called...')
    noticesService.enterMemoriam(req, res);
}

exports.getMemoriams = (req, res) => {
    console.log('memoiams.controller.getMemoriams called...')
    noticesService.getMemoriams(req, res);
}

exports.searchForMemoriams = (req, res) => {
    console.log('Memoriams.controller.searchForMemoriams called...')
    noticesService.searchForMemoriams(req, res);
}

exports.getGroups = (req, res) => {
    console.log('memoiams.controller.getGroups called...')
    noticesService.getGroups(req, res);
}

exports.addGroup = (req, res) => {
    console.log('memoiams.controller.addGroup called...')
    noticesService.addGroup(req, res);
}