const graphql = require("graphql");
const { GraphQLList, GraphQLID } = graphql;
const Project = require("../../models/Projects");
const ProjectType = require("../types/ProjectType");

const queries = {
  projects: {
    type: new GraphQLList(ProjectType),
    resolve: (project, args) => Project.find().sort({ importance: -1 }),
  },
  project: {
    type: ProjectType,
    args: { id: { type: GraphQLID } },
    resolve(parent, args) {

      // code to get data from db / other source
      return Project.findById(args.id);
    },
  },
};

module.exports = { projects, project } = queries;
