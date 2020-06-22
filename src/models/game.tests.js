const expect = require('chai').expect
const { Game, GAME_RESULT } = require('./game')

function createGame (props = {}) {
  let game = new Game(1, 2, 3, 4, 5)

  game = Object.assign(game, props)

  return game
}
describe('Game', () => {
  it('is created with correct properties', () => {
    const game = createGame()

    expect(game.id).to.eql(1)
    expect(game.homePlayerId).to.eql(2)
    expect(game.awayPlayerId).to.eql(3)
    expect(game.homePlayerScore).to.eql(4)
    expect(game.awayPlayerScore).to.eql(5)
  })

  describe('.hasPlayer', () => {
    it('detects when it has the home player', () => {
      const game = createGame({ homePlayerId: 44 })

      const hasPlayer = game.hasPlayer(44)

      expect(hasPlayer).to.be.true
    })

    it('detects when it has the away player', () => {
      const game = createGame({ awayPlayerId: 44 })

      const hasPlayer = game.hasPlayer(44)

      expect(hasPlayer).to.be.true
    })

    it('detects when it does not have the player', () => {
      const game = createGame({ awayPlayerId: 44 })

      const hasPlayer = game.hasPlayer(55)

      expect(hasPlayer).to.be.false
    })
  })

  describe('validateGameHasPlayer', () => {
    it('does nothing when game has player', () => {
      const game = createGame({ homePlayerId: 22, awayPlayerId: 44 })

      expect(() => game.validateGameHasPlayer(44)).to.not.throw()
      expect(() => game.validateGameHasPlayer(22)).to.not.throw()
    })

    it('does throws exception when player is not in game', () => {
      const game = createGame({ homePlayerId: 22, awayPlayerId: 44 })

      expect(() => game.validateGameHasPlayer(667)).to.throw()
    })
  })

  describe('isHomePlayer', () => {
    it('detects the home player', () => {
      const game = createGame({ homePlayerId: 44 })

      expect(game.isHomePlayer(44)).to.be.true
    })

    it('detects when player is not the home player', () => {
      const game = createGame({ awayPlayerId: 44 })

      expect(game.isHomePlayer(44)).to.be.false
    })

    it('throws if player is not in game', () => {
      const game = createGame({ homePlayerId: 22, awayPlayerId: 44 })

      expect(() => game.isHomePlayer(888)).to.throw()
    })
  })

  describe('isAwayPlayer', () => {
    it('detects the away player', () => {
      const game = createGame({ awayPlayerId: 44 })

      expect(game.isAwayPlayer(44)).to.be.true
    })

    it('detects when player is not the away player', () => {
      const game = createGame({ homePlayerId: 44 })

      expect(game.isAwayPlayer(44)).to.be.false
    })

    it('throws if player is not in game', () => {
      const game = createGame({ homePlayerId: 22, awayPlayerId: 44 })

      expect(() => game.isAwayHomePlayer(888)).to.throw()
    })
  })

  describe('.gameResultForPlayer', () => {
    it('identifies if there was a tie for the home player', () => {
      const game = createGame({ homePlayerId: 22, homePlayerScore: 5, awayPlayerScore: 5 })

      const result = game.gameResultForPlayer(22)

      expect(result).to.eql(GAME_RESULT.tie)
    })

    it('identifies a win for the home player', () => {
      const game = createGame({ homePlayerId: 22, homePlayerScore: 6, awayPlayerScore: 5 })

      const result = game.gameResultForPlayer(22)

      expect(result).to.eql(GAME_RESULT.win)
    })

    it('identifies a loss for the home player', () => {
      const game = createGame({ homePlayerId: 22, homePlayerScore: 4, awayPlayerScore: 5 })

      const result = game.gameResultForPlayer(22)

      expect(result).to.eql(GAME_RESULT.loss)
    })

    it('identifies if there was a tie for the away player', () => {
      const game = createGame({ awayPlayerId: 22, homePlayerScore: 5, awayPlayerScore: 5 })

      const result = game.gameResultForPlayer(22)

      expect(result).to.eql(GAME_RESULT.tie)
    })

    it('identifies a win for the away player', () => {
      const game = createGame({ awayPlayerId: 22, homePlayerScore: 6, awayPlayerScore: 44 })

      const result = game.gameResultForPlayer(22)

      expect(result).to.eql(GAME_RESULT.win)
    })

    it('identifies a loss for the away player', () => {
      const game = createGame({ awayPlayerId: 22, homePlayerScore: 4, awayPlayerScore: 1 })

      const result = game.gameResultForPlayer(22)

      expect(result).to.eql(GAME_RESULT.loss)
    })
  })
})
