const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
chai.use(sinonChai)
const expect = chai.expect
const resolvers = require('./resolvers')
const { database } = require('../../database')
const { playerController } = require('../../playerController')

describe('resolvers', () => {
  let sandbox

  beforeEach(() => {
    sandbox = sinon.createSandbox()
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('.Query', () => {
    it('gets player rankings', async () => {
      const expected = [1, 2, 3]
      sandbox.stub(playerController, 'getPlayerRankings').returns(expected)

      const rankings = await resolvers.Query.rankings()

      expect(rankings).to.eql(expected)
    })

    it('resolves players', async () => {
      const expected = [1, 2, 3]
      sandbox.stub(database, 'getAllPlayers').returns(expected)

      const players = await resolvers.Query.players()

      expect(players).to.eql(expected)
    })

    it('resolves all games', async () => {
      const expected = [1, 2, 3]
      sandbox.stub(database, 'getAllGames').returns(expected)

      const games = await resolvers.Query.games()

      expect(games).to.eql(expected)
    })

    it('resolves a single player', async () => {
      const expected = { id: 2, name: 'player' }
      sandbox.stub(database, 'getPlayer').returns(expected)

      const player = await resolvers.Query.player(null, { id: 2 })

      expect(player).to.eql(expected)
      expect(database.getPlayer).to.have.been.calledWith(2)
    })

    it('resolves a single game', async () => {
      const expected = { id: 2 }
      sandbox.stub(database, 'getGame').returns(expected)

      const game = await resolvers.Query.game(null, { id: 2 })

      expect(game).to.eql(expected)
      expect(database.getGame).to.have.been.calledWith(2)
    })
  })

  describe('.Mutation', () => {
    it('creates a single player', async () => {
      const expected = { id: 2, name: 'frank' }
      sandbox.stub(database, 'createPlayer').returns(expected)

      const player = await resolvers.Mutation.createPlayer(null, { name: 'frank' })

      expect(player).to.eql(expected)
      expect(database.createPlayer).to.have.been.calledWith('frank')
    })

    it('creates a single game', async () => {
      const expected = { id: 2, homePlayerId: 1, awayPlayerId: 2, homePlayerScore: 5, awayPlayerScore: 8 }
      sandbox.stub(database, 'createGame').returns(expected)

      const player = await resolvers.Mutation.createGame(null, { homePlayerId: 1, awayPlayerId: 2, homePlayerScore: 5, awayPlayerScore: 8 })

      expect(player).to.eql(expected)
      expect(database.createGame).to.have.been.calledWith(1, 2, 5, 8)
    })
  })
})
