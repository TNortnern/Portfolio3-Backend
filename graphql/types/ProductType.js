const {
  GraphQLObjectType,
  GraphQLBoolean,
  GraphQLString,
  GraphQLID,
  GraphQLFloat,
  GraphQLList
} = require("graphql");


const ProductType = new GraphQLObjectType({
  name: "ProductType",
  description: "This represents a Product",
  fields: () => ({
    id: {
      type: GraphQLID,
      name: "id",
    },
    name: {
        type: GraphQLString,
        name: "Name"
    },
    description: {
        type: GraphQLString,
        name: "Name"
    },
    price: {
      type: GraphQLFloat,
      name: "Price",
    },
    category: {
      type: CategoryType,
      name: "Category",
      resolve(parent, args) {
        return Category.findById(parent.categoryId);
      },
    },
    image: {
        type: GraphQLString,
        name: "Images"
    },
    featured: {
      type: GraphQLID,
      name: "Featured",
    },
    isDeleted: {
      type: GraphQLBoolean,
      name: "Deleted",
    },
    createdAt: {
      type: GraphQLString,
      resolve: (product) => product.createdAt,
    },
    updatedAt: {
      type: GraphQLString,
      resolve: (product) => product.createdAt,
    },
  }),
});

module.exports = ProductType;

const CategoryType = require("./CategoryType");
const Category = require("../../models/Category");