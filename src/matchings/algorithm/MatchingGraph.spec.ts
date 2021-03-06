import Graph, { NotFoundGraphError } from 'graphology'
import { Blossom } from '../blossoms/Blossom'
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
    beforeEach(() => {
      //  a ---- b
      //  ||    ||            a ---- b
      //   1 --- c    --->   ||      ||
      //  / \                 * ---- c
      //  2  5
      // ||  ||
      // 3 -- 4

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
      graph.addEdge('1', 'a')
      graph.addEdge('a', 'b')
      graph.addEdge('b', 'c')
      graph.addEdge('c', '1')

      graph.pair('2', '3')
      graph.pair('5', '4')
      graph.pair('a', '1')
      graph.pair('b', 'c')
    })

    describe('when passing a blossom with nodes that are not in the graph', () => {
      it('throws an error', () => {
        expect(() =>
          MatchingGraph.createCompressing(
            graph,
            new Blossom({ root: 'Julio', cycle: ['Julio', 'Agosto', 'Septiembre'] })
          )
        ).toThrowError(NotFoundGraphError)
      })
    })

    describe('when passing a compatible blossom', () => {
      it('compress it', () => {
        const blossom = new Blossom({ root: '1', cycle: ['1', '2', '3', '4', '5'] })
        const expectedGraph = new MatchingGraph()
        expectedGraph.addNode('1-2-3-4-5')
        expectedGraph.addNode('a')
        expectedGraph.addNode('b')
        expectedGraph.addNode('c')
        expectedGraph.addEdge('1-2-3-4-5', 'a')
        expectedGraph.addEdge('a', 'b')
        expectedGraph.addEdge('b', 'c')
        expectedGraph.addEdge('c', '1-2-3-4-5')
        expectedGraph.pair('a', '1-2-3-4-5')
        expectedGraph.pair('b', 'c')

        const result = MatchingGraph.createCompressing(graph, blossom)

        expect(result).toEqual(expectedGraph)
      })
    })
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

    describe('when nodes are not neighbors', () => {
      it('throws an error', () => {
        expect(() => graph.unpair('a', 'y')).toThrowError('nodes a, y are not neighbors')
      })
    })
  })

  describe('augmentWith', () => {
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

    describe("when the augmenting path doesn't include nodes of the graph", () => {
      it('throws an error', () => {
        expect(() => graph.augmentWith(['one', 'two'])).toThrow(NotFoundGraphError)
      })
    })

    describe('when the augmenting path includes nodes of the graph', () => {
      it('alternates pairing/unparing of those nodes', () => {
        const expectedGraph = MatchingGraph.createFrom(graph)
        expectedGraph.pair('a', '1')
        expectedGraph.pair('2', '3')
        expectedGraph.pair('4', 'b')
        expectedGraph.pair('x', 'y')

        graph.augmentWith(['a', '1', '2', '3', '4', 'b'])

        expect(graph).toEqualMatchingGraph(expectedGraph)
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

  describe('isPaired', () => {
    beforeEach(() => {
      // 1 - 2
      // | //
      // 3
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
    beforeEach(() => {
      // 1 - 2 - 3 - 4 = 5
      //     |       |
      //     a       b
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
    beforeEach(() => {
      // a = b
      // | /
      // c
      graph = new MatchingGraph()

      graph.addNode('a')
      graph.addNode('b')
      graph.addNode('c')

      graph.addEdge('a', 'b')
      graph.addEdge('a', 'c')
      graph.addEdge('b', 'c')

      graph.pair('a', 'b')
    })

    describe('when the node is unpaired', () => {
      it('returns undefined', () => {
        expect(graph.getMate('c')).toBeUndefined()
      })
    })

    describe('when the node is paired', () => {
      it('returns its mate', () => {
        expect(graph.getMate('a')).toEqual('b')
        expect(graph.getMate('b')).toEqual('a')
      })
    })
  })

  describe('getMateOrFail', () => {
    beforeEach(() => {
      // 1 - 2 - 3
      // |       |
      // a ===== b
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
        expect(() => graph.getMateOrFail('1')).toThrow('mate for 1 was not found')
      })
    })

    describe('when the node is paired', () => {
      it('returns its mate', () => {
        expect(graph.getMateOrFail('a')).toEqual('b')
        expect(graph.getMateOrFail('b')).toEqual('a')
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
    beforeEach(() => {
      // x - 1 = 2 - y     --->    x - * - y
      //     \  /
      //      3

      graph = new MatchingGraph()

      graph.addNode('1')
      graph.addNode('2')
      graph.addNode('3')
      graph.addNode('x')
      graph.addNode('y')

      graph.addEdge('1', '2')
      graph.addEdge('2', '3')
      graph.addEdge('3', '1')
      graph.addEdge('1', 'x')
      graph.addEdge('2', 'y')

      graph.pair('1', '2')
    })

    describe('when passing a blossom with nodes that are not in the graph', () => {
      it('throws an error', () => {
        expect(() =>
          graph.compress(new Blossom({ root: 'x0', cycle: ['x0', 'x1', 'x2', 'x3', 'x4'] }))
        ).toThrowError(NotFoundGraphError)
      })
    })

    describe('when passing a compatible blossom', () => {
      it('compress it', () => {
        const blossom = new Blossom({ root: '3', cycle: ['1', '2', '3'] })
        const expectedGraph = new MatchingGraph()
        expectedGraph.addNode('1-2-3')
        expectedGraph.addNode('x')
        expectedGraph.addNode('y')
        expectedGraph.addEdge('x', '1-2-3')
        expectedGraph.addEdge('1-2-3', 'y')

        const result = MatchingGraph.createCompressing(graph, blossom)

        expect(result).toEqualMatchingGraph(expectedGraph)
      })
    })
  })

  describe('isSuperNode', () => {
    beforeEach(() => {
      //  1 = 2 - x     --->    * - x
      //   \  /
      //    3

      graph = new MatchingGraph()

      graph.addNode('1')
      graph.addNode('2')
      graph.addNode('3')
      graph.addNode('x')

      graph.addEdge('x', '2')
      graph.addEdge('2', '3')
      graph.addEdge('3', '1')
      graph.addEdge('1', '2')

      graph.pair('1', '2')

      graph.compress(new Blossom({ root: '3', cycle: ['3', '2', '1'] }))
    })

    describe('when node is a super node', () => {
      it('returns true', () => {
        expect(graph.isSuperNode('3-2-1')).toEqual(true)
      })
    })

    describe('when node is not a super node', () => {
      it('returns false', () => {
        expect(graph.isSuperNode('x')).toEqual(false)
      })
    })

    describe('when node is not in the graph', () => {
      it('throws an error', () => {
        expect(() => graph.isSuperNode('_')).toThrowError(NotFoundGraphError)
      })
    })
  })
})
