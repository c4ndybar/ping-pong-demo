const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const schema = require('./graphql/schema');
const app = express();

//middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// The GraphQL endpoint
app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));

// GraphiQL, a visual editor for queries
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

// routes 
app.use('/api', require('./routes'));
app.get('/api/ping', (req, res) => {
  res.send('pong');
});

module.exports = app;