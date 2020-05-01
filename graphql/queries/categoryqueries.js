const { GraphQLList, GraphQLID } = require('graphql')
const Category = require("../../models/Category");
const CategoryType = require("../types/CategoryType");

const queries = {
  categories: {
    type: new GraphQLList(CategoryType),
    resolve: (category, args) => Category.find(),
  },
  category: {
    type: CategoryType,
    args: { id: { type: GraphQLID } },
    resolve(category, args) {
      // code to get data from db / other source
      return Category.findById(args.id);
    },
  },
};

module.exports = { categories, category } = queries;