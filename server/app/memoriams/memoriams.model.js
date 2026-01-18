const mongoose = require("mongoose");

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
    email: {
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


