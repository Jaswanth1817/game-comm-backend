import { User } from '../models/User'
import bcrypt from 'bcryptjs'
import { issueToken, getAuthUser, getRefreshTokenUser } from '../functions/auth'

export const resolvers = {
  Query: {
    users: async( root, args, { req }, info ) => {
      await getAuthUser(req);
      let users = await User.find();
      return users;
    },
    otherUser: async( root, args, { req }, info ) => {
      let result = await User.findOne({username: args.username});
      return result;
    },
    searchUser: async( root, args, { req }, info ) => {
      let search = await User.find({username: new RegExp(args.letter, "i")})
      return search;
    },

    profile: async( root, args, { req }, info ) => {
      let authUser = await getAuthUser(req, true);
      return authUser;
    },
    refreshToken: async( root, args, { req }, info ) => {
      let authUser = await getRefreshTokenUser(req, true);
      let tokens = await issueToken(authUser);
      return {
        user: authUser,
        ...tokens
      }
    },
  },
  Mutation: {
    signup: async( root, args, { req }, info ) => {
      try {
        let user = await User.findOne({ username: args.username });
        if (user) {
          throw new Error("Username is already taken.");
        }
        args.password = await bcrypt.hash(args.password, 10);
        let newUser = await User.create(args);
        let tokens = await issueToken(newUser);
        return {
          user: newUser,
          ...tokens,
        }
      } catch (error) {
        console.log(error)
      }
    },
    login: async( root, args, { req }, info ) => {
      let user = await User.findOne({ username: args.username });
      if(!user) {
        throw new Error("Username not found!");
      }
      let isMatch = await bcrypt.compare(args.password, user.password);
      if(!isMatch) {
        throw Error("Password is incorrect!")
      }
      let tokens = await issueToken(user);
      return {
        user: user,
        ...tokens
      }
    },
  }
}
