const graphql = require("graphql");
const { GraphQLList, GraphQLID } = graphql;
const Product = require("../../models/Product");
const ProductType = require("../types/ProductType");

const queries = {
  products: {
    type: new GraphQLList(ProductType),
    resolve: (product, args) => Product.find(),
  },
  product: {
    type: ProductType,
    args: { id: { type: GraphQLID } },
    resolve(parent, args) {
      // code to get data from db / other source
      return Product.findById(args.id);
    },
  },
};

module.exports = { products, product } = queries;