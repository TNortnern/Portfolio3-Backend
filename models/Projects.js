const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const projectSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  categoryId: {
    type: String,
    required: true,
  },
  images: [String],
  technologies: [String],
  projectType: {
    type: String,
    required: true,
  },
  codeLink: {
    type: String,
    required: true,
  },
  importance: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: 1,
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

module.exports = mongoose.model("Projects", projectSchema);
