const TechnologyType = require("../types/TechnologyType");
const Technology = require("../../models/Technologies");
const { GraphQLNonNull, GraphQLString, GraphQLID } = require("graphql");
const { GraphQLUpload } = require("graphql-upload");
const fs = require("fs");
const path = require("path");
const imgur = require("imgur-module");

const mutations = {
  addTechnology: {
    type: TechnologyType,
    args: {
      name: { type: new GraphQLNonNull(GraphQLString) },
      description: { type: GraphQLString },
      image: { type: new GraphQLNonNull(GraphQLUpload) },
    },
    async resolve(parent, args) {
      let imageURL = "";
      let unique = new Date().getTime().toString();
      // Image Parse Start
      const { filename, mimetype, createReadStream } = await args.image;
      // Promisify the stream and store the file, then…
      await new Promise((res) =>
        createReadStream()
          .pipe(
            fs.createWriteStream(
              path.join(__dirname, "../../public/images/", unique + filename)
            )
          )
          .on("close", res)
      )
        .then(() => {
          imageURL =
            process.env.PRODUCTION_APP_URL + "/images/" + unique + filename;
        })
        .catch((err) => {
          throw new Error("Error uploading image");
        });
      // Image Parse End

      // intilize client id
      imgur.setClientId("546c25a59c58ad7");

      // uploading image file
      let imgurURL = "";
      let error = false
      await imgur
      .uploadImgur(imageURL)
      .then(({success, url}) => {
        // imgurURL = result.url;
        if (success) imgurURL = url
        else {
          error = true
        }
      })
      .catch((err) => {
        console.log(err);
      });
      if (error) throw new Error('Error uploading to imgur')
      let technology = new Technology({
        name: args.name,
        description: args.description,
        image: imgurURL,
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

module.exports = { addTechnology } = mutations;
