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
      console.log('links before parse', args.links)
      const linksArr = args.links;
      const links = {};
      if (linksArr.length) {
        links.codeLink = linksArr[0];
        links.hostedLink = linksArr[1];
      }
      console.log('links after parse', links)
      let project = new Project({
        name: args.name,
        description: args.description,
        technologies: args.technologies,
        links,
        images: filename
          ? process.env.PRODUCTION_APP_URL + "images/" + filename
          : "",
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
