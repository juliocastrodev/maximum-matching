import { Forest } from '../../graphs/Forest'
import { AugmentingPath } from '../AugmentingPath'
import { MatchingGraph } from './MatchingGraph'
import { Node } from '../../graphs/Node'
import { Blossom } from '../blossoms/Blossom'

export function findAugmentingPath(graph: MatchingGraph): AugmentingPath | undefined {
  return new AugmentingPathFinder(graph).find()
}

class AugmentingPathFinder {
  private readonly forest: Forest

  private readonly toCheck: Node[]

  constructor(private readonly graph: MatchingGraph) {
    this.toCheck = graph.unpairedNodes()
    this.forest = Forest.fromRoots(this.toCheck)
  }

  find() {
    let currentNode: Node | undefined

    while ((currentNode = this.pickNextNodeToCheck())) {
      for (const neighbor of this.graph.neighborsThroughUnpairedEdges(currentNode)) {
        const { augmentingPath, blossom } = this.tryToConnectWithAugmentingPath(
          currentNode,
          neighbor
        )

        if (augmentingPath) return augmentingPath
        if (blossom) return this.findHavingBlossom(blossom)
      }
    }

    return undefined
  }

  private pickNextNodeToCheck() {
    return this.toCheck.shift()
  }

  private tryToConnectWithAugmentingPath(currentNode: Node, neighbor: Node) {
    if (!this.forest.has(neighbor)) {
      this.visitNodeOutsideForest(currentNode, neighbor)

      return {}
    }

    if (!this.areConnectableWithAugmentingPath(currentNode, neighbor)) return {}

    if (this.forest.areInTheSameTree(currentNode, neighbor))
      return { blossom: this.buildBlossom(currentNode, neighbor) }

    return { augmentingPath: this.connectWithAugmentingPath(currentNode, neighbor) }
  }

  private visitNodeOutsideForest(currentNode: Node, outsider: Node) {
    const outsiderMate = this.graph.getMate(outsider)

    this.forest.findSubtreeOrFail(currentNode).addChild(outsider).addChild(outsiderMate)

    this.checkLater(outsiderMate)
  }

  private checkLater(node: Node) {
    this.toCheck.push(node)
  }

  private areConnectableWithAugmentingPath(_currentNode: Node, neighbor: Node) {
    return this.forest.distanceToItsRootTree(neighbor) % 2 === 0
  }

  private buildBlossom(currentNode: Node, neighbor: Node) {
    const currentNodeRootPath = this.forest.pathToItsRootTree(currentNode)
    const neighborRootPath = this.forest.pathToItsRootTree(neighbor)

    const intersectionRootPath = currentNodeRootPath.filter((node) =>
      neighborRootPath.includes(node)
    )
    const [blossomRoot] = intersectionRootPath

    const cycle = [
      ...currentNodeRootPath.slice(0, currentNodeRootPath.indexOf(blossomRoot)),
      blossomRoot,
      ...neighborRootPath.slice(0, neighborRootPath.indexOf(blossomRoot)).reverse(),
    ]

    return new Blossom({ cycle, root: blossomRoot })
  }

  private connectWithAugmentingPath(currentNode: Node, neighbor: Node): AugmentingPath {
    return [
      ...this.forest.pathToItsRootTree(currentNode).reverse(),
      ...this.forest.pathToItsRootTree(neighbor),
    ]
  }

  private findHavingBlossom(blossom: Blossom): AugmentingPath | undefined {
    const graphWithoutBlossom = MatchingGraph.createCompressing(this.graph, blossom)

    const augmentingPath = findAugmentingPath(graphWithoutBlossom)

    if (!augmentingPath) return undefined

    const superNodeIndex = augmentingPath.findIndex((node) => graphWithoutBlossom.isSuperNode(node))

    if (superNodeIndex < 0) return augmentingPath

    return [
      ...augmentingPath.slice(0, superNodeIndex),
      ...this.expandBlossom({
        blossom,
        previousNode: augmentingPath[superNodeIndex - 1],
        nextNode: augmentingPath[superNodeIndex + 1],
      }),
      ...augmentingPath.slice(superNodeIndex + 1),
    ]
  }

  private expandBlossom(params: { blossom: Blossom; previousNode?: Node; nextNode?: Node }) {
    const { blossom, previousNode, nextNode } = params
    const { root, cycle } = blossom

    const rootMate = this.graph.isPaired(root) ? this.graph.getMate(root) : undefined

    const connectionFor = (node?: Node) =>
      !node || node === rootMate ? root : this.graph.findNeighborOrFail({ for: node, in: cycle })

    return blossom.evenPath(connectionFor(previousNode), connectionFor(nextNode))
  }
}
