const { database } = require('../../database')
const { playerController } = require('../../playerController')

const resolvers = {
  Mutation: {
    createPlayer: async (_, { name }) => {
      return await database.createPlayer(name)
    },
    createGame: async (_, { homePlayerId, awayPlayerId, homePlayerScore, awayPlayerScore }) => {
      return await database.createGame(
        homePlayerId,
        awayPlayerId,
        homePlayerScore,
        awayPlayerScore
      )
    }
  },
  Query: {
    players: () => database.getAllPlayers(),
    player: (_, { id }) => database.getPlayer(id),
    games: () => database.getAllGames(),
    game: (_, { id }) => database.getGame(id),
    rankings: () => playerController.getPlayerRankings()
  }
}

module.exports = resolvers
