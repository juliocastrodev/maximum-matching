import { MatchingGraph } from '../matchings/algorithm/MatchingGraph'

declare global {
  namespace jest {
    interface Matchers<R> {
      toEqualMatchingGraph(expected: MatchingGraph): R
    }
  }
}

export {}
