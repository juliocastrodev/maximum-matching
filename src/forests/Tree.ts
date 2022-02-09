import { Node } from '../Node'

type TreeConstructor = {
  parent?: Tree
  elem: Node
  children: Tree[]
}

export class Tree {
  private readonly parent?: Tree

  private readonly elem: Node

  private readonly children: Tree[]

  constructor(p: TreeConstructor) {
    this.parent = p.parent
    this.elem = p.elem
    this.children = [...p.children]
  }

  static withRoot(root: Node) {
    return new Tree({ elem: root, children: [] })
  }

  findSubtree(node: Node): Tree | undefined {
    if (node === this.elem) return this

    for (const child of this.children) {
      const found = child.findSubtree(node)

      if (found) return found
    }

    return undefined
  }

  findSubtreeOrFail(node: Node) {
    const found = this.findSubtree(node)

    if (!found) throw new Error(`Node ${node} was not found in the tree`)

    return found
  }

  has(node: Node) {
    return Boolean(this.findSubtree(node))
  }

  addChild(node: Node) {
    const child = new Tree({
      parent: this,
      elem: node,
      children: [],
    })

    this.children.push(child)

    return child
  }

  pathToRoot(node: Node): Node[] {
    let currentPointer: Tree | undefined = this.findSubtreeOrFail(node)
    const path = []

    while (currentPointer) {
      path.push(currentPointer.elem)

      currentPointer = currentPointer.parent
    }

    return path
  }

  distanceToRoot(node: Node) {
    return this.pathToRoot(node).length - 1
  }
}
