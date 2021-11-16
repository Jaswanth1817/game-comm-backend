import { ApolloServer } from "apollo-server-express";
import express from"express"
import mongoose from "mongoose"
import bodyParser from "body-parser";

import { typeDefs } from './graphql/typeDefs'
import { resolvers } from './graphql/resolvers'

require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;


const startServer = async(typeDefs, resolvers) => {
  const app = express();

  app.disable("x-powered-by");
  
  app.use(bodyParser.json());

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req, res}) => ({req, res}),
  });

  await server.start();
  
  server.applyMiddleware({ app, path: "/graphql" });

  await mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
    .then(() => console.log('connected to mongodb'))
    .catch((err) => console.log(`error in connection: ${err}`));

  

  app.listen(process.env.PORT || 5000 , () => {
    console.log(`🎉🏃🏻‍♂️Server ready at http://localhost:${process.env.PORT || 5000}${server.graphqlPath}`)
  });

}

startServer(typeDefs, resolvers);