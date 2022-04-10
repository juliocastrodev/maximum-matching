import Graph from 'graphology'
import { AugmentingPath } from '../AugmentingPath'
import { MatchingGraph } from './MatchingGraph'
import { findAugmentingPath } from './findAugmentingPath'

export function maximumMatchingGraph(graph: Graph) {
  const matchingGraph = MatchingGraph.createFrom(graph)

  let augmentingPath: AugmentingPath | undefined

  while ((augmentingPath = findAugmentingPath(matchingGraph)))
    matchingGraph.augmentWith(augmentingPath)

  return matchingGraph
}

export function maximumMatching(graph: Graph) {
  return maximumMatchingGraph(graph).matching()
}
