import { MatchingGraph } from './MatchingGraph'
import { findAugmentingPath } from './findAugmentingPath'

describe('findAugmentingPath', () => {
  let graph: MatchingGraph

  describe('when no nodes are paired', () => {
    beforeEach(() => {
      // 1-2
      // | |
      // 4-3
      graph = new MatchingGraph()

      graph.addNode('1')
      graph.addNode('2')
      graph.addNode('3')
      graph.addNode('4')

      graph.addEdge('1', '2')
      graph.addEdge('2', '3')
      graph.addEdge('3', '4')
      graph.addEdge('4', '1')
    })

    it('returns the simplest augmenting path', () => {
      const found = findAugmentingPath(graph)

      expect(found).toEqual(['1', '2'])
    })
  })

  describe('when no augmenting path is available', () => {
    beforeEach(() => {
      // 1=2
      // | |
      // 4=3
      graph = new MatchingGraph()

      graph.addNode('1')
      graph.addNode('2')
      graph.addNode('3')
      graph.addNode('4')

      graph.addEdge('1', '2')
      graph.addEdge('2', '3')
      graph.addEdge('3', '4')
      graph.addEdge('4', '1')

      graph.pair('1', '2')
      graph.pair('3', '4')
    })

    it('returns undefined', () => {
      const found = findAugmentingPath(graph)

      expect(found).toBeUndefined()
    })
  })

  describe('when there are paired nodes but an augmenting path exists', () => {
    // a - 1 = 2 - 3 = 4 - b
    //     |       |
    //     x ===== y
    beforeEach(() => {
      graph = new MatchingGraph()

      graph.addNode('a')
      graph.addNode('b')
      graph.addNode('x')
      graph.addNode('y')
      graph.addNode('1')
      graph.addNode('2')
      graph.addNode('3')
      graph.addNode('4')

      graph.addEdge('a', '1')
      graph.addEdge('1', '2')
      graph.addEdge('2', '3')
      graph.addEdge('3', '4')
      graph.addEdge('4', 'b')
      graph.addEdge('x', 'y')
      graph.addEdge('x', '1')
      graph.addEdge('y', '3')

      graph.pair('1', '2')
      graph.pair('3', '4')
      graph.pair('x', 'y')
    })

    it('returns it', () => {
      const found = findAugmentingPath(graph)

      expect(found).toEqual(['a', '1', '2', '3', '4', 'b'])
    })
  })

  describe('when there is a blossom but an augmenting path exists', () => {
    //   x                                            y
    //   |                                            |
    //   0 = 1 - 2 = 3 - 4 = 5 - 6 = 7 - 8 = 9 - 10 = 11
    //                                           / \ /
    //                                          a   d
    //                                         ||   ||
    //                                          b - c
    beforeEach(() => {
      graph = new MatchingGraph()

      graph.addNode('0')
      graph.addNode('1')
      graph.addNode('2')
      graph.addNode('3')
      graph.addNode('4')
      graph.addNode('5')
      graph.addNode('6')
      graph.addNode('7')
      graph.addNode('8')
      graph.addNode('9')
      graph.addNode('10')
      graph.addNode('11')
      graph.addNode('a')
      graph.addNode('b')
      graph.addNode('c')
      graph.addNode('d')
      graph.addNode('x')
      graph.addNode('y')

      graph.addEdge('x', '0')
      graph.addEdge('0', '1')
      graph.addEdge('1', '2')
      graph.addEdge('2', '3')
      graph.addEdge('3', '4')
      graph.addEdge('4', '5')
      graph.addEdge('5', '6')
      graph.addEdge('6', '7')
      graph.addEdge('7', '8')
      graph.addEdge('8', '9')
      graph.addEdge('9', '10')
      graph.addEdge('10', '11')
      graph.addEdge('11', 'y')
      graph.addEdge('a', 'b')
      graph.addEdge('b', 'c')
      graph.addEdge('c', 'd')
      graph.addEdge('d', '10')
      graph.addEdge('10', 'a')
      graph.addEdge('11', 'd')

      graph.pair('0', '1')
      graph.pair('2', '3')
      graph.pair('4', '5')
      graph.pair('6', '7')
      graph.pair('8', '9')
      graph.pair('10', '11')
      graph.pair('a', 'b')
      graph.pair('c', 'd')
    })

    it('returns it', () => {
      const found = findAugmentingPath(graph)

      expect(found).toEqual([
        'x',
        '0',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        '11',
        'y',
      ])
    })
  })
})
