const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const projectSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  images: [String],
  technologies: [String],
  projectType: {
    type: String,
    required: true,
  },
  links: {
    codeLink: {
      type: String,
      required: true,
    },
    hostedLink: String,
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
