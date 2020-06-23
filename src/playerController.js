const { GAME_RESULT } = require('./models/game')
const { database } = require('./database')

async function updatePlayerWinsLosses (game) {
  const updates = [game.awayPlayerId, game.homePlayerId].map(async (playerId) => {
    return updateWinsLossesForPlayer(playerId, game)
  })

  return await Promise.all(updates)
}

async function updateWinsLossesForPlayer (playerId, game) {
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

async function getPlayerRankings () {
  const players = await database.getAllPlayers()
  let lastWins, lastLosses, lastRank

  return players.sort(comparePlayers)
    .map((player, index) => {
      let rank = index + 1
      if (lastWins === player.losses && lastLosses === player.losses) {
        rank = lastRank
      } else {
        lastWins = player.wins
        lastLosses = player.losses
        lastRank = rank
      }

      return {
        rank,
        player
      }
    })
}

function comparePlayers (p1, p2) {
  if (p1.wins === p2.wins) {
    return p1.losses - p2.losses
  } else {
    return p2.wins - p1.wins
  }
}

module.exports = {
  playerController: {
    updatePlayerWinsLosses,
    getPlayerRankings
  }
}
