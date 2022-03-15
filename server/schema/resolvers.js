const { User } = require("../models/");
const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require("../utils/auth.js");

const resolvers = {
  Query: {},
  Mutation: {},
};

module.exports = resolvers;
