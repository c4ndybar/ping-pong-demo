const { Game } = require('./models/game')
const playerController = require('./playerController')

function newImageToGame (newImage) {
  console.log('got image', JSON.stringify(newImage))
  console.log('got player', JSON.stringify(newImage.homePlayerId))
  const id = newImage.id.S
  const homePlayerScore = newImage.homePlayerScore.N
  const awayPlayerScore = newImage.awayPlayerScore.N
  const homePlayerId = newImage.homePlayerId.S
  const awayPlayerId = newImage.awayPlayerId.S

  console.log('got home player id', homePlayerId)
  console.log('got away player id', awayPlayerId)

  return new Game(id, homePlayerId, awayPlayerId, homePlayerScore, awayPlayerScore)
}

async function handler (event, context, callback) {
  const updates = event.Records.map((record) => {
    console.log('Stream record: ', JSON.stringify(record, null, 2))
    const game = newImageToGame(record.dynamodb.NewImage)

    return playerController.updatePlayerWinsLosses(game)
  })

  await Promise.all(updates)

  return callback(null, `Successfully processed ${event.Records.length} game records.`)
}

module.exports = { handler }
