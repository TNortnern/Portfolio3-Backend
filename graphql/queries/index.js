const { GraphQLObjectType } = require('graphql')
const project = require("./projectqueries").project;
const projects = require("./projectqueries").projects;
const technology = require("./technologyqueries").technology;
const technologies = require("./technologyqueries").technologies;
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: () => ({
    project,
    projects,
    technology,
    technologies
  }),
});

module.exports = RootQuery;
