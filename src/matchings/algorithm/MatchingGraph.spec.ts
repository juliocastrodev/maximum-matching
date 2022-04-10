import Graph from 'graphology'
import { MatchingGraph } from './MatchingGraph'

describe('MatchingGraph', () => {
  let graph: MatchingGraph

  describe('createFrom', () => {
    let inputGraph: Graph

    beforeEach(() => {
      // a - b - c
      inputGraph = new Graph()

      inputGraph.addNode('a')
      inputGraph.addNode('b')
      inputGraph.addNode('c')

      inputGraph.addEdge('a', 'b')
      inputGraph.addEdge('b', 'c')
    })

    it('creates a MatchingGraph from the incoming graph', () => {
      graph = MatchingGraph.createFrom(inputGraph)

      expect(graph).toBeInstanceOf(MatchingGraph)
      expect(graph.nodes()).toEqual(inputGraph.nodes())
      expect(graph.edges().map((e) => graph.extremities(e))).toEqual(
        inputGraph.edges().map((e) => inputGraph.extremities(e))
      )
    })

    it('creates a MatchingGraph that is an independent copy of the incoming graph', () => {
      graph = MatchingGraph.createFrom(inputGraph)

      graph.addNode('new1')
      graph.addNode('new2')
      graph.addEdge('new1', 'new2')

      expect(inputGraph.hasNode('new1')).toEqual(false)
      expect(inputGraph.hasNode('new2')).toEqual(false)
      expect(inputGraph.hasEdge('new1', 'new2')).toEqual(false)
    })
  })

  describe('createCompressing', () => {
    // TODO
  })

  describe('pair', () => {
    beforeEach(() => {
      // 1-2
      // |
      // 3

      graph = new MatchingGraph()

      graph.addNode('1')
      graph.addNode('2')
      graph.addNode('3')

      graph.addEdge('1', '2')
      graph.addEdge('1', '3')
    })

    describe('when nodes are unpaired and neighbors', () => {
      it('pairs the nodes', () => {
        graph.pair('1', '2')
        const pairedEdge = graph.edge('1', '2')

        expect(graph.getEdgeAttributes(pairedEdge)).toEqual({ arePaired: true })
      })
    })

    describe('when one of the nodes is not in the graph', () => {
      it('throws an error', () => {
        expect(() => graph.pair('1', 'x')).toThrowError(
          'could not find the "x" target node in the graph.'
        )
      })
    })

    describe('when one of the nodes is paired', () => {
      it('throws an error', () => {
        graph.pair('1', '3')

        expect(() => graph.pair('1', '2')).toThrowError('node 1 is paired')
      })
    })

    describe('when nodes are not neighbors', () => {
      it('throws an error', () => {
        expect(() => graph.pair('3', '2')).toThrowError('nodes 3, 2 are not neighbors')
      })
    })
  })

  describe('unpair', () => {
    beforeEach(() => {
      // x-y
      // | |
      // a=b

      graph = new MatchingGraph()

      graph.addNode('x')
      graph.addNode('y')
      graph.addNode('a')
      graph.addNode('b')

      graph.addEdge('x', 'y')
      graph.addEdge('a', 'b')
      graph.addEdge('x', 'a')
      graph.addEdge('y', 'b')

      graph.pair('a', 'b')
    })

    describe('when nodes are paired', () => {
      it('unpairs the nodes', () => {
        graph.unpair('a', 'b')
        const unpairedEdge = graph.edge('a', 'b')

        expect(graph.getEdgeAttributes(unpairedEdge)).toEqual({ arePaired: false })
      })
    })

    describe('when one of the nodes is not in the graph', () => {
      it('throws an error', () => {
        expect(() => graph.unpair('1', 'x')).toThrowError(
          'could not find the "1" source node in the graph.'
        )
      })
    })

    describe('when nodes are unpaired', () => {
      it('throws an error', () => {
        expect(() => graph.unpair('x', 'y')).toThrowError('nodes x, y are unpaired')
      })
    })

    describe('when nodes are not neighbors', () => {
      it('throws an error', () => {
        expect(() => graph.unpair('a', 'y')).toThrowError('nodes a, y are not neighbors')
      })
    })
  })

  describe('augmentWith', () => {
    // TODO
  })

  describe('pairedNodes', () => {
    describe('when there are only unpaired nodes', () => {
      // 1 - 2
      // |   |
      // 3 - 4
      beforeEach(() => {
        graph = new MatchingGraph()

        graph.addNode('1')
        graph.addNode('2')
        graph.addNode('3')
        graph.addNode('4')

        graph.addEdge('1', '2')
        graph.addEdge('1', '3')
        graph.addEdge('2', '4')
        graph.addEdge('3', '4')
      })

      it('returns an empty array', () => {
        expect(graph.pairedNodes()).toEqual([])
      })
    })

    describe('when there paired nodes', () => {
      // 1 = 2
      // | x |
      // 3 = 4 - 5
      beforeEach(() => {
        graph = new MatchingGraph()

        graph.addNode('1')
        graph.addNode('2')
        graph.addNode('3')
        graph.addNode('4')
        graph.addNode('5')

        graph.addEdge('1', '2')
        graph.addEdge('1', '3')
        graph.addEdge('1', '4')
        graph.addEdge('2', '3')
        graph.addEdge('2', '4')
        graph.addEdge('3', '4')
        graph.addEdge('4', '5')

        graph.pair('1', '2')
        graph.pair('3', '4')
      })

      it('returns an array of the paired nodes', () => {
        expect(graph.pairedNodes().sort()).toEqual(['1', '2', '3', '4'].sort())
      })
    })
  })

  describe('matching', () => {
    describe('when there are only unpaired nodes', () => {
      // a - b - c
      // |
      // d
      beforeEach(() => {
        graph = new MatchingGraph()

        graph.addNode('a')
        graph.addNode('b')
        graph.addNode('c')
        graph.addNode('d')

        graph.addEdge('a', 'b')
        graph.addEdge('b', 'c')
        graph.addEdge('a', 'd')
      })

      it('returns an empty matching', () => {
        expect(graph.matching()).toEqual([])
      })
    })

    describe('when there paired nodes', () => {
      // a - b = c
      // ||
      // d
      beforeEach(() => {
        graph = new MatchingGraph()

        graph.addNode('a')
        graph.addNode('b')
        graph.addNode('c')
        graph.addNode('d')

        graph.addEdge('a', 'b')
        graph.addEdge('b', 'c')
        graph.addEdge('a', 'd')

        graph.pair('b', 'c')
        graph.pair('a', 'd')
      })

      it('returns the matching', () => {
        expect(graph.matching().sort()).toEqual(
          [
            ['b', 'c'],
            ['a', 'd'],
          ].sort()
        )
      })
    })
  })

  describe('unpairedNodes', () => {
    describe('when there are only paired nodes', () => {
      // 1 - 2
      // || ||
      // 3 - 4
      beforeEach(() => {
        graph = new MatchingGraph()

        graph.addNode('1')
        graph.addNode('2')
        graph.addNode('3')
        graph.addNode('4')

        graph.addEdge('1', '2')
        graph.addEdge('1', '3')
        graph.addEdge('2', '4')
        graph.addEdge('3', '4')

        graph.pair('1', '3')
        graph.pair('2', '4')
      })

      it('returns an empty array', () => {
        expect(graph.unpairedNodes()).toEqual([])
      })
    })

    describe('when there unpaired nodes', () => {
      // 1 = 2 - 6
      // |   |
      // 3 = 4 - 5
      beforeEach(() => {
        graph = new MatchingGraph()

        graph.addNode('1')
        graph.addNode('2')
        graph.addNode('3')
        graph.addNode('4')
        graph.addNode('5')
        graph.addNode('6')

        graph.addEdge('1', '2')
        graph.addEdge('1', '3')
        graph.addEdge('2', '4')
        graph.addEdge('3', '4')
        graph.addEdge('2', '6')
        graph.addEdge('4', '5')

        graph.pair('1', '2')
        graph.pair('3', '4')
      })

      it('returns an array of the unpaired nodes', () => {
        expect(graph.unpairedNodes().sort()).toEqual(['5', '6'].sort())
      })
    })
  })

  describe('neighborsThroughUnpairedEdges', () => {
    // 1 - 2 - 3 - 4 = 5
    //     |       |
    //     a       b
    beforeEach(() => {
      graph = new MatchingGraph()

      graph.addNode('1')
      graph.addNode('2')
      graph.addNode('3')
      graph.addNode('4')
      graph.addNode('5')
      graph.addNode('a')
      graph.addNode('b')

      graph.addEdge('1', '2')
      graph.addEdge('2', '3')
      graph.addEdge('3', '4')
      graph.addEdge('4', '5')
      graph.addEdge('2', 'a')
      graph.addEdge('4', 'b')

      graph.pair('4', '5')
    })

    describe('when the node is unpaired', () => {
      it('returns all neighbors', () => {
        expect(graph.neighborsThroughUnpairedEdges('2').sort()).toEqual(['1', '3', 'a'].sort())
      })
    })

    describe('when the node is paired', () => {
      it('returns all neighbors except its mate', () => {
        expect(graph.neighborsThroughUnpairedEdges('4').sort()).toEqual(['3', 'b'].sort())
      })
    })
  })

  describe('getMate', () => {
    // 1 - 2 - 3
    // |       |
    // a ===== b
    beforeEach(() => {
      graph = new MatchingGraph()

      graph.addNode('1')
      graph.addNode('2')
      graph.addNode('3')
      graph.addNode('a')
      graph.addNode('b')

      graph.addEdge('1', '2')
      graph.addEdge('2', '3')
      graph.addEdge('1', 'a')
      graph.addEdge('3', 'b')
      graph.addEdge('a', 'b')

      graph.pair('a', 'b')
    })

    describe('when the node is unpaired', () => {
      it('throws an error', () => {
        expect(() => graph.getMate('1')).toThrow('node 1 is unpaired')
      })
    })

    describe('when the node is paired', () => {
      it('returns its mate', () => {
        expect(graph.getMate('a')).toEqual('b')
        expect(graph.getMate('b')).toEqual('a')
      })
    })
  })

  describe('isPaired', () => {
    // 1 - 2
    // | //
    // 3
    beforeEach(() => {
      graph = new MatchingGraph()

      graph.addNode('1')
      graph.addNode('2')
      graph.addNode('3')

      graph.addEdge('1', '2')
      graph.addEdge('2', '3')
      graph.addEdge('3', '1')

      graph.pair('2', '3')
    })

    describe('when the node is unpaired', () => {
      it('returns false', () => {
        expect(graph.isPaired('1')).toEqual(false)
      })
    })

    describe('when the node is paired', () => {
      it('returns true', () => {
        expect(graph.isPaired('2')).toEqual(true)
        expect(graph.isPaired('3')).toEqual(true)
      })
    })
  })

  describe('findNeighborOrFail', () => {
    beforeEach(() => {
      //     a
      //     |
      //     1
      //    / \
      //   5   2 - b
      //   |   |
      //   4 - 3
      //    \  |
      //      c
      graph = new MatchingGraph()

      graph.addNode('1')
      graph.addNode('2')
      graph.addNode('3')
      graph.addNode('4')
      graph.addNode('5')
      graph.addNode('a')
      graph.addNode('b')
      graph.addNode('c')

      graph.addEdge('1', '2')
      graph.addEdge('2', '3')
      graph.addEdge('3', '4')
      graph.addEdge('4', '5')
      graph.addEdge('5', '1')
      graph.addEdge('a', '1')
      graph.addEdge('b', '2')
      graph.addEdge('c', '3')
      graph.addEdge('c', '4')
    })

    describe('when the target node is not in the graph', () => {
      it('throws an error', () => {
        expect(() => graph.findNeighborOrFail({ for: 'x', in: ['1', '2'] })).toThrow(
          'no neighbor found in [1,2] for x'
        )
      })
    })

    describe('when the candidates array is empty', () => {
      it('throws an error', () => {
        expect(() => graph.findNeighborOrFail({ for: 'a', in: [] })).toThrow(
          'no neighbor found in [] for a'
        )
      })
    })

    describe('when no neighbor is found', () => {
      it('throws an error', () => {
        expect(() => graph.findNeighborOrFail({ for: 'a', in: ['2', '3', '4'] })).toThrow(
          'no neighbor found in [2,3,4] for a'
        )
      })
    })

    describe('when a neighbor is found in the candidates array', () => {
      it('returns it', () => {
        const neighbor = graph.findNeighborOrFail({
          for: 'c',
          in: ['1', '2', '3', '4', '5'],
        })

        expect(['4', '3']).toContain(neighbor)
      })
    })
  })

  describe('compress', () => {
    // TODO
  })

  describe('isSuperNode', () => {
    // TODO
  })
})
