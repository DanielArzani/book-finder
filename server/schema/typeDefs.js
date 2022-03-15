const { gql } = require("apollo-server-express");

//TODO: USE INPUT TYPE TO HANDLE SAVEBOOK PARAMETERS AND ADD A BOOK AUTHOR'S ARRAY
const typeDefs = gql`
  type User {
    _id: ID
    username: String
    password: String
    email: String
    bookCount: Int
    savedBooks: [Book]
  }

  type Book {
    bookId: ID
    authors: [String]
    description: String
    title: String
    image: String
    link: String
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    me: User
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(
      bookArray: [String]
      description: String
      title: String
      bookId: ID
      image: String
      link: String
    ): User
    removeBook(bookId: String!): User
  }
`;

module.exports = typeDefs;
