import { gql } from "apollo-server-express";

const userTypeDefs = gql`
  extend type Query { 
    user: User
  }

  extend type Mutation {
    signUp(input: signUpInput): User
    login(input: loginInput): Token
  }

  input signUpInput {
    name: String!,
    email: String!,
    password: String!
  }

  input loginInput {
    email: String!
    password: String!
  }

  type Token {
    token: String!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    task: [Task!]
    createdAt: Date!
    updatedAt: Date!
  }

  extend type Subscription {
    userCreated: User
  }
`;

export default userTypeDefs