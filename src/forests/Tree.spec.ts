import { Tree } from './Tree'

describe('Tree', () => {
  let tree: Tree

  describe('withRoot', () => {
    it('creates a Tree only with the passed root', () => {
      expect(Tree.withRoot('1')).toEqual(new Tree({ elem: '1', children: [] }))
    })
  })

  describe('findSubtree', () => {
    describe('when the tree has only its root', () => {
      beforeEach(() => {
        tree = Tree.withRoot('x')
      })

      describe('and the node is not the root', () => {
        it('returns undefined', () => {
          expect(tree.findSubtree('y')).toBeUndefined()
        })
      })

      describe('and the node is actually the root', () => {
        it('returns the whole tree', () => {
          expect(tree.findSubtree('x')).toEqual(tree)
        })
      })
    })

    describe('when the tree has a few elements', () => {
      beforeEach(() => {
        // 0
        // |-1
        // |-2-3
        // |-4

        tree = Tree.withRoot('0')
        tree.addChild('1')
        tree.addChild('2').addChild('3')
        tree.addChild('4')
      })

      describe('and the node is not in the tree', () => {
        it('returns undefined', () => {
          expect(tree.findSubtree('x')).toBeUndefined()
        })
      })

      describe('and the node is the root', () => {
        it('returns the whole tree', () => {
          expect(tree.findSubtree('0')).toEqual(tree)
        })
      })

      describe('and the node is in the tree but it is not the root', () => {
        it('returns the corresponding subtree', () => {
          const subtree = tree.findSubtree('2')

          expect(subtree).not.toEqual(tree)
          expect(subtree?.has('0')).toEqual(false)
          expect(subtree?.has('1')).toEqual(false)
          expect(subtree?.has('2')).toEqual(true)
          expect(subtree?.has('3')).toEqual(true)
          expect(subtree?.has('4')).toEqual(false)
        })
      })
    })
  })

  describe('findSubtreeOrFail', () => {
    describe('when the tree has only its root', () => {
      beforeEach(() => {
        tree = Tree.withRoot('a')
      })

      describe('and the node is not the root', () => {
        it('throws an error', () => {
          expect(() => tree.findSubtreeOrFail('b')).toThrow('Node b was not found in the tree')
        })
      })

      describe('and the node is actually the root', () => {
        it('returns the whole tree', () => {
          expect(tree.findSubtreeOrFail('a')).toEqual(tree)
        })
      })
    })

    describe('when the tree has a few elements', () => {
      beforeEach(() => {
        // a
        // |-b-c
        // |-d-e
        // |-f

        tree = Tree.withRoot('a')
        tree.addChild('b').addChild('c')
        tree.addChild('d').addChild('e')
        tree.addChild('f')
      })

      describe('and the node is not in the tree', () => {
        it('throws an error', () => {
          expect(() => tree.findSubtreeOrFail('z')).toThrow('Node z was not found in the tree')
        })
      })

      describe('and the node is the root', () => {
        it('returns the whole tree', () => {
          expect(tree.findSubtreeOrFail('a')).toEqual(tree)
        })
      })

      describe('and the node is in the tree but it is not the root', () => {
        it('returns the corresponding subtree', () => {
          const subtree = tree.findSubtreeOrFail('f')

          expect(subtree).not.toEqual(tree)
          expect(subtree.has('a')).toEqual(false)
          expect(subtree.has('b')).toEqual(false)
          expect(subtree.has('c')).toEqual(false)
          expect(subtree.has('d')).toEqual(false)
          expect(subtree.has('e')).toEqual(false)
          expect(subtree.has('f')).toEqual(true)
        })
      })
    })
  })

  describe('has', () => {
    describe('when the tree has only its root', () => {
      beforeEach(() => {
        tree = Tree.withRoot('s')
      })

      describe('and the node is not the root', () => {
        it('returns false', () => {
          expect(tree.has('p')).toEqual(false)
        })
      })

      describe('and the node is actually the root', () => {
        it('returns true', () => {
          expect(tree.has('s')).toEqual(true)
        })
      })
    })

    describe('when the tree has a few elements', () => {
      beforeEach(() => {
        // s
        // |-x1
        // |-y1-y2
        // |-z1-z2-z3

        tree = Tree.withRoot('s')
        tree.addChild('x1')
        tree.addChild('y1').addChild('y2')
        tree.addChild('z1').addChild('z2').addChild('z3')
      })

      describe('and the node is not in the tree', () => {
        it('returns false', () => {
          expect(tree.has('v')).toEqual(false)
        })
      })

      describe('and the node is the root', () => {
        it('returns true', () => {
          expect(tree.has('s')).toEqual(true)
        })
      })

      describe('and the node is in the tree but it is not the root', () => {
        it('returns true', () => {
          expect(tree.has('x1')).toEqual(true)
          expect(tree.has('y1')).toEqual(true)
          expect(tree.has('y2')).toEqual(true)
          expect(tree.has('z1')).toEqual(true)
          expect(tree.has('z2')).toEqual(true)
          expect(tree.has('z3')).toEqual(true)
        })
      })
    })
  })

  describe('pathToRoot', () => {
    describe('when the tree has only its root', () => {
      beforeEach(() => {
        tree = Tree.withRoot('0')
      })

      describe('and the node is not the root', () => {
        it('throws an error', () => {
          expect(() => tree.pathToRoot('1')).toThrow('Node 1 was not found in the tree')
        })
      })

      describe('and the node is actually the root', () => {
        it('returns an array with a single element: the root', () => {
          expect(tree.pathToRoot('0')).toEqual(['0'])
        })
      })
    })

    describe('when the tree has a few elements', () => {
      beforeEach(() => {
        // 0
        // |-1-2-3
        // | |   |- 4
        // | |   |- 5
        // | |-6
        // |-7-8
        //   |-9

        tree = Tree.withRoot('0')
        tree.addChild('1').addChild('2').addChild('3')
        tree.findSubtreeOrFail('3').addChild('4')
        tree.findSubtreeOrFail('3').addChild('5')
        tree.findSubtreeOrFail('1').addChild('6')
        tree.addChild('7').addChild('8')
        tree.findSubtreeOrFail('7').addChild('9')
      })

      describe('and the node is not in the tree', () => {
        it('throws an error', () => {
          expect(() => tree.pathToRoot('x')).toThrow('Node x was not found in the tree')
        })
      })

      describe('and the node is the root', () => {
        it('returns an array with a single element: the root', () => {
          expect(tree.pathToRoot('0')).toEqual(['0'])
        })
      })

      describe('and the node is in the tree but it is not the root', () => {
        it('returns the corresponding path to the root from that node', () => {
          expect(tree.pathToRoot('5')).toEqual(['5', '3', '2', '1', '0'])
        })
      })
    })
  })

  describe('distanceToRoot', () => {
    describe('when the tree has only its root', () => {
      beforeEach(() => {
        tree = Tree.withRoot('origin')
      })

      describe('and the node is not the root', () => {
        it('throws an error', () => {
          expect(() => tree.distanceToRoot('fail')).toThrow('Node fail was not found in the tree')
        })
      })

      describe('and the node is actually the root', () => {
        it('returns 0', () => {
          expect(tree.distanceToRoot('origin')).toEqual(0)
        })
      })
    })

    describe('when the tree has a few elements', () => {
      beforeEach(() => {
        // origin
        // |- spain - italy
        // |    |- portugal
        // |
        // |- england - ireland - usa
        // |    |- iceland
        // |- germany - russia

        tree = Tree.withRoot('origin')
        tree.addChild('spain').addChild('italy')
        tree.findSubtreeOrFail('spain').addChild('portugal')
        tree.addChild('england').addChild('ireland').addChild('usa')
        tree.findSubtreeOrFail('england').addChild('iceland')
        tree.addChild('germany').addChild('russia')
      })

      describe('and the node is not in the tree', () => {
        it('throws an error', () => {
          expect(() => tree.distanceToRoot('x')).toThrow('Node x was not found in the tree')
        })
      })

      describe('and the node is the root', () => {
        it('returns 0', () => {
          expect(tree.distanceToRoot('origin')).toEqual(0)
        })
      })

      describe('and the node is in the tree but it is not the root', () => {
        it('returns the corresponding distance to the root', () => {
          expect(tree.distanceToRoot('usa')).toEqual(3)
        })
      })
    })
  })
})
