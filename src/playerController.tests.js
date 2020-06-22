const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
chai.use(sinonChai)
const expect = chai.expect
const { Game } = require('./models/game')
const { database } = require('./database')
const { updatePlayerWinsLosses } = require('./playerController')

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
})
