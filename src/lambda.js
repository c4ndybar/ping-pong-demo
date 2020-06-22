const serverless = require('serverless-http')
const app = require('./app')
const gameChangedHandler = require('./gameChangedHandler')

module.exports = {
  api: serverless(app),
  gameChangedHandler: gameChangedHandler.handler
}
