import { TileCoord } from "../BattleTypes";
import { tileCoordToInteger } from "../BattleHelpers";

function pathTo(node: GridNode) {
  var curr = node;
  var path = [];
  while (curr.parent) {
    path.unshift({ x: curr.x, y: curr.y });
    curr = curr.parent;
  }
  return path;
}

function getHeap() {
  return new BinaryHeap<GridNode>(function(node: GridNode) {
    return node.f;
  });
}

type OptionsType = {
  heuristic?: Function;
  closest?: Boolean;
  adjacent?: Boolean;
}

const astar = {
    /**
    * Perform an A* Search on a graph given a start and end node.
    * @param {Graph} graph
    * @param {GridNode} start
    * @param {GridNode} end
    * @param {Object} [options]
    * @param {bool} [options.closest] Specifies whether to return the
               path to the closest node if the target is unreachable.
    * @param {Function} [options.heuristic] Heuristic function (see
    *          astar.heuristics).
    */
    search: function(graph: Graph, startCoord: TileCoord, endCoord: TileCoord, options?: OptionsType) {
      graph.cleanDirty();
      options = options || {};
      var heuristic = options.heuristic || astar.heuristics.manhattan;
      var closest = options.closest || false;
  
      var openHeap = getHeap();
      
      const startNode = graph.getAt(startCoord);
      const endNode = graph.getAt(endCoord);
      
      var closestNode = startNode; // set the start node to be the closest if required

      startNode.h = heuristic(startNode, endNode);
      graph.markDirty(startNode);
  
      openHeap.push(startNode);
      let numIterations = 0;
  
      while (openHeap.size() > 0 && numIterations <= 100) {
        numIterations += 1;

        // Grab the lowest f(x) to process next.  Heap keeps this sorted for us.
        var currentNode = openHeap.pop();
  
        // End case -- result has been found, return the traced path.
        if (currentNode === endNode || options.adjacent && heuristic(currentNode, endNode) === 1) {
          return pathTo(currentNode);
        }
  
        // Normal case -- move currentNode from open to closed, process each of its neighbors.
        currentNode.closed = true;
  
        // Find all neighbors for the current node.
        var neighbors = graph.neighbors(currentNode);
  
        for (var i = 0, il = neighbors.length; i < il; ++i) {
          var neighbor = neighbors[i];
  
          if (neighbor.closed || neighbor.isWall()) {
            // Not a valid node to process, skip to next neighbor.
            continue;
          }
  
          // The g score is the shortest distance from start to current node.
          // We need to check if the path we have arrived at this neighbor is the shortest one we have seen yet.
          var gScore = currentNode.g + neighbor.getCost(currentNode);
          var beenVisited = neighbor.visited;
  
          if (!beenVisited || gScore < neighbor.g) {
  
            // Found an optimal (so far) path to this node.  Take score for node to see how good it is.
            neighbor.visited = true;
            neighbor.parent = currentNode;
            neighbor.h = neighbor.h || heuristic(neighbor, endNode);
            neighbor.g = gScore;
            neighbor.f = neighbor.g + neighbor.h;
            graph.markDirty(neighbor);
            if (closest) {
              // If the neighbour is closer than the current closestNode or if it's equally close but has
              // a cheaper path than the current closest node then it becomes the closest node
              if (neighbor.h < closestNode.h || (neighbor.h === closestNode.h && neighbor.g < closestNode.g)) {
                closestNode = neighbor;
              }
            }
  
            if (!beenVisited) {
              // Pushing to heap will put it in proper place based on the 'f' value.
              openHeap.push(neighbor);
            } else {
              // Already seen the node, but since it has been rescored we need to reorder it in the heap
              openHeap.rescoreElement(neighbor);
            }
          }
        }
      }
  
      if (closest) {
        return pathTo(closestNode);
      }
  
      // No result was found - empty array signifies failure to find path.
      return [];
    },
    // See list of heuristics: http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html
    heuristics: {
      manhattan: function(pos0: TileCoord, pos1: TileCoord) {
        var d1 = Math.abs(pos1.x - pos0.x);
        var d2 = Math.abs(pos1.y - pos0.y);
        return d1 + d2;
      },
      diagonal: function(pos0: TileCoord, pos1: TileCoord) {
        var D = 1;
        var D2 = Math.sqrt(2);
        var d1 = Math.abs(pos1.x - pos0.x);
        var d2 = Math.abs(pos1.y - pos0.y);
        return (D * (d1 + d2)) + ((D2 - (2 * D)) * Math.min(d1, d2));
      }
    },
    cleanNode: function(node: GridNode) {
      node.f = 0;
      node.g = 0;
      node.h = 0;
      node.visited = false;
      node.closed = false;
      node.parent = null;
    }
};
  
/**
 * A graph memory structure
 * @param {Array} gridIn 2D array of input weights
 * @param {Object} [options]
 * @param {bool} [options.diagonal] Specifies whether diagonal moves are allowed
 */
type OptionsShape = {
  diagonal?: Boolean;
}
class Graph {
  diagonal: boolean;
  weightFunction: Function;
  gridSize: TileCoord;
  grid: { [key: number]: GridNode };
  nodes: Array<GridNode>;
  dirtyNodes: Array<GridNode>;
  constructor(weightFunction: Function, mapSize: TileCoord, options?: OptionsShape) {
    options = options || {};
    this.diagonal = !!options.diagonal;
    this.weightFunction = weightFunction;
    this.gridSize = mapSize;
    this.grid = {};
    this.nodes = [];
    this.init();
  }

