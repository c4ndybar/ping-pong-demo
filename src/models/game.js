const GAME_RESULT = {
  win: 'win',
  loss: 'loss',
  tie: 'tie'
}

class Game {
  constructor (id, homePlayerId, awayPlayerId, homePlayerScore, awayPlayerScore) {
    this.id = id
    this.homePlayerId = homePlayerId
    this.awayPlayerId = awayPlayerId
    this.homePlayerScore = homePlayerScore
    this.awayPlayerScore = awayPlayerScore
  }

  hasPlayer (playerId) {
    return ([this.homePlayerId, this.awayPlayerId].includes(playerId))
  }

  validateGameHasPlayer (playerId) {
    if (!this.hasPlayer(playerId)) {
      throw new Error('game does not have player')
    }
  }

  isHomePlayer (playerId) {
    this.validateGameHasPlayer(playerId)

    return (this.homePlayerId === playerId)
  }

  isAwayPlayer (playerId) {
    return !this.isHomePlayer(playerId)
  }

  gameResultForPlayer (playerId) {
    this.validateGameHasPlayer(playerId)

    if (this.homePlayerScore === this.awayPlayerScore) {
      return GAME_RESULT.tie
    } else if (this.homePlayerScore > this.awayPlayerScore) {
      return (this.isHomePlayer(playerId)) ? GAME_RESULT.win : GAME_RESULT.loss
    } else {
      return (this.isAwayPlayer(playerId)) ? GAME_RESULT.win : GAME_RESULT.loss
    }
  }
}

module.exports = { Game, GAME_RESULT }
