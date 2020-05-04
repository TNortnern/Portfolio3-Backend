const { GraphQLList, GraphQLID } = require('graphql')
const Technology = require("../../models/Technologies");
const TechnologyType = require("../types/TechnologyType");

const queries = {
  technologies: {
    type: new GraphQLList(TechnologyType),
    resolve: (technology, args) => Technology.find(),
  },
  technology: {
    type: TechnologyType,
    args: { id: { type: GraphQLID } },
    resolve(technology, args) {
      // code to get data from db / other source
      return Technology.findById(args.id);
    },
  },
};

module.exports = { technologies, technology } = queries;