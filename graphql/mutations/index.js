const { GraphQLObjectType } = require('graphql');
const { addTechnology , deleteTechnology} = require('./technologymutations');
const { addProject, editProject, deleteProject } = require('./projectmutations');
const RootMutation = new GraphQLObjectType({
  name: "Mutations",
  fields: {
    addTechnology,
    addProject,
    editProject,
    deleteProject,
    deleteTechnology
  },
});

module.exports = RootMutation