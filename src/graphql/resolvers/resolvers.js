const database = require('../../database')

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
    games: () => database.getAllGames(),
    rankings: () => {
      // let defaultStats = { wins: 0, losses: 0 }

      // let lastWins, lastRank;

      // let rankings = players.map((player) => {
      //     stats = playerStats[player.id] || Object.assign({}, defaultStats);
      //     stats.winLossRatio = stats.wins / stats.losses;

      //     return { rank: 0, ...stats, player }
      // })
      //     .sort((a, b) => {
      //         if (b.winLossRatio == a.winLossRatio) {
      //             return a.losses - b.losses
      //         } else {
      //             return b.winLossRatio - a.winLossRatio
      //         }
      //     })
      //     .map((rank, index) => {
      //         if (lastWins == rank.wins) {
      //             // we have a tie!
      //             rank.rank = lastRank;
      //         } else {
      //             rank.rank = index + 1;
      //         }

      //         lastWins = rank.wins;
      //         lastRank = rank.rank;

      //         return rank;
      //     });

      // return rankings;

      return []
    }
  }
}

module.exports = resolvers
