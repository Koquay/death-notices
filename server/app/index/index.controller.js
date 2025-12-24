exports.redirectClient = (req, res) => {
    console.log('index.controller.redirectClient called...')
    try {
        res.sendFile(process.env.INDEX)
    } catch(error) {
        throw error;
    }
}