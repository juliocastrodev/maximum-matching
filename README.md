# Typescript Maximum Matching 📘

Implementation of [Blossom's Algorithm](https://en.wikipedia.org/wiki/Blossom_algorithm) for Maximum Matching with [graphology](https://github.com/graphology/graphology)

## Installation 💾

```bash
yarn add maximum-matching 

# or

npm install maximum-matching 

# ...
```

## Usage 🔬

First we need to create our graph. You can use a regular one from [grapholoy](https://graphology.github.io/) or our [MatchingGraph](https://github.com/juliocastrodev/maximum-matching/blob/main/src/matchings/algorithm/MatchingGraph.ts) 
```ts
import { MatchingGraph } from "maximum-matching";

const graph = new MatchingGraph();

graph.addNode("1");
graph.addNode("2");
graph.addNode("3");
graph.addNode("4");

// 1 - 2
// |   |
// 3 - 4
graph.addEdge("1", "2");
graph.addEdge("2", "4");
graph.addEdge("4", "3");
graph.addEdge("3", "1");
```

Then we can use the [maximumMatching](https://github.com/juliocastrodev/maximum-matching/blob/main/src/matchings/algorithm/maximumMatching.ts) function to calculate it

```ts
const result = maximumMatching(graph)
// [ [ '1', '2' ], [ '3', '4' ] ]
```

# Special cases 🧐

When it is not possible to create a perfect matching (e.g. in graphs with an odd number of nodes), it can be interesting to use the ```maximumMatchingGrap``` function, which returns a [MatchingGraph](https://github.com/juliocastrodev/maximum-matching/blob/main/src/matchings/algorithm/MatchingGraph.ts) 

This is simply a subclass of ```UndirectedGraph``` from [graphology](https://github.com/graphology/graphology) with useful methods for working with matchings. 

In most cases you may not want to use them, but a very interesting one is ```.unpairedNodes()```, which lets you know which nodes are unpaired after running the algorithm

```ts
import { maximumMatchingGraph, MatchingGraph } from "maximum-matching";

const graph = new MatchingGraph();

graph.addNode("Peter");
graph.addNode("Dave");
graph.addNode("Maria");
graph.addNode("Sara");
graph.addNode("Daniel");

// Peter - Dave
//  |       |
// Maria - Sara - Daniel
graph.addEdge("Daniel", "Sara");
graph.addEdge("Sara", "Maria");
graph.addEdge("Maria", "Peter");
graph.addEdge("Peter", "Dave");
graph.addEdge("Dave", "Sara");

const resultGraph = maximumMatchingGraph(graph);

const maximumMatching = resultGraph.matching();
// [ [ 'Maria', 'Peter' ], [ 'Dave', 'Sara' ] ]

const unpairedNodes = resultGraph.unpairedNodes();
// [ 'Daniel' ]
```

calling the ```.matching()``` method in the resulting graph is the same thing as using the ```maximumMatching``` function directly.

## Theory
Formal proof: [Stanford University](https://stanford.edu/~rezab/classes/cme323/S16/projects_reports/shoemaker_vare.pdf)

Simplified proof: Made by me (Spanish)


## Author 🧑‍🔬

Developed by [Julio César Castro López](https://linkedin.com/in/julio-cesar-castro-lopez-b759491b0)