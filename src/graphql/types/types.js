module.exports = `
    type Player { id: String, name: String, wins: Float, losses: Float }
    type Game {id: String, homePlayerId: String, awayPlayerId: String, homePlayerScore: Int, awayPlayerScore: Int}
    type Ranking {rank: Int, player: Player}

    type Query { 
        players: [Player] 
        player(id: String): Player
        games: [Game]
        game(id: String): Game
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
