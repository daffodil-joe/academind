const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const mongoose = require("mongoose");
const app = express();
const graphQlSchema = require("./graphql/schemas/index");
const graphQlResolvers = require("./graphql/resolvers/index");
require("dotenv").config();

app.use(bodyParser.json());

app.use(
  "/graphql", //graphql endpoint, all requests are sent there..
  //middleware as second argumment to app.use
  graphqlHTTP({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true,
  })
);
const mongo_password = encodeURIComponent(process.env.MONGO_PASSWORD);

const mongo_uri = `mongodb+srv://${process.env.MONGO_USER}:${mongo_password}@cluster0.ys6nnik.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority&appName=Cluster0`;

try {
  console.log(mongo_uri);
  mongoose.connect(mongo_uri);
  app.listen(5000);
  console.log("connected to DB");
} catch (err) {
  console.log(err);
  throw err;
}
