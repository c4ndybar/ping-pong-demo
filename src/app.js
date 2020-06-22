const express = require('express')
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express')
const schema = require('./graphql/schema')
const app = express()

// middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// The GraphQL endpoint
app.use('/api/graphql', graphqlExpress({ schema }))

// GraphiQL, a visual editor for queries
app.use('/graphiql', graphiqlExpress({ endpointURL: '/api/graphql', rewriteURL: false }))

// routes
app.get('/api/ping', (req, res) => {
  res.send('pong')
})

module.exports = app
