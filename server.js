import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import dotEnv from 'dotenv';
import DataLoader from 'dataloader';
import resolvers from './app/graphql/resolvers/index';
import typeDefs from './app/graphql/schema/index';
import { connection } from './app/database/util';
import { verifyUser } from './app/util/helper/context';
import {loaders} from './app/loaders';

dotEnv.config(); //set env variables

const app = express();

app.use(cors());
app.use(express.json()); //body parser middleware

connection();

const apolloServer = new ApolloServer({
   typeDefs,
   resolvers,
   context: async ({ req, conection }) => {
      const contextObj = {}
      if (req) {
         await verifyUser(req);
         contextObj.email = req.email;
         contextObj.loggedInUserId = req.loggedInUserId;

      }
      contextObj.loaders = {
         user: new DataLoader(keys => loaders.user.batchUsers(keys))
      };
      return contextObj;
   },
   formatError: (error) => {
      return {
         message: error.message
      }
   }
});

await apolloServer.start()
apolloServer.applyMiddleware({app, path: '/graphql'}); //path for graphql to listen to 

const PORT = process.env.PORT || 2000;

app.use('/', (req, res, next) => {
   res.send({message: "Hello"})
})


const httpServer = app.listen(PORT, () => {
   console.log(`Server listening ON PORT: ${PORT}`);
   console.log(`Graphql Endpoint: ${apolloServer.graphqlPath}`);
});

apolloServer.installSubscriptionHandlers(httpServer)