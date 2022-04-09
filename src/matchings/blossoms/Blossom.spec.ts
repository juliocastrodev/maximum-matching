import { Blossom } from './Blossom'
import { BlossomPathDirection } from './BlossomPathDirection'

describe('Blossom', () => {
  describe('constructor', () => {
    describe('when the root is not in the cycle', () => {
      it('throws an error', () => {
        expect(() => new Blossom({ cycle: ['a', 'b', 'c'], root: 'x' })).toThrow(
          'x was not found in cycle'
        )
      })
    })

    describe('when the cycle is not odd', () => {
      it('throws an error', () => {
        expect(
          () => new Blossom({ cycle: ['yellow', 'blue', 'red', 'white'], root: 'blue' })
        ).toThrow('Blossom cycle is not odd')
      })
    })

    describe('when cycle and root are correct', () => {
      it('creates a blossom', () => {
        expect(
          () => new Blossom({ cycle: ['i', 'ii', 'iii', 'iv', 'v'], root: 'v' })
        ).not.toThrowError()
      })
    })
  })

  describe('has', () => {
    let blossom: Blossom

    beforeEach(() => {
      blossom = new Blossom({ cycle: ['win', 'lose', 'tie'], root: 'win' })
    })

    describe('when the node is in the blossom', () => {
      it('returns true', () => {
        expect(blossom.has('lose')).toEqual(true)
      })
    })

    describe('when the node is not in the blossom', () => {
      it('returns false', () => {
        expect(blossom.has('apple')).toEqual(false)
      })
    })
  })

  describe('path', () => {
    let blossom: Blossom

    beforeEach(() => {
      blossom = new Blossom({ cycle: ['1', '2', '3', '4', '5'], root: '2' })
    })

    describe('when one of the nodes are not in the Blossom', () => {
      it('throws an error', () => {
        expect(() => blossom.path('2', 'card')).toThrow('card was not found in the Blossom')
      })
    })

    describe("when we don't specify a path direction", () => {
      it('returns the clock wise path', () => {
        expect(blossom.path('2', '4')).toEqual(['2', '3', '4'])
      })
    })

    describe('when we specify the clock wise direction', () => {
      it('returns the clock wise path', () => {
        expect(blossom.path('4', '2', { direction: BlossomPathDirection.CLOCK_WISE })).toEqual([
          '4',
          '5',
          '1',
          '2',
        ])
      })
    })

    describe('when we specify the counter clock wise direction', () => {
      it('returns the counter clock wise path', () => {
        expect(
          blossom.path('3', '1', { direction: BlossomPathDirection.COUNTER_CLOCK_WISE })
        ).toEqual(['3', '2', '1'])
      })
    })
  })

  describe('evenPath', () => {
    let blossom: Blossom

    beforeEach(() => {
      blossom = new Blossom({ cycle: ['a', 'b', 'c', 'd', 'e'], root: 'c' })
    })

    describe('when one of the nodes are not in the Blossom', () => {
      it('throws an error', () => {
        expect(() => blossom.evenPath('_', 'b')).toThrow('_ was not found in the Blossom')
      })
    })

    describe('when the even path is the clock wise one', () => {
      it('returns it', () => {
        expect(blossom.evenPath('a', 'e')).toEqual(['a', 'b', 'c', 'd', 'e'])
      })
    })

    describe('when the even path is the counter clock wise one', () => {
      it('returns it', () => {
        expect(blossom.evenPath('b', 'c')).toEqual(['b', 'a', 'e', 'd', 'c'])
      })
    })
  })
})
