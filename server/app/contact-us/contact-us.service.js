require("./contact-us.model");

const ContactUs = require("mongoose").model("ContactUs");

exports.sendMessage = async (req, res) => {
    const contactUsData = req.body.contactUsData;

    console.log('contactUsData:', contactUsData);

    try {
        await ContactUs.create({
            name: contactUsData.name,
            message: contactUsData.message,
            email: contactUsData.email
          });

          return res.status(201).json({message: 'Your message was received.'});
    } catch (error) {
    console.error('Error in contact us:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}