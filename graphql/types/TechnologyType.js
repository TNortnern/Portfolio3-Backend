const {
  GraphQLObjectType,
  GraphQLBoolean,
  GraphQLString,
  GraphQLID,
  GraphQLList,
} = require("graphql");



const TechnologyType = new GraphQLObjectType({
  name: "Technology",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    image: { type: GraphQLString },
    isDeleted: { type: GraphQLBoolean },
    projects: {
      type: new GraphQLList(ProjectType),
      resolve(parent, args) {
        return Project.find({ technologies: { $in: parent.id } });
      },
    },
    createdAt: {
      type: GraphQLString,
      resolve: (item) => item.createdAt,
    },
    updatedAt: {
      type: GraphQLString,
      resolve: (item) => item.createdAt,
    },
  }),
});

module.exports = TechnologyType;

const ProjectType = require("./ProjectType");
const Project = require("../../models/Projects");