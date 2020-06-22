const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
chai.use(sinonChai)
const expect = chai.expect
const resolvers = require('./resolvers')
const { database } = require('../../database')

describe('resolvers', () => {
  describe('.Query', () => {
    it('resolves players', async () => {
      const expected = [1, 2, 3]
      sinon.stub(database, 'getAllPlayers').returns(expected)

      const players = await resolvers.Query.players()

      expect(players).to.eql(expected)
    })

    it('resolves all games', async () => {
      const expected = [1, 2, 3]
      sinon.stub(database, 'getAllGames').returns(expected)

      const games = await resolvers.Query.games()

      expect(games).to.eql(expected)
    })

    it('resolves a single player', async () => {
      const expected = { id: 2, name: 'player' }
      sinon.stub(database, 'getPlayer').returns(expected)

      const player = await resolvers.Query.player(null, { id: 2 })

      expect(player).to.eql(expected)
      expect(database.getPlayer).to.have.been.calledWith(2)
    })

    it('resolves a single game', async () => {
      const expected = { id: 2 }
      sinon.stub(database, 'getGame').returns(expected)

      const game = await resolvers.Query.game(null, { id: 2 })

      expect(game).to.eql(expected)
      expect(database.getGame).to.have.been.calledWith(2)
    })
  })

  describe('.Mutation', () => {
    it('creates a single player', async () => {
      const expected = { id: 2, name: 'frank' }
      sinon.stub(database, 'createPlayer').returns(expected)

      const player = await resolvers.Mutation.createPlayer(null, { name: 'frank' })

      expect(player).to.eql(expected)
      expect(database.createPlayer).to.have.been.calledWith('frank')
    })

    it('creates a single game', async () => {
      const expected = { id: 2, homePlayerId: 1, awayPlayerId: 2, homePlayerScore: 5, awayPlayerScore: 8 }
      sinon.stub(database, 'createGame').returns(expected)

      const player = await resolvers.Mutation.createGame(null, { homePlayerId: 1, awayPlayerId: 2, homePlayerScore: 5, awayPlayerScore: 8 })

      expect(player).to.eql(expected)
      expect(database.createGame).to.have.been.calledWith(1, 2, 5, 8)
    })
  })
})
