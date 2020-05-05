const {
  GraphQLObjectType,
  GraphQLBoolean,
  GraphQLString,
  GraphQLID,
  GraphQLList,
  GraphQLInt
} = require("graphql");

const LinkType = new GraphQLObjectType({
  name: "Links",
  description: "Represents Links",
  fields: () => ({
    codeLink: {
      type: GraphQLString,
      name: "Code Link",
      description: "Where the code for the project is at",
      resolve(parent, args) {
        return parent.links.codeLink;
      },
    },
    hostedLink: {
      type: GraphQLString,
      name: "Hosted Link",
      description: "Where the project is hosted",
      resolve(parent, args) {
        return parent.links.hostedLink;
      },
    },
  }),
});

const ProjectType = new GraphQLObjectType({
  name: "ProjectType",
  description: "This represents a Project",
  fields: () => ({
    id: {
      type: GraphQLID,
      name: "id",
    },
    name: {
      type: GraphQLString,
      name: "Name",
    },
    description: {
      type: GraphQLString,
      name: "description",
    },
    links: {
      type: LinkType,
      name: "links",
      async resolve (parent, args) {
       return Project.findById(parent.id, 'links -_id')
      }
    },
    technologies: {
      type: GraphQLList(TechnologyType),
      name: "technology",
      resolve(parent, args) {
        return Technology.find({ _id: { $in: parent.technologies }});
      },
    },
    projectType: {
      type: GraphQLString,
      name: "Type of Project",
      description: "This describes what kind of project it was(mobile app, web, etc)"
    },
    images: {
      type: GraphQLList(GraphQLString),
      name: "Images",
    },
    isActive: {
      type: GraphQLBoolean,
      name: "Deleted",
    },
    importance: {
      type: GraphQLInt,
      name: "Importance",
      description: "The importance of the project will determine how it's positioned"
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

module.exports = ProjectType;

const TechnologyType = require("./TechnologyType");
const Technology = require("../../models/Technologies");
const Project = require("../../models/Projects");