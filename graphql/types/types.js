module.exports = `
    type Player { id: Int, name: String }
    type Game {id: Int, homePlayer: Player, awayPlayer: Player, homePlayerScore: Int, awayPlayerScore: Int}
    type Ranking {rank: Int, wins: Float, losses: Float, player: Player}

    type Query { 
        players: [Player] 
        games: [Game]
        rankings: [Ranking]
    }
`