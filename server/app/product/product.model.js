const mongoose = require("mongoose");
const { ObjectId, Number } = mongoose.Schema.Types;


const ProductSchema = new mongoose.Schema({
  category: {
    type: ObjectId,
    ref: "Category",
    required: true,    
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  price: {
    type: Number,
    required: true
  },
  discount: {
    type: Number,
  },
  rating: {
    type: String,
  },
  clearance: {
    type: Boolean,
  },
  specifications: [],
  
  images: [ ],

});

mongoose.model("Product", ProductSchema, "products");
ProductSchema.index({ name: "text" });