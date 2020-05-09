const UserType = require("../types/UserType");
const User = require("../../models/User");
const { GraphQLNonNull, GraphQLString, GraphQLObjectType } = require("graphql");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateAccessToken } = require("../../helpers");

const AuthType = new GraphQLObjectType({
  name: "Auth",
  description: "Represents User",
  fields: () => ({
    token: {
      type: GraphQLString,
    },
    user: {
      type: UserType,
      resolve: (parent, args) => parent,
    },
  }),
});
const mutations = {
  register: {
    type: AuthType,
    args: {
      email: { type: new GraphQLNonNull(GraphQLString) },
      password: { type: new GraphQLNonNull(GraphQLString) },
    },
    async resolve(parent, { email, password }) {
      const exists = await User.findOne({ email });
      if (exists) throw new Error("User already exists");
      const hashPassword = await bcrypt.hash(password, 12);
      const user = await new User({
        email,
        password: hashPassword,
      });
      const newUser = await user.save();
      const token = generateAccessToken(newUser, "1hr");
      return {
        id: newUser.id,
        token,
        ...newUser._doc,
      };
    },
  },
  login: {
    type: AuthType,
    args: {
      email: { type: GraphQLNonNull(GraphQLString) },
      password: { type: GraphQLNonNull(GraphQLString) },
    },
    async resolve(_, { email, password }) {
      const user = await User.findOne({ email });
      if (!user) throw new Error(`User doesn't exist.`);
      const match = await bcrypt.compare(password, user.password);
      if (!match) throw new Error("Invalid Credentials");
      const token = generateAccessToken(user, "1hr");
      return {
        id: user.id,
        token,
        ...user._doc,
      };
    },
  },
};

module.exports = { register } = mutations;
