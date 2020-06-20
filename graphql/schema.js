const { makeExecutableSchema } = require('graphql-tools');

// Some fake data
const players = [
    {
        id: 1,
        name: "Patrick Ping",
    },
    {
        id: 2,
        name: 'Peter Pong',
    },
    {
        id: 3,
        name: 'Pam Player',
    },
    {
        id: 4,
        name: 'Patty Paddle',
    },
];

const games = [
    {
        id: 1,
        homePlayer: players[0],
        awayPlayer: players[1],
        homePlayerScore: 10,
        awayPlayerScore: 3
    },
    {
        id: 2,
        homePlayer: players[1],
        awayPlayer: players[2],
        homePlayerScore: 18,
        awayPlayerScore: 8
    },
    {
        id: 3,
        homePlayer: players[3],
        awayPlayer: players[1],
        homePlayerScore: 5,
        awayPlayerScore: 8
    },
];

// The GraphQL schema in string form
const typeDefs = `
    type Query { 
        players: [Player] 
        games: [Game]
        rankings: [Ranking]
    }

    type Player { id: Int, name: String }
    type Game {id: Int, homePlayer: Player, awayPlayer: Player, homePlayerScore: Int, awayPlayerScore: Int}
    type Ranking {rank: Int, wins: Float, losses: Float, player: Player}
  `;

// The resolvers
const resolvers = {
    Query: {
        players: () => players,
        games: () => games,
        rankings: () => {
            let playerStats = {}
            let defaultStats = { wins: 0, losses: 0 }

            games.forEach((game) => {
                if (!playerStats[game.homePlayer.id]) {
                    playerStats[game.homePlayer.id] = Object.assign({}, defaultStats);
                }
                if (!playerStats[game.awayPlayer.id]) {
                    playerStats[game.awayPlayer.id] = Object.assign({}, defaultStats);
                }
                if (game.homePlayerScore == game.awayPlayerScore) {
                    playerStats[game.homePlayer.id].wins += 0.5;
                    playerStats[game.homePlayer.id].losses += 0.5;
                    playerStats[game.awayPlayer.id].wins += 0.5;
                    playerStats[game.awayPlayer.id].losses += 0.5;
                } else if (game.homePlayerScore > game.awayPlayerScore) {
                    playerStats[game.homePlayer.id].wins += 1
                    playerStats[game.awayPlayer.id].losses += 1;
                } else {
                    playerStats[game.awayPlayer.id].wins += 1;
                    playerStats[game.homePlayer.id].losses += 1;
                }
            });

            let lastWins, lastRank;

            let rankings = players.map((player) => {
                stats = playerStats[player.id] || Object.assign({}, defaultStats);
                stats.winLossRatio = stats.wins / stats.losses;

                return { rank: 0, ...stats, player }
            })
                .sort((a, b) => {
                    if (b.winLossRatio == a.winLossRatio) {
                        return a.losses - b.losses
                    } else {
                        return b.winLossRatio - a.winLossRatio
                    }
                })
                .map((rank, index) => {
                    if (lastWins == rank.wins) {
                        // we have a tie!
                        rank.rank = lastRank;
                    } else {
                        rank.rank = index + 1;
                    }

                    lastWins = rank.wins;
                    lastRank = rank.rank;

                    return rank;
                });

            return rankings;
        }
    },
};

// Put together a schema
const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
});

module.exports = schema;