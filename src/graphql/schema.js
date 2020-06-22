const { makeExecutableSchema } = require('graphql-tools')

// Put together a schema
const schema = makeExecutableSchema({
  typeDefs: require('./types/types.js'),
  resolvers: require('./resolvers/resolvers')
})

module.exports = schema
