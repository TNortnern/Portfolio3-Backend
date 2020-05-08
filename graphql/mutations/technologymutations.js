const TechnologyType = require("../types/TechnologyType");
const Technology = require("../../models/Technologies");
const { GraphQLNonNull, GraphQLString, GraphQLID } = require("graphql");
const { GraphQLUpload } = require("graphql-upload");
const { createWriteStream, unlink } = require("fs");
const nodepath = require("path");
const axios = require("axios");
const imgur = require("imgur-module");
const FormData = require('form-data')

const mutations = {
  addTechnology: {
    type: TechnologyType,
    args: {
      name: { type: new GraphQLNonNull(GraphQLString) },
      description: { type: GraphQLString },
      image: { type: new GraphQLNonNull(GraphQLUpload) },
    },
    async resolve(parent, args) {
      let image = "";
      const storeUpload = async (upload) => {
        const { createReadStream, filename, mimetype } = await upload;
        const stream = createReadStream();
        const id = new Date().getTime().toString();
        const path = nodepath.join(
          __dirname,
          "../../public/images/",
          id + filename
        );
        const file = {
          id,
          filename,
          mimetype,
          path,
        };

        // Store the file in the filesystem.
        await new Promise((resolve, reject) => {
          // Create a stream to which the upload will be written.
          const writeStream = createWriteStream(path);

          // When the upload is fully written, resolve the promise.
          writeStream.on("finish", resolve);

          // If there's an error writing the file, remove the partially written file
          // and reject the promise.
          writeStream.on("error", (error) => {
            unlink(path, () => {
              reject(error);
            });
          });

          // In node <= 13, errors are not automatically propagated between piped
          // streams. If there is an error receiving the upload, destroy the write
          // stream with the corresponding error.
          stream.on("error", (error) => writeStream.destroy(error));

          // Pipe the upload into the write stream.
          stream.pipe(writeStream);
        });

        // Record the file metadata in the DB.
        // console.log(file);
        return file;
      };
      const getFile = await storeUpload(args.image);

      // console.log(getFile);

      // intilize client id
      imgur.setClientId("546c25a59c58ad7");

      // uploading image file
      await imgur
        .uploadImgur(
        path
        )
        .then((result) => {
          console.log(result);
        })
        .catch((err) => {
          console.log(err);
        });

      throw new Error("idk");

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

module.exports = { addTechnology } = mutations;
