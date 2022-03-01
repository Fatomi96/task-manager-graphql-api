import { gql } from "apollo-server-express";
import taskTypeDefs from './task';
import userTypeDefs from './user';

const typeDefs = gql`
   scalar Date
   
   type Query {
      _: String
   }

   type Mutation {
      _: String
   }

   type Subscription {
      _: String
   }
`

export default [
   typeDefs,
   taskTypeDefs,
   userTypeDefs
]