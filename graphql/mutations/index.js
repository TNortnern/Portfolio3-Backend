const { GraphQLObjectType } = require('graphql');
const { addTechnology } = require('./technologymutations');
const { addProject, deleteProject } = require('./projectmutations');
const RootMutation = new GraphQLObjectType({
  name: "Mutations",
  fields: {
    addTechnology,
    addProject,
    deleteProject
  },
});

module.exports = RootMutation