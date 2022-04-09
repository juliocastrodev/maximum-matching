import { Forest } from './Forest'
import { Tree } from './Tree'

describe('Forest', () => {
  let colorsTree: Tree
  let signsTree: Tree
  let namesTree: Tree

  let forest: Forest

  beforeEach(() => {
    colorsTree = Tree.withRoot('yellow')
    colorsTree.addChild('blue')
    colorsTree.addChild('red')

    signsTree = Tree.withRoot('+')
    signsTree.addChild('-').addChild('*').addChild('/')

    namesTree = Tree.withRoot('Dave')
    const joe = namesTree.addChild('Joe')
    joe.addChild('Maria')
    joe.addChild('Peter')

    forest = new Forest([colorsTree, signsTree, namesTree])
  })

  describe('fromRoots', () => {
    it('creates a forest with a tree for each root', () => {
      expect(Forest.fromRoots(['Apple', 'Banana', 'Caracol', 'Dragon'])).toEqual(
        new Forest([
          Tree.withRoot('Apple'),
          Tree.withRoot('Banana'),
          Tree.withRoot('Caracol'),
          Tree.withRoot('Dragon'),
        ])
      )
    })
  })

  describe('findTreeOf', () => {
    describe('when the node is not in the forest', () => {
      it('returns undefined', () => {
        expect(forest.findTreeOf('x')).toBeUndefined()
      })
    })

    describe('when the node is a root of one of the trees', () => {
      it('returns the corresponding tree', () => {
        expect(forest.findTreeOf('yellow')).toEqual(colorsTree)
      })
    })

    describe('when the node is a non-root element of one of the trees', () => {
      it('returns the corresponding tree', () => {
        expect(forest.findTreeOf('*')).toEqual(signsTree)
      })
    })
  })

  describe('findTreeOrFail', () => {
    describe('when the node is not in the forest', () => {
      it('throws an error', () => {
        expect(() => forest.findTreeOrFail('y')).toThrow('Node y was not found in the forest')
      })
    })

    describe('when the node is a root of one of the trees', () => {
      it('returns the corresponding tree', () => {
        expect(forest.findTreeOrFail('+')).toEqual(signsTree)
      })
    })

    describe('when the node is a non-root element of one of the trees', () => {
      it('returns the corresponding tree', () => {
        expect(forest.findTreeOrFail('Joe')).toEqual(namesTree)
      })
    })
  })

  describe('findSubtreeOrFail', () => {
    describe('when the node is not in the forest', () => {
      it('throws an error', () => {
        expect(() => forest.findSubtreeOrFail('z')).toThrow('Node z was not found in the forest')
      })
    })

    describe('when the node is a root of one of the trees', () => {
      it('returns the corresponding tree', () => {
        expect(forest.findSubtreeOrFail('Dave')).toEqual(namesTree)
      })
    })

    describe('when the node is a non-root element of one of the trees', () => {
      it('returns the corresponding subtree', () => {
        expect(forest.findSubtreeOrFail('*')).toEqual(signsTree.findSubtree('*'))
      })
    })
  })

  describe('has', () => {
    describe('when the node is not in the forest', () => {
      it('returns false', () => {
        expect(forest.has('t')).toEqual(false)
      })
    })

    describe('when the node is a root of one of the trees', () => {
      it('returns true', () => {
        expect(forest.has('+')).toEqual(true)
      })
    })

    describe('when the node is a non-root element of one of the trees', () => {
      it('returns true', () => {
        expect(forest.has('/')).toEqual(true)
      })
    })
  })

  describe('pathToItsRootTree', () => {
    describe('when the node is not in the forest', () => {
      it('throws an error', () => {
        expect(() => forest.pathToItsRootTree('s')).toThrow('Node s was not found in the forest')
      })
    })

    describe('when the node is a root of one of the trees', () => {
      it('returns a single element array with the root', () => {
        expect(forest.pathToItsRootTree('yellow')).toEqual(['yellow'])
      })
    })

    describe('when the node is a non-root element of one of the trees', () => {
      it('returns the corresponding path to the root from that element', () => {
        expect(forest.pathToItsRootTree('Peter')).toEqual(['Peter', 'Joe', 'Dave'])
      })
    })
  })

  describe('distanceToItsRootTree', () => {
    describe('when the node is not in the forest', () => {
      it('throws an error', () => {
        expect(() => forest.distanceToItsRootTree('t')).toThrow(
          'Node t was not found in the forest'
        )
      })
    })

    describe('when the node is a root of one of the trees', () => {
      it('returns 0', () => {
        expect(forest.distanceToItsRootTree('+')).toEqual(0)
      })
    })

    describe('when the node is a non-root element of one of the trees', () => {
      it('returns the corresponding distance to the root from that element', () => {
        expect(forest.distanceToItsRootTree('*')).toEqual(2)
      })
    })
  })

  describe('areInTheSameTree', () => {
    describe('when one of the nodes are not in the forest', () => {
      it('throws an error', () => {
        expect(() => forest.areInTheSameTree('v', 'yellow')).toThrow(
          'Node v was not found in the forest'
        )
      })
    })

    describe('when the nodes are in different trees', () => {
      it('returns false', () => {
        expect(forest.areInTheSameTree('yellow', '/')).toEqual(false)
      })
    })

    describe('when the nodes are in the same tree', () => {
      it('returns true', () => {
        expect(forest.areInTheSameTree('+', '*')).toEqual(true)
      })
    })
  })
})
