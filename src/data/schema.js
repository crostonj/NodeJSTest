/*jshint esnext: true */
//var GraphQLSchema = require("graphql").GraphQLSchema;
//var GraphQLObjectType = require("graphql").GraphQLObjectType;
//var GraphQLInt = require("graphql").GraphQLInt;
import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLSchema,
  GraphQLInt
} from 'graphql';

//import{
//    GraphQLSchema,
//    GraphQLObjectType,
//     GraphQLInt
//} from 'graphql';


let schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        fields: () => ({
            counter: {
                type: GraphQLInt,
                resolve( ) {
                    return () => 42
                }
                
            }
        })
    })
    
    //mutation: ...
});

export default schema;