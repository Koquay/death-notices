const mongoose = require("mongoose");

const EventsSchema = new mongoose.Schema({
  date: {
    type: Date,
  },
  time: {
    type: String,
  },
  location: {
    type: String,
  },
  address: {
    type: String,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  type: {
    type: String,
    required: true,
  },
  
}, {
  timestamps: true
}

);

mongoose.model("Events", EventsSchema, "events");


const GroupsSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  
}, {
  timestamps: true
}

);

mongoose.model("Groups", GroupsSchema, "groups");



const NoticesSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      // required: true,
    },
    birth_date: {
      type: Date,
      required: false,
    },
    death_date: {
      type: Date,
      required: false,
    },
    announcement: {
      type: String,
      required: false,
    },
    additionalInformation: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: false,
    },
    imageId: {
      type: String,
      required: true,
    },
    notice_no: {
      type: String,
      unique: true
  },

    contacts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contacts'   // optional, name of the contacts collection/model
    }],
    events: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Events'   // optional, name of the contacts collection/model
    }],
    groups: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Groups'   // optional, name of the contacts collection/model
    }]
  }, {
    timestamps: true
  }
  
  );
  
  mongoose.model("Notices", NoticesSchema, "notices");


  const MemoriamsSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      // required: true,
    },
    announcement: {
      type: String,
      required: false,
    },
    imageId: {
      type: String,
      required: true,
    },
    memoriam_no: {
      type: String,
      unique: true
  },
  }, {
    timestamps: true
  }
  
  );
  
  mongoose.model("Memoriams", MemoriamsSchema, "memoriams");


