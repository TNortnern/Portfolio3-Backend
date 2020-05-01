const { GraphQLObjectType } = require('graphql');
const { addCategory } = require('./categorymutations');
const { addProduct, deleteProduct } = require('./productsmutations');
const RootMutation = new GraphQLObjectType({
  name: "Mutations",
  fields: {
    addCategory,
    addProduct,
    deleteProduct
  },
});

module.exports = RootMutation