import { gql } from 'apollo-server-express'

export const typeDefs = gql`
    type Query {
      profile: User
      users: [User!]!
      refreshToken: Auth!
      otherUser(username: String!): User
      searchUser(letter: String!): [User!]!
    }
    type User {
      id: ID!
      profilePic: String
      email: String!
      username: String!
      phone: String!
      createdAt: String!
      updatedAt: String!
    }
    type Auth {
      user: User
      token: String!
      refreshToken: String!
    }
    type Mutation {
      signup(
        profilePic: String
        email: String!
        username: String!
        phone: String!
        password: String!
      ): Auth!
      login(username: String!, password: String!): Auth!
    }
`;