  getAt(coord: TileCoord): GridNode {
    if (coord.x < 0 || coord.x >= this.gridSize.x || coord.y < 0 || coord.y >= this.gridSize.y) {
      return null;
    }
    const tileNum = tileCoordToInteger(coord);
    if (!this.grid[tileNum]) {
      this.grid[tileNum] = new GridNode(coord.x, coord.y, this.weightFunction(coord));
    }
  
    return this.grid[tileNum];
  }

  init() {
    this.dirtyNodes = [];
    for (var i = 0; i < this.nodes.length; i++) {
      astar.cleanNode(this.nodes[i]);
    }
  };
  
  cleanDirty() {
    for (var i = 0; i < this.dirtyNodes.length; i++) {
      astar.cleanNode(this.dirtyNodes[i]);
    }
    this.dirtyNodes = [];
  };
  
  markDirty(node: GridNode) {
    this.dirtyNodes.push(node);
  };
  
  neighbors(node: GridNode) {
    var ret = [];
    var x = node.x;
    var y = node.y;
  
    // West
    const west = this.getAt({x: x - 1, y: y});
    west && ret.push(west);
  
    // East
    const east = this.getAt({x: x + 1, y: y});
    east && ret.push(east);
  
    // South
    const south = this.getAt({x: x, y: y + 1});
    south && ret.push(south);
  
    // North
    const north = this.getAt({x: x, y: y - 1});
    north && ret.push(north);
  
    return ret;
  };
}

Graph.prototype.toString = function() {
  var graphString = [];
  var nodes = this.grid;
  for (var x = 0; x < nodes.length; x++) {
    var rowDebug = [];
    var row = nodes[x];
    for (var y = 0; y < row.length; y++) {
      rowDebug.push(row[y].weight);
    }
    graphString.push(rowDebug.join(" "));
  }
  return graphString.join("\n");
};

class GridNode {
  parent: GridNode;
  x: number;
  y: number;
  weight: number;

  f: number = 0;
  g: number = 0;
  h: number = 0;
  visited: Boolean = false;
  closed: Boolean = false;
  
  constructor(x: number, y: number, weight: number) {
    this.x = x;
    this.y = y;
    this.weight = weight;
  }

  getCost(fromNeighbor: GridNode) {
    // Take diagonal weight into consideration.
    if (fromNeighbor && fromNeighbor.x != this.x && fromNeighbor.y != this.y) {
      return this.weight * 1.41421;
    }
    return this.weight;
  };

  isWall() {
    return this.weight === 0;
  }
}

GridNode.prototype.toString = function() {
  return "[" + this.x + " " + this.y + "]";
};

class BinaryHeap<T> {
  content: Array<T>;
  scoreFunction: Function;
  constructor(scoreFunction: Function) {
    this.content = [];
    this.scoreFunction = scoreFunction;
  }

  push(element: T) {
    // Add the new element to the end of the array.
    this.content.push(element);

    // Allow it to sink down.
    this.sinkDown(this.content.length - 1);
  }

  pop() {
    // Store the first element so we can return it later.
    var result = this.content[0];
    // Get the element at the end of the array.
    var end = this.content.pop();
    // If there are any elements left, put the end element at the
    // start, and let it bubble up.
    if (this.content.length > 0) {
      this.content[0] = end;
      this.bubbleUp(0);
    }
    return result;
  }

  remove(node: T) {
    var i = this.content.indexOf(node);

    // When it is found, the process seen in 'pop' is repeated
    // to fill up the hole.
    var end = this.content.pop();

    if (i !== this.content.length - 1) {
      this.content[i] = end;

      if (this.scoreFunction(end) < this.scoreFunction(node)) {
        this.sinkDown(i);
      } else {
        this.bubbleUp(i);
      }
    }
  }

  size() {
    return this.content.length;
  }

  rescoreElement(node: T) {
    this.sinkDown(this.content.indexOf(node));
  }

  sinkDown(n: number) {
    // Fetch the element that has to be sunk.
    var element = this.content[n];

    // When at 0, an element can not sink any further.
    while (n > 0) {

      // Compute the parent element's index, and fetch it.
      var parentN = ((n + 1) >> 1) - 1;
      var parent = this.content[parentN];
      // Swap the elements if the parent is greater.
      if (this.scoreFunction(element) < this.scoreFunction(parent)) {
        this.content[parentN] = element;
        this.content[n] = parent;
        // Update 'n' to continue at the new position.
        n = parentN;
      }
      // Found a parent that is less, no need to sink any further.
      else {
        break;
      }
    }
  }

  bubbleUp(n: number) {
    // Look up the target element and its score.
    var length = this.content.length;
    var element = this.content[n];
    var elemScore = this.scoreFunction(element);

    while (true) {
      // Compute the indices of the child elements.
      var child2N = (n + 1) << 1;
      var child1N = child2N - 1;
      // This is used to store the new position of the element, if any.
      var swap = null;
      var child1Score;
      // If the first child exists (is inside the array)...
      if (child1N < length) {
        // Look it up and compute its score.
        var child1 = this.content[child1N];
        child1Score = this.scoreFunction(child1);

        // If the score is less than our element's, we need to swap.
        if (child1Score < elemScore) {
          swap = child1N;
        }
      }

      // Do the same checks for the other child.
      if (child2N < length) {
        var child2 = this.content[child2N];
        var child2Score = this.scoreFunction(child2);
        if (child2Score < (swap === null ? elemScore : child1Score)) {
          swap = child2N;
        }
      }

      // If the element needs to be moved, swap it, and continue.
      if (swap !== null) {
        this.content[n] = this.content[swap];
        this.content[swap] = element;
        n = swap;
      }
      // Otherwise, we are done.
      else {
        break;
      }
    }
  }
}

export {
  astar,
  Graph
};