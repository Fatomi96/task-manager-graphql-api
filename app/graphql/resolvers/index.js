import GraphQLDateTime from 'graphql-iso-date';
import taskResolver from './task';
import userResolver from './user';

const customDateScalerResolver = {
   Date: GraphQLDateTime
}

export default [
   taskResolver,
   userResolver,
   customDateScalerResolver
]
