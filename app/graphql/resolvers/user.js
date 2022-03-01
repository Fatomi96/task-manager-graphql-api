import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { combineResolvers } from 'graphql-resolvers'
import PubSub from 'apollo-server-express';

import userEvents from '../pubsub/events/user'
import {pubSub} from '../pubsub/index'
import User from '../../model/user';
import { isAuthenticated } from "../../middleware";
import Task from "../../model/task"

const userResolver = {
   Query: {
      user: combineResolvers(isAuthenticated, async (_, __, { email }) => {
         try {
            const user = await User.findOne({ email })
            if(!user){
               throw new Error('User not found')
            }
            return user
         } catch (error) {
            console.log(error);
            throw error
         }
         // return users.find(user => user.id === id)
      })
   },

   Mutation :{
      signUp: async (_, { input }) => {
         try {
            const user = await User.findOne({ email: input.email })
            if (user) {
               throw new Error('Email already in use')
            }
            const hashedPassword = await bcrypt.hash(input.password, 12)
            const newUser = new User({ ...input, password: hashedPassword})
            const result = await newUser.save()
            pubSub.publish(userEvents.USER_CREATED, {
               userCreated: result
            }) 
            return result
         } catch (error) {
            console.log(error)
            throw error
         }
      },
      login: async (_, { input }) => {
         try {
            const user = await User.findOne({ email: input.email });
            if (!user) {
               throw new Error('User does not exist, please sign up')
            }
            const isPasswordValid = await bcrypt.compare(input.password, user.password)
            if (!isPasswordValid) {
               throw new Error('incorrect Password')
            }
            const secret = process.env.JWT_SECRET_KEY
            const token = jwt.sign({  email: user.email}, secret, { expiresIn: '1d' })
            return { token }
         } catch (error) {
            console.log(error);
            throw error
         }
      }
   },

   Subscription: {
      userCreated: {
         subscribe: () => pubSub.asyncIterator(userEvents.USER_CREATED)
      }
   },

   User: {
      // task: ({ id }) => tasks.filter(task => task.userId === id)
      task: async ({ id }) => {
         try {
            const task = await Task.find({ user: id });
            return task
         } catch (error) {
            console.log(error);
            throw error
         }
      }
   },
}

export default userResolver