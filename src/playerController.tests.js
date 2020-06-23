const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
chai.use(sinonChai)
const expect = chai.expect
const { Game } = require('./models/game')
const { database } = require('./database')
const { playerController: { updatePlayerWinsLosses, getPlayerRankings } } = require('./playerController')

const HOME_PLAYER_ID = 1
const AWAY_PLAYER_ID = 2
const defaultGame = new Game(101, HOME_PLAYER_ID, AWAY_PLAYER_ID, 5, 5)

function createTestGame (opts = {}) {
  return Object.assign(new Game(), defaultGame, opts)
}

describe('playerController', () => {
  describe('.updatePlayerWinsLosses', () => {
    let sandbox

    beforeEach(() => {
      sandbox = sinon.createSandbox()
      sandbox.stub(database, 'getPlayer').callsFake((id) => {
        return { id, wins: 1, losses: 1 }
      })

      sandbox.stub(database, 'putPlayer')
    })

    afterEach(() => {
      sandbox.restore()
    })

    it('gives away player a half a win and loss if there is a tie', async () => {
      const game = createTestGame()

      await updatePlayerWinsLosses(game)

      expect(database.putPlayer).to.have.been.calledWithMatch(sinon.match({
        id: AWAY_PLAYER_ID,
        wins: 1.5,
        losses: 1.5
      }))
    })

    it('gives home player a half a win and loss if there is a tie', async () => {
      const game = createTestGame()

      await updatePlayerWinsLosses(game)

      expect(database.putPlayer).to.have.been.calledWithMatch(sinon.match({
        id: HOME_PLAYER_ID,
        wins: 1.5,
        losses: 1.5
      }))
    })

    it('gives home player a win if home player won', async () => {
      const game = createTestGame({ homePlayerScore: 10 })

      await updatePlayerWinsLosses(game)

      expect(database.putPlayer).to.have.been.calledWithMatch(sinon.match({
        id: HOME_PLAYER_ID,
        wins: 2,
        losses: 1
      }))
    })

    it('gives away player a loss if home player won', async () => {
      const game = createTestGame({ homePlayerScore: 10 })

      await updatePlayerWinsLosses(game)

      expect(database.putPlayer).to.have.been.calledWithMatch(sinon.match({
        id: AWAY_PLAYER_ID,
        wins: 1,
        losses: 2
      }))
    })

    it('gives away player a win if away player won', async () => {
      const game = createTestGame({ awayPlayerScore: 10 })

      await updatePlayerWinsLosses(game)

      expect(database.putPlayer).to.have.been.calledWithMatch(sinon.match({
        id: AWAY_PLAYER_ID,
        wins: 2,
        losses: 1
      }))
    })

    it('gives home player a loss if away player won', async () => {
      const game = createTestGame({ awayPlayerScore: 10 })

      await updatePlayerWinsLosses(game)

      expect(database.putPlayer).to.have.been.calledWithMatch(sinon.match({
        id: HOME_PLAYER_ID,
        wins: 1,
        losses: 2
      }))
    })
  })

  describe('.getPlayerRankings', () => {
    let sandbox

    function stubPlayers (players = []) {
      database.getAllPlayers.returns(Promise.resolve(players))
    }

    beforeEach(() => {
      sandbox = sinon.createSandbox()
      sandbox.stub(database, 'getAllPlayers')
    })

    afterEach(() => {
      sandbox.restore()
    })

    it('returns a single player with rank 1', async () => {
      stubPlayers([{ id: 1, wins: 0, losses: 0, name: 'frank' }])

      const rankings = await getPlayerRankings()

      expect(rankings).to.eql([{
        rank: 1,
        player: {
          id: 1,
          wins: 0,
          losses: 0,
          name: 'frank'
        }
      }])
    })

    it('returns a multiple players sorted on wins', async () => {
      stubPlayers([
        { id: 1, wins: 0, losses: 0, name: 'frank' },
        { id: 2, wins: 1, losses: 1, name: 'jeff' }
      ])

      const rankings = await getPlayerRankings()

      expect(rankings).to.eql([
        {
          rank: 1,
          player: {
            id: 2,
            wins: 1,
            losses: 1,
            name: 'jeff'
          }
        },
        {
          rank: 2,
          player: {
            id: 1,
            wins: 0,
            losses: 0,
            name: 'frank'
          }
        }])
    })

    it('sorts secondarily on losses', async () => {
      stubPlayers([
        { id: 3, wins: 1, losses: 2, name: 'larry' },
        { id: 1, wins: 0, losses: 0, name: 'frank' },
        { id: 2, wins: 1, losses: 1, name: 'jeff' }
      ])

      const rankings = await getPlayerRankings()

      expect(rankings).to.eql([
        {
          rank: 1,
          player: {
            id: 2,
            wins: 1,
            losses: 1,
            name: 'jeff'
          }
        },
        {
          rank: 2,
          player: {
            id: 3,
            wins: 1,
            losses: 2,
            name: 'larry'
          }
        },
        {
          rank: 3,
          player: {
            id: 1,
            wins: 0,
            losses: 0,
            name: 'frank'
          }
        }])
    })

    it('repeats rank number if there are ties', async () => {
      stubPlayers([
        { id: 3, wins: 1, losses: 2, name: 'larry' },
        { id: 1, wins: 0, losses: 0, name: 'frank' },
        { id: 2, wins: 1, losses: 1, name: 'jeff' },
        { id: 4, wins: 1, losses: 1, name: 'geoff' }
      ])

      const rankings = await getPlayerRankings()

      expect(rankings).to.eql([
        {
          rank: 1,
          player: {
            id: 2,
            wins: 1,
            losses: 1,
            name: 'jeff'
          }
        },
        {
          rank: 1,
          player: {
            id: 4,
            wins: 1,
            losses: 1,
            name: 'geoff'
          }
        },
        {
          rank: 3,
          player: {
            id: 3,
            wins: 1,
            losses: 2,
            name: 'larry'
          }
        },
        {
          rank: 4,
          player: {
            id: 1,
            wins: 0,
            losses: 0,
            name: 'frank'
          }
        }])
    })
  })
})
