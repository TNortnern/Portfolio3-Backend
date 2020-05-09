const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
} = require("graphql");

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLID },
    email: { type: GraphQLString },
    createdAt: {
      type: GraphQLString,
      resolve(item, args) {
        return item.createdAt;
      },
    },
    updatedAt: {
      type: GraphQLString,
      resolve(item, args) {
        return item.updatedAt;
      },
    },
  }),
});

module.exports = UserType