const {
  GraphQLObjectType,
  GraphQLBoolean,
  GraphQLString,
  GraphQLID,
  GraphQLList,
} = require("graphql");



const CategoryType = new GraphQLObjectType({
  name: "Category",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    image: { type: GraphQLString },
    isDeleted: { type: GraphQLBoolean },
    products: {
      type: new GraphQLList(ProductType),
      resolve(parent, args) {
        return Product.find({ categoryId: parent.id });
      },
    },
    createdAt: {
      type: GraphQLString,
      resolve: (category) => category.createdAt,
    },
    updatedAt: {
      type: GraphQLString,
      resolve: (category) => category.createdAt,
    },
  }),
});

module.exports = CategoryType;

const ProductType = require("./ProductType");
const Product = require("../../models/Product");