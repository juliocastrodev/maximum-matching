import { Tree } from './Tree'
import { Node } from './Node'

export class Forest {
  constructor(private readonly trees: Tree[]) {}

  static fromRoots(roots: Node[]) {
    const trees = roots.map(Tree.withRoot)

    return new Forest(trees)
  }

  findTreeOf(node: Node) {
    return this.trees.find((tree) => tree.has(node))
  }

  findTreeOrFail(node: Node) {
    const found = this.findTreeOf(node)

    if (!found) throw new Error(`Node ${node} was not found in the forest`)

    return found
  }

  findSubtreeOrFail(node: Node) {
    return this.findTreeOrFail(node).findSubtreeOrFail(node)
  }

  has(node: Node) {
    return Boolean(this.findTreeOf(node))
  }

  pathToItsRootTree(node: Node) {
    return this.findTreeOrFail(node).pathToRoot(node)
  }

  distanceToItsRootTree(node: Node) {
    return this.findTreeOrFail(node).distanceToRoot(node)
  }

  areInTheSameTree(node1: Node, node2: Node) {
    return this.findTreeOrFail(node1) === this.findTreeOrFail(node2)
  }
}
