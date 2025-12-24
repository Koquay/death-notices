const mongoose = require("mongoose");

const ContactsSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    relationship: {
      type: String,
    },
    phone: {
      type: String,
      required: true,
    },
  }, {
    timestamps: true
  }
  
  );
  
  mongoose.model("Contacts", ContactsSchema, "contacts");