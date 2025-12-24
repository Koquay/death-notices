const noticesService = require('./notices.service');

exports.getNotices = (req, res) => {
    console.log('notices.controller.getnotices called...')
    noticesService.getNotices(req, res);
}

exports.enterNotice = (req, res) => {
    console.log('notices.controller.enterNotice called...')
    noticesService.enterNotice(req, res);
}


// exports.editNotice = (req, res) => {
//     console.log('notices.controller.editNotice called...')
//     noticesService.editNotice(req, res);
// }

exports.getNoticeImage = (req, res) => {
    console.log('notices.controller.getNoticeImage called...')
    noticesService.getNoticeImage(req, res);
}

exports.getNoticeByNo = (req, res) => {
    console.log('notices.controller.getNoticeByNo called...')
    noticesService.getNoticeByNo(req, res);
}