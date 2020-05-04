const TechnologyType = require('../types/TechnologyType')
const Technology = require('../../models/Technologies')
const { GraphQLNonNull, GraphQLString } = require('graphql')
const { GraphQLUpload } = require("graphql-upload");
const fs = require("fs");
const path = require("path");
const mutations = {
  addTechnology: {
    type: TechnologyType,
    args: {
      name: { type: new GraphQLNonNull(GraphQLString) },
      description: { type: new GraphQLNonNull(GraphQLString) },
      image: { type: new GraphQLNonNull(GraphQLString) }
    },
    resolve(parent, args) {
      let technology = new Technology({
        name: args.name,
        description: args.description,
        image: args.image,
      });
      return technology.save();
    },
  },
};

module.exports = { addTechnology } = mutations