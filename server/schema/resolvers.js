const { User } = require("../models/");
const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require("../utils/auth.js");

const resolvers = {
  Query: {
    /**-------------------------
     * GET AUTHENTICATED USER
     *------------------------**/
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findById(context.user._id);

        return userData;
      }

      throw new AuthenticationError("Not logged in");
    },
  },
  Mutation: {
    /**-------------------------
     *       CREATE USER
     *------------------------**/
    addUser: async (parent, args) => {
      // create new user
      const user = await User.create(args);
      // signToken with secret password
      const token = signToken(user);

      // Send token to client
      return { token, user };
    },

    /**-------------------------
     *          LOGIN
     *------------------------**/
    login: async (parent, { email, password }) => {
      // Check if user with given email exists
      const user = await User.findOne({ email });

      // If not throw error
      if (!user) {
        throw new AuthenticationError("Incorrect Credentials");
      }

      // Check if given password is the same as the un-hashed one in the database
      const correctPw = await user.isCorrectPassword(password);

      // If not, throw error
      if (!correctPw) {
        throw new AuthenticationError("Incorrect Credentials");
      }

      // Sign token and return it to the client
      const token = signToken(user);
      return { token, user };
    },

    /**-------------------------
     *         SAVE BOOK
     *------------------------**/
    saveBook: async (parent, { input }, { user }) => {
      if (user) {
        const userData = User.findByIdAndUpdate(
          user._id,
          { $push: { savedBooks: input } },
          { new: true, runValidators: true }
        );

        return userData;
      }

      throw new AuthenticationError("You need to be logged in to save a book");
    },

    /**-------------------------
     *       REMOVE BOOK
     *------------------------**/
    removeBook: async (parent, { bookId }, { user }) => {
      if (user) {
        const userData = User.findByIdAndUpdate(
          user._id,
          { $pull: { savedBooks: { bookId } } },
          { new: true, runValidators: true }
        );

        return userData;
      }

      throw new AuthenticationError(
        "You need to be logged in to remove a book"
      );
    },
  },
};

module.exports = resolvers;
