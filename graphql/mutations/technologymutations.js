const TechnologyType = require('../types/TechnologyType')
const Technology = require('../../models/Technologies')
const { GraphQLNonNull, GraphQLString, GraphQLID } = require('graphql')
const { GraphQLUpload } = require("graphql-upload");
const fs = require("fs");
const path = require("path");
const mutations = {
  addTechnology: {
    type: TechnologyType,
    args: {
      name: { type: new GraphQLNonNull(GraphQLString) },
      description: { type: GraphQLString },
      image: { type: new GraphQLNonNull(GraphQLUpload) },
    },
    async resolve(parent, args) {
      let image = ''
          let unique = new Date().getTime().toString();
          // Image Parse Start
          const { filename, mimetype, createReadStream } = await args.image;
          // Promisify the stream and store the file, then…
          await new Promise((res) =>
            createReadStream()
              .pipe(
                fs.createWriteStream(
                  path.join(
                    __dirname,
                    "../../public/images/",
                    unique + filename
                  )
                )
              )
              .on("close", res)
          )
            .then(() => {
              image =  process.env.PRODUCTION_APP_URL + "/images/" + unique + filename
            })
            .catch((err) => {
              throw new Error("Error uploading image");
            });
          // Image Parse End
      let technology = new Technology({
        name: args.name,
        description: args.description,
        image,
      });
      return technology.save();
    },
  },
  deleteTechnology: {
    type: TechnologyType,
    args: {
      name: { type: GraphQLString },
      id: { type: new GraphQLNonNull(GraphQLID) },
    },
    async resolve(parent, args) {
      return Technology.deleteOne({
        _id: args.id,
      });
    },
  },
};

module.exports = { addTechnology } = mutations