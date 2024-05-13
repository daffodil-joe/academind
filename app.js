const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();
const Event = require("./models/event");

app.use(bodyParser.json());
app.use(
  "/graphql", //graphql endpoint, all requests are sent there..
  //middleware as second argumment to app.use
  graphqlHTTP({
    schema: buildSchema(`
        type Event {
          _id: ID! 
          title: String!
          description: String!
          price: Float!
          date: String!
        }

        input EventInput {
          title: String!
          description: String!
          price: Float!
          date: String!
        }
        type RootQuery {
          events: [Event!]! 
          
        }
        type RootMutation{
          createEvent(eventInput:EventInput): Event
        }
        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    //points to valid graphql schema
    //contains resolver functions
    rootValue: {
      events: async () => {
        try {
          const events = await Event.find();
          return events.map((event) => {
            return { ...event._doc };
          });
        } catch (err) {
          console.log(err);
          throw err;
        }
      },
      createEvent: async (args) => {
        const event = new Event({
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: +args.eventInput.price,
          date: new Date(args.eventInput.date),
        });
        // return statements stops it being executed immediately, makes it asynchronous.
        // use async instead, all encapsulated in createEvent
        try {
          const result = await event.save();
          console.log(result);
          return { ...result._doc };
        } catch (err) {
          console.log(err);
          throw err;
        }
      },
    },
    graphiql: true,
  })
);
const mongo_password = encodeURIComponent(process.env.MONGO_PASSWORD);

const mongo_uri = `mongodb+srv://${process.env.MONGO_USER}:${mongo_password}@cluster0.ys6nnik.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority&appName=Cluster0`;

// "mongodb+srv://joe:securepassword@cluster0.ys6nnik.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

try {
  console.log(mongo_uri);
  mongoose.connect(mongo_uri);
  app.listen(5000);
  console.log("connected to DB");
} catch (err) {
  console.log(err);
  throw err;
}
