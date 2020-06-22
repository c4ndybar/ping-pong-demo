const { Game, GAME_RESULT } = require('./models/game')
const database = require('./database')

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

module.exports = async (event, context, callback) => {
  const updates = event.Records.map((record) => {
    console.log('Stream record: ', JSON.stringify(record, null, 2))
    const { id, homePlayerId, awayPlayerId, homePlayerScore, awayPlayerScore } = record.dynamodb.NewImage
    const game = new Game(id.S, homePlayerId.S, awayPlayerId.S, homePlayerScore.N, awayPlayerScore.N)

    return Promise.all([
      updatePlayerWinsLosses(awayPlayerId, game.gameResultForPlayer(awayPlayerId)),
      updatePlayerWinsLosses(homePlayerId, game.gameResultForPlayer(homePlayerId))
    ])
  })

  await updates

  callback(null, `Successfully processed ${event.Records.length} game records.`)
}
