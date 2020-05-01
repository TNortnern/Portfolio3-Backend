const { GraphQLObjectType } = require('graphql')
const product = require("./productqueries").product;
const products = require("./productqueries").products;
const category = require("./categoryqueries").category;
const categories = require("./categoryqueries").categories;
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: () => ({
    product,
    products,
    category,
    categories
  }),
});

module.exports = RootQuery;
