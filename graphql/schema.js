const { makeExecutableSchema } = require('graphql-tools');

// Some fake data
const players = [
    {
        id: 1,
      name: "Patty Ping",
    },
    {
      id: 2,
      name: 'Peter Pong',
    },
  ];
  
  // The GraphQL schema in string form
  const typeDefs = `
    type Query { players: [Player] }
    type Player { id: Int, name: String }
  `;
  
  // The resolvers
  const resolvers = {
    Query: { players: () => players },
  };
  
  // Put together a schema
  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  module.exports = schema;