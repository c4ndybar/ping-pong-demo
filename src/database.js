const AWS = require('aws-sdk')
const dynamoDb = new AWS.DynamoDB.DocumentClient()
const { v4: uuid } = require('uuid')

async function scanTable (tableName) {
  const params = {
    TableName: tableName
  }

  const scanResults = []
  let items
  do {
    items = await dynamoDb.scan(params).promise()
    items.Items.forEach((item) => scanResults.push(item))
    params.ExclusiveStartKey = items.LastEvaluatedKey
  } while (typeof items.LastEvaluatedKey !== 'undefined')

  return scanResults
}

async function getAllPlayers () {
  return scanTable('players')
}

async function getAllGames () {
  return scanTable('games')
}

async function getPlayer (id) {
  const data = await dynamoDb.get({
    TableName: 'players',
    Key: { id }
  }).promise()

  return data.Item
}

async function getGame (id) {
  const data = await dynamoDb.get({
    TableName: 'games',
    Key: { id }
  }).promise()

  return data.Item
}

async function createPlayer (name) {
  const player = { id: uuid(), name, wins: 0, losses: 0 }

  return putPlayer(player)
}

async function putPlayer (player) {
  const params = {
    TableName: 'players',
    Item: player
  }

  await dynamoDb.put(params).promise()

  return player
}

async function createGame (homePlayerId, awayPlayerId, homePlayerScore, awayPlayerScore) {
  const game = { id: uuid(), homePlayerId, awayPlayerId, homePlayerScore, awayPlayerScore }
  const params = {
    TableName: 'games',
    Item: game
  }

  await dynamoDb.put(params).promise()

  return game
}

module.exports = {
  createPlayer,
  putPlayer,
  getPlayer,
  getAllPlayers,
  createGame,
  getGame,
  getAllGames
}
