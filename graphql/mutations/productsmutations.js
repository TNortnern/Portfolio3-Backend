const ProductType = require("../types/ProductType");
const Product = require("../../models/Product");
const {
  GraphQLNonNull,
  GraphQLString,
  GraphQLFloat,
  GraphQLList,
  GraphQLInt,
  GraphQLID,
} = require("graphql");
const { GraphQLUpload } = require("graphql-upload");
const fs = require("fs");
const path = require("path");

const mutations = {
  addProduct: {
    type: ProductType,
    args: {
      name: { type: new GraphQLNonNull(GraphQLString) },
      description: { type: new GraphQLNonNull(GraphQLString) },
      price: { type: new GraphQLNonNull(GraphQLFloat) },
      category: { type: new GraphQLNonNull(GraphQLString) },
      image: { type: GraphQLUpload },
      featured: { type: GraphQLInt },
    },
    async resolve(parent, args) {
      let filename;
      if (args.image) {
        const { filename, mimetype, createReadStream } = await args.image;
        // Promisify the stream and store the file, then…
        await new Promise((res) =>
          createReadStream()
            .pipe(
              fs.createWriteStream(
                path.join(__dirname, "../../public/images/", filename)
              )
            )
            .on("close", res)
        );
      }
      let product = new Product({
        name: args.name,
        description: args.description,
        price: args.price,
        categoryId: args.category,
        image: filename
          ? process.env.PRODUCTION_APP_URL + "images/" + filename
          : "",
        featured: args.featured,
      });
      return product.save();
    },
  },
  deleteProduct: {
    type: ProductType,
    args: {
      name: { type: GraphQLString },
      id: { type: new GraphQLNonNull(GraphQLID) },
    },
    async resolve(parent, args) {
      return Product.deleteOne({
        _id: args.id,
      });
    },
  },
};

module.exports = { addProduct } = mutations;
