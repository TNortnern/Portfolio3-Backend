const ProjectType = require("../types/ProjectType");
const Project = require("../../models/Projects");
const {
  GraphQLNonNull,
  GraphQLString,
  GraphQLFloat,
  GraphQLList,
  GraphQLInt,
  GraphQLID,
} = require("graphql");
const { GraphQLUpload } = require("graphql-upload");
const { multiFileUpload } = require("../../helpers");

const mutations = {
  addProject: {
    type: ProjectType,
    args: {
      name: { type: new GraphQLNonNull(GraphQLString) },
      description: { type: new GraphQLNonNull(GraphQLString) },
      technologies: { type: new GraphQLNonNull(GraphQLList(GraphQLString)) },
      projectType: { type: new GraphQLNonNull(GraphQLString) },
      images: { type: GraphQLList(GraphQLUpload) },
      links: { type: GraphQLList(GraphQLString) },
      importance: { type: GraphQLInt },
    },
    async resolve(parent, args, req) {
      if (!req.isAuth) {
        throw new Error("Unauthenticated");
      }
      const imageNames = await multiFileUpload(args.images);
      const linksArr = args.links;
      const links = {};
      if (linksArr.length) {
        links.codeLink = linksArr[0];
        links.hostedLink = linksArr[1];
      }
      let project = new Project({
        name: args.name,
        description: args.description,
        technologies: args.technologies,
        links,
        images: imageNames.length ? imageNames : [],
        projectType: args.projectType,
        importance: args.importance,
      });
      return project.save();
    },
  },
  editProject: {
    type: ProjectType,
    args: {
      id: { type: new GraphQLNonNull(GraphQLID) },
      name: { type: GraphQLString },
      description: { type: GraphQLString },
      technologies: { type: GraphQLList(GraphQLString) },
      projectType: { type: GraphQLString },
      images: { type: GraphQLList(GraphQLUpload) },
      links: { type: GraphQLList(GraphQLString) },
      importance: { type: GraphQLInt },
    },
    async resolve(parent, args, req) {
      if (!req.isAuth) {
        throw new Error("Unauthenticated");
      }
      const links = {};
      let imageNames;
      let project = await Project.findById(args.id);
      if (!project)
        throw new Error(`Couldn't find the author with an id of ${args.id}`);
      if (args.name) project.name = args.name;
      if (args.description) project.description = args.description;
      if (args.technologies) project.technologies = args.technologies;
      if (args.links) {
        const linksArr = args.links;
        if (linksArr.length) {
          links.codeLink = linksArr[0];
          links.hostedLink = linksArr[1];
        }
        project.links = links;
      }
      if (args.images) {
        imageNames = await multiFileUpload(args.images);
        project.images = imageNames;
      }
      if (args.projectType) project.projectType = args.projectType;
      if (args.importance) project.importance = args.importance;
      return project.save();
    },
  },
  deleteProject: {
    type: ProjectType,
    args: {
      name: { type: GraphQLString },
      id: { type: new GraphQLNonNull(GraphQLID) },
    },
    async resolve(parent, args, req) {
      if (!req.isAuth) {
        throw new Error("Unauthenticated");
      }
      return Project.deleteOne({
        _id: args.id,
      });
    },
  },
};

module.exports = { addProject, editProject, deleteProject } = mutations;
