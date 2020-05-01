const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  price: {
    type: Number,
    required: true,
  },
  categoryId: {
    type: String,
    required: true,
  },
  image: String,
  featured: {
    type: Number,
    default: 0,
  },
  isDeleted: {
    type: Boolean,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
    default: new Date(),
  },
});

module.exports = mongoose.model("Product", productSchema);
