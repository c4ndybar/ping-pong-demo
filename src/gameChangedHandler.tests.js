const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
chai.use(sinonChai)
const expect = chai.expect
const { Game } = require('./models/game')
const { handler } = require('./gameChangedHandler')
const { playerController } = require('./playerController')

const defaultGame = new Game('1', '2', '3', '4', '5')
const defaultRawGameData = {
  dynamodb: {
    NewImage: {
      id: {
        S: defaultGame.id.toString()
      },
      awayPlayerId: {
        S: defaultGame.awayPlayerId.toString()
      },
      homePlayerId: {
        S: defaultGame.homePlayerId.toString()
      },
      awayPlayerScore: {
        N: defaultGame.awayPlayerScore.toString()
      },
      homePlayerScore: {
        N: defaultGame.homePlayerScore.toString()
      }
    }

  }
}

function createEvent (games = [defaultRawGameData]) {
  return {
    Records: games
  }
}

describe('gameChangedHandler', () => {
  describe('.handler', () => {
    let callback

    beforeEach(() => {
      callback = sinon.stub()
      sinon.stub(playerController, 'updatePlayerWinsLosses').returns(Promise.resolve())
    })

    afterEach(() => {
      playerController.updatePlayerWinsLosses.restore()
    })

    it('parses payload and updates players for game', async () => {
      await handler(createEvent(), null, callback)

      expect(playerController.updatePlayerWinsLosses).to.have.been.calledOnce
      expect(playerController.updatePlayerWinsLosses).to.have.been.calledWithMatch(defaultGame)
    })

    it('parses payload and updates player wins for multiple games', async () => {
      await handler(createEvent([defaultRawGameData, defaultRawGameData]), null, callback)

      expect(playerController.updatePlayerWinsLosses).to.have.been.calledTwice
    })

    it('calls the callback when complete', async () => {
      await handler(createEvent(), null, callback)

      expect(callback).to.have.been.calledOnce
    })
  })
})
