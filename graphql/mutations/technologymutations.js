const TechnologyType = require("../types/TechnologyType");
const Technology = require("../../models/Technologies");
const { GraphQLNonNull, GraphQLString, GraphQLID } = require("graphql");
const { GraphQLUpload } = require("graphql-upload");
const fs = require("fs");
const path = require("path");
const imgur = require("imgur-module");
const { fileUpload } = require('../../helpers')

const mutations = {
  addTechnology: {
    type: TechnologyType,
    args: {
      name: { type: new GraphQLNonNull(GraphQLString) },
      description: { type: GraphQLString },
      image: { type: new GraphQLNonNull(GraphQLUpload) },
    },
    async resolve(parent, args) {
      let image = await fileUpload(args.image)
      throw new Error(image)
      let technology = new Technology({
        name: args.name,
        description: args.description,
        image,
      });
      return technology.save();
    },
  },
  deleteTechnology: {
    type: TechnologyType,
    args: {
      name: { type: GraphQLString },
      id: { type: new GraphQLNonNull(GraphQLID) },
    },
    async resolve(parent, args) {
      return Technology.deleteOne({
        _id: args.id,
      });
    },
  },
};

module.exports = { addTechnology } = mutations;
