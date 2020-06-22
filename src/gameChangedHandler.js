const { Game, GAME_RESULT } = require('./models/game')
const { database } = require('./database')

async function updatePlayerWinsLosses (playerId, gameResult) {
  const player = await database.getPlayer(playerId)

  switch (gameResult) {
    case GAME_RESULT.tie:
      player.wins += 0.5
      player.losses += 0.5
      break
    case GAME_RESULT.win:
      player.wins += 1
      break
    case GAME_RESULT.loss:
      player.losses += 1
  }

  return await database.putPlayer(player)
}

function newImageToGame (newImage) {
  const id = JSON.stringify(newImage.id.S)
  const homePlayerScore = JSON.stringify(newImage.homePlayerScore.N)
  const awayPlayerScore = JSON.stringify(newImage.awayPlayerScore.N)
  const homePlayerId = JSON.stringify(newImage.homePlayerId.S)
  const awayPlayerId = JSON.stringify(newImage.awayPlayerId.S)

  return new Game(id, homePlayerId, awayPlayerId, homePlayerScore, awayPlayerScore)
}

module.exports = async (event, context, callback) => {
  const updates = event.Records.map((record) => {
    console.log('Stream record: ', JSON.stringify(record, null, 2))
    const game = newImageToGame(record.dynamodb.NewImage)

    return Promise.all([
      updatePlayerWinsLosses(game.awayPlayerId, game.gameResultForPlayer(game.awayPlayerId)),
      updatePlayerWinsLosses(game.homePlayerId, game.gameResultForPlayer(game.homePlayerId))
    ])
  })

  await Promise.all(updates)

  callback(null, `Successfully processed ${event.Records.length} game records.`)
}
