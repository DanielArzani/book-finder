const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const { authMiddleware } = require("./utils/auth");

const path = require("path");
const db = require("./config/connection");

const { typeDefs, resolvers } = require("./schema/");

const app = express();
const PORT = process.env.PORT || 3001;

const startServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: authMiddleware,
  });
  await server.start();
  server.applyMiddleware({ app });
  console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
};
startServer();

// This is extended true because we have an input type in /schema/typeDefs.js so the query string shouldn't be parsed into a flat data structure but a nested one
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));

  // send index.html for any routes that don't exist
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build/index.html"));
  });
}

db.once("open", () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});
