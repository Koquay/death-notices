const mongoose = require("mongoose");

  const ContactUsSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: false,
    },
    message: {
      type: String,
      required: true,
    },   
  }, {
    timestamps: true
  }
  
  );
  
  mongoose.model("ContactUs", ContactUsSchema, "contact-us");


