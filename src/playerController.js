const { GAME_RESULT } = require('./models/game')
const { database } = require('./database')

async function updatePlayerWinsLosses(game) {
  const updates = [game.awayPlayerId, game.homePlayerId].map(async (playerId) => {
    return updateWinsLossesForPlayer(playerId, game)
  })

  return await Promise.all(updates)
}

async function updateWinsLossesForPlayer(playerId, game) {
  const gameResult = game.gameResultForPlayer(playerId)
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

  return database.putPlayer(player)
}

module.exports = { updatePlayerWinsLosses }
