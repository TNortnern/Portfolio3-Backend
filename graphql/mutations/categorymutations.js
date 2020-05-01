const CategoryType = require('../types/CategoryType')
const Category = require('../../models/Category')
const { GraphQLNonNull, GraphQLString } = require('graphql')
const mutations = {
  addCategory: {
    type: CategoryType,
    args: {
      name: { type: new GraphQLNonNull(GraphQLString) },
      description: { type: new GraphQLNonNull(GraphQLString) },
      image: { type: new GraphQLNonNull(GraphQLString) }
    },
    resolve(parent, args) {
      let category = new Category({
        name: args.name,
        description: args.description,
        image: args.image,
      });
      return category.save();
    },
  },
};

module.exports = { addCategory } = mutations