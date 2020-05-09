const { GraphQLList, GraphQLString, GraphQLNonNull } = require("graphql");
const User = require("../../models/User");
const UserType = require("../types/UserType");
const bcrypt = require('bcrypt')

const queries = {
  users: {
    type: new GraphQLList(UserType),
    resolve: (user, args) => User.find(),
  },
  getUser: {
    type: UserType,
    args: {
      token: {
        type: GraphQLString
      }
    },
    resolve(parent, _, req) {
       if (!req.isAuth) {
         throw new Error("Unauthenticated");
       }
       console.log(req.id)
       return req.id
    }
  }
};

module.exports = { users } = queries;
