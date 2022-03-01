import { skip } from 'graphql-resolvers'
import { isValidObjectId } from '../database/util';
import Task from '../model/task';

export const isAuthenticated = (_, __, { email }) => {
   if (!email) {
      throw new Error('Access Denied! Please login to continue');
   };
   return skip
}

export const isTaskOwner = async (_, { id }, { loggedInUserId }) => {
   try {
      if (!isValidObjectId(id)) {
         throw new Error('Invalid task ID!!!')
      }
      const task = await Task.findById(id);
      if (!task) {
         throw new Error('Task not found')
      } else if (task.user.toString() !== loggedInUserId) {
         throw new Error('Not authorized as task owner')
      };
      return skip
   } catch (error) {
      console.log(error);
      throw error
   }
}