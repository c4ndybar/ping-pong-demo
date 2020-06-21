module.exports = `
    type Player { id: String, name: String }
    type Game {id: String, homePlayerId: String, awayPlayerId: String, homePlayerScore: Int, awayPlayerScore: Int}
    type Ranking {rank: Int, wins: Float, losses: Float, player: Player}

    type Query { 
        players: [Player] 
        games: [Game]
        rankings: [Ranking]
    }

    type Mutation {
        createPlayer(
            name: String!
        ): Player
        createGame( 
            homePlayerId: String!
            awayPlayerId: String!
            homePlayerScore: Int!
            awayPlayerScore: Int!
        ): Game
    }
`