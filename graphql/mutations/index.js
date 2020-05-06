const { GraphQLObjectType } = require('graphql');
const { addTechnology , deleteTechnology} = require('./technologymutations');
const { addProject, deleteProject } = require('./projectmutations');
const RootMutation = new GraphQLObjectType({
  name: "Mutations",
  fields: {
    addTechnology,
    addProject,
    deleteProject,
    deleteTechnology
  },
});

module.exports = RootMutation