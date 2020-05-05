const ProjectType = require("../types/ProjectType");
const Project = require("../../models/Projects");
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
  addProject: {
    type: ProjectType,
    args: {
      name: { type: new GraphQLNonNull(GraphQLString) },
      description: { type: new GraphQLNonNull(GraphQLString) },
      technologies: { type: new GraphQLNonNull(GraphQLList(GraphQLString)) },
      projectType: { type: new GraphQLNonNull(GraphQLString) },
      images: { type: GraphQLList(GraphQLUpload) },
      links: { type: GraphQLList(GraphQLString) },
      importance: { type: GraphQLInt },
    },
    async resolve(parent, args) {
      let imageNames = [];
      const handleImages = async () => {
        for await (const image of args.images) {
          let unique = new Date().getTime().toString();
          // Image Parse Start
          const { filename, mimetype, createReadStream } = await image;
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
              imageNames = [
                ...imageNames,
                process.env.PRODUCTION_APP_URL + "/images/" + unique + filename,
              ];
            })
            .catch((err) => {
              throw new Error("Error uploading image");
            });
          // Image Parse End
        }
        return imageNames;
      };
      await handleImages();
      const linksArr = args.links;
      const links = {};
      if (linksArr.length) {
        links.codeLink = linksArr[0];
        links.hostedLink = linksArr[1];
      }
      let project = new Project({
        name: args.name,
        description: args.description,
        technologies: args.technologies,
        links,
        images: imageNames.length ? imageNames : [],
        projectType: args.projectType,
        importance: args.importance,
      });
      return project.save();
    },
  },
  deleteProject: {
    type: ProjectType,
    args: {
      name: { type: GraphQLString },
      id: { type: new GraphQLNonNull(GraphQLID) },
    },
    async resolve(parent, args) {
      return Project.deleteOne({
        _id: args.id,
      });
    },
  },
};

module.exports = { addProject } = mutations;
