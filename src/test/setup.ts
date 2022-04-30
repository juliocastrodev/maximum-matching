import { MatchingGraph } from '../matchings/algorithm/MatchingGraph'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const msg = (base: string, params: { expected: any; received: any }) => {
  const { expected, received } = params

  return () => `${base}\nExpected: ${expected}\nReceived: ${received}`
}

const matchers: jest.ExpectExtendMap = {
  //

  toEqualMatchingGraph: function (
    this: jest.MatcherContext,
    received: MatchingGraph,
    expected: MatchingGraph
  ) {
    const areNodesEqual = this.equals(received.nodes().sort(), expected.nodes().sort())
    if (!areNodesEqual)
      return {
        pass: false,
        message: msg('Nodes are not equal', {
          expected: expected.nodes(),
          received: received.nodes(),
        }),
      }

    for (const node of received.nodes()) {
      const areNeigborsEqual = this.equals(
        received.neighbors(node).sort(),
        expected.neighbors(node).sort()
      )
      if (!areNeigborsEqual)
        return {
          pass: false,
          message: msg(`Neighbors of ${node} are not equal`, {
            expected: expected.neighbors(node).sort(),
            received: received.neighbors(node).sort(),
          }),
        }

      const areMatesEqual = this.equals(received.getMate(node), expected.getMate(node))
      if (!areMatesEqual)
        return {
          pass: false,
          message: msg(`Mate of ${node} is not equal`, {
            expected: expected.getMate(node),
            received: received.getMate(node),
          }),
        }
    }

    return { pass: true, message: () => 'Matching graphs are equal' }
  },

  //
}

expect.extend(matchers)
