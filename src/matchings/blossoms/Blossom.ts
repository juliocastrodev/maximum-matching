import { Node } from '../../graphs/Node'
import { mod } from '../../utils/mod'
import { BlossomPathDirection } from './BlossomPathDirection'

type BlossomConstructor = {
  root: Node
  cycle: Node[]
}

export class Blossom {
  public readonly root: Node

  public readonly cycle: Node[]

  constructor({ root, cycle }: BlossomConstructor) {
    this.ensureOddCycle(cycle)
    this.ensureIsInCycle(root, cycle)

    this.root = root
    this.cycle = cycle
  }

  has(node: Node) {
    return this.cycle.includes(node)
  }

  path(
    from: Node,
    to: Node,
    { direction = BlossomPathDirection.CLOCK_WISE as BlossomPathDirection } = {}
  ): Node[] {
    this.ensureIsInBlossom(from)
    this.ensureIsInBlossom(to)

    const startIndex = this.cycle.findIndex((node) => node === from)
    const indexInc = direction === BlossomPathDirection.CLOCK_WISE ? 1 : -1

    const path: Node[] = []
    for (let i = startIndex; path[path.length - 1] !== to; i = mod(i + indexInc, this.cycle.length))
      path.push(this.cycle[i])

    return path
  }

  evenPath(from: Node, to: Node): Node[] {
    const clockWisePath = this.path(from, to, {
      direction: BlossomPathDirection.CLOCK_WISE,
    })

    const clockWisePathLength = clockWisePath.length - 1
    if (clockWisePathLength % 2 === 0) return clockWisePath

    return this.path(from, to, { direction: BlossomPathDirection.COUNTER_CLOCK_WISE })
  }

  private ensureOddCycle(cycle: Node[]) {
    if (cycle.length % 2 === 0) throw new Error(`Blossom cycle is not odd`)
  }

  private ensureIsInCycle(node: Node, cycle: Node[]) {
    if (!cycle.includes(node)) throw new Error(`${node} was not found in cycle`)
  }

  private ensureIsInBlossom(node: Node) {
    if (!this.has(node)) throw new Error(`${node} was not found in the Blossom`)
  }
}
