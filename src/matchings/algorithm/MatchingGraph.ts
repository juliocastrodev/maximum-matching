import Graph, { NotFoundGraphError, UndirectedGraph, UsageGraphError } from 'graphology'
import { AugmentingPath } from '../AugmentingPath'
import { Blossom } from '../blossoms/Blossom'
import { Matching } from '../Mathing'
import { Node } from '../../graphs/Node'

type MatchingNodeAttributes = {
  isSuperNode?: boolean
}

type MatchingEdgeAttributes = {
  arePaired?: boolean
}

export class MatchingGraph extends UndirectedGraph<MatchingNodeAttributes, MatchingEdgeAttributes> {
  static createFrom(graph: Graph) {
    const blossomGraph = new MatchingGraph()

    graph.forEachNode((node) => blossomGraph.addNode(node))
    graph.forEachEdge((edge) => blossomGraph.addEdge(...graph.extremities(edge)))

    return blossomGraph
  }

  static createCompressing(graph: MatchingGraph, blossom: Blossom) {
    const copy = MatchingGraph.createFrom(graph)

    graph.pairedEdges().forEach((e) => copy.pair(...graph.extremities(e)))
    copy.compress(blossom)

    return copy
  }

  pair(node1: Node, node2: Node) {
    this.ensureIsUnpaired(node1)
    this.ensureIsUnpaired(node2)

    const edge = this.edgeOrFail(node1, node2)

    this.setEdgeAttribute(edge, 'arePaired', true)
  }

  unpair(node1: Node, node2: Node) {
    this.ensureArePaired(node1, node2)

    const edge = this.edgeOrFail(node1, node2)

    this.setEdgeAttribute(edge, 'arePaired', false)
  }

  augmentWith(augmentingPath: AugmentingPath) {
    let hasToPair = true
    for (let i = 0; i + 1 < augmentingPath.length; i++) {
      const [currentNode, nextNode] = [augmentingPath[i], augmentingPath[i + 1]]

      if (hasToPair) this.pair(currentNode, nextNode)
      else this.unpair(currentNode, nextNode)

      hasToPair = !hasToPair
    }
  }

  matching(): Matching {
    return this.pairedEdges().map((edge) => this.extremities(edge))
  }

  pairedNodes(): Node[] {
    return this.matching().flat()
  }

  unpairedNodes(): Node[] {
    const pairedNodes = this.pairedNodes()

    return this.nodes().filter((node) => !pairedNodes.includes(node))
  }

  neighborsThroughUnpairedEdges(node: Node): Node[] {
    const nodeUnpairedEdges = this.filterEdges(node, (_, { arePaired }) => !arePaired)

    return nodeUnpairedEdges.map((edge) => this.opposite(node, edge))
  }

  getMate(node: Node) {
    const pairedEdge = this.findEdge(node, (_, { arePaired }) => arePaired)

    if (!pairedEdge) throw new UsageGraphError(`node ${node} is unpaired`)

    return this.opposite(node, pairedEdge)
  }

  isPaired(node: Node) {
    return this.pairedNodes().includes(node)
  }

  findNeighborOrFail(params: { for: Node; in: Node[] }) {
    const { for: node, in: candidates } = params

    const neighbor = candidates.find((candidate) => this.areNeighbors(candidate, node))

    if (!neighbor) throw new UsageGraphError(`no neighbor found in [${candidates}] for ${node}`)

    return neighbor
  }

  compress(blossom: Blossom) {
    const { root, cycle } = blossom

    const superNode = cycle.join('-')
    this.addNode(superNode, { isSuperNode: true })

    const rootMate = this.isPaired(root) ? this.getMate(root) : undefined
    this.findBlossomNeighbors(blossom).forEach((superNodeNeighbor) =>
      this.addEdge(superNode, superNodeNeighbor, {
        arePaired: superNodeNeighbor === rootMate,
      })
    )

    cycle.forEach((node) => this.dropNode(node))
  }

  isSuperNode(node: Node) {
    return Boolean(this.getNodeAttribute(node, 'isSuperNode'))
  }

  private findBlossomNeighbors(blossom: Blossom) {
    const { cycle } = blossom

    return cycle
      .flatMap((nodeInsideBlossom) => this.neighbors(nodeInsideBlossom))
      .filter((blossomNeighbor) => !blossom.has(blossomNeighbor))
      .filter((node, i, nodes) => nodes.indexOf(node) === i) // remove duplicates
  }

  private pairedEdges() {
    return this.filterEdges((_, { arePaired }) => arePaired)
  }

  private edgeOrFail(node1: Node, node2: Node) {
    const edge = this.edge(node1, node2)

    if (!edge) throw new NotFoundGraphError(`nodes ${node1}, ${node2} are not neighbors`)

    return edge
  }

  private ensureIsUnpaired(node: Node) {
    if (this.isPaired(node)) throw new UsageGraphError(`node ${node} is paired`)
  }

  private ensureArePaired(node1: Node, node2: Node) {
    const edge = this.edgeOrFail(node1, node2)

    if (!this.getEdgeAttribute(edge, 'arePaired'))
      throw new UsageGraphError(`nodes ${node1}, ${node2} are unpaired`)
  }
}
