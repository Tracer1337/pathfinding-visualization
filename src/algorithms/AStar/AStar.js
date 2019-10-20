import Emitter from "../../utils/Emitter.js"
import sleep from "../../utils/sleep.js"
import Node from "./Node.js"

export default class AStar extends Emitter{
    static heuristics = [
        // Manhattan Distance
        (currentNode, endNode) => Math.abs(currentNode.x-endNode.x)+Math.abs(currentNode.y-endNode.y),
        // Diagonal Distance
        (currentNode, endNode) => Math.max(Math.abs(currentNode.x-endNode.x),Math.abs(currentNode.y-endNode.y)),
        // Euclidean Distance
        (currentNode, endNode) => ((currentNode.x-endNode.x)**2+(currentNode.y-endNode.y)**2)**(1/2)
    ]

    // Allowed directions to move
    static directions = [
        // Up, Down, Left, Right
        [
                      [0, -1],
            [-1,  0],          [1,  0],
                      [0,  1]
        ],
        // All Directions
        [
            [-1, -1], [0, -1], [1, -1],
            [-1,  0],          [1,  0],
            [-1,  1], [0,  1], [1,  1]
        ]
    ]

    constructor(start, end, grid){
        super()
        this.startNode = new Node(...start)
        this.endNode = new Node(...end)
        this.grid = grid
        this.openList = [this.startNode]
        this.closedList = []

        this.setHeuristic(0)
        this.setDirections(0)
    }

    setFramerate = framerate => this.framerate = framerate
    setHeuristic = heuristicNr => this.heuristic = AStar.heuristics[heuristicNr]
    setDirections = directionsNr => this.directions = AStar.directions[directionsNr]

    getNodeInList(list, node){
        return list.find(nodeInList => nodeInList.equal(node))
    }

    async findPath(){
        while(this.openList.length){
            // Find the node with least f in the open list
            let currentNode = this.openList[0]
            let currentNodeIndex = 0
            for(let i = 0; i < this.openList.length; i++){
                if(this.openList[i].f < currentNode.f){
                    currentNode = this.openList[i]
                    currentNodeIndex = i
                }
            }

            // Remove currentNode from the open list and add it to the closed list
            this.openList.splice(currentNodeIndex, 1)
            this.closedList.push(currentNode)

            // Found the goal
            if(currentNode.equal(this.endNode)){
                // Follow the path to the starting node, beginning from the end node
                let path = []
                let current = currentNode
                while(current){
                    path.push([current.x, current.y])
                    current = current.parentNode
                }
                return Promise.resolve(path.reverse())
            }

            // Generate currentNode's adjacent nodes and set their parents to currentNode
            let children = []
            // Check allowed nodes
            for(let dir of this.directions){
                // Apply dir to currentNodes position to get the new x, y
                let x = currentNode.x+dir[0]
                let y = currentNode.y+dir[1]

                // Do not proceed if the node is not inside the grid
                if(x < 0 || y < 0 ||
                   x >= this.grid[0].length || y >= this.grid.length)
                   continue

                // Do not proceed if the node is not walkable
                if(this.grid[y][x] === 1)
                    continue

                // Add new node to the children
                children.push(new Node(x, y, currentNode))
            }

            const newOpenListNodes = []
            for(let child of children){
                // Child is already in the closed list
                if(this.getNodeInList(this.closedList, child)){
                    continue
                }

                // Create the g, h and f values
                child.g = currentNode.g + 1
                child.h = this.heuristic(child, this.endNode)
                child.f = child.g + child.h

                // Child is already in the open list
                let nodeInOpenList = this.getNodeInList(this.openList, child)
                if(nodeInOpenList && child.g >= nodeInOpenList.g){
                    continue
                }

                // Add child to the open list
                this.openList.push(child)
                newOpenListNodes.push(child)
            }

            // Visualization bridge
            this.dispatchEvent(new CustomEvent("nextIteration", {detail: {
                currentNode,
                newOpenListNodes,
                newClosedListNode: this.closedList.length>1 && this.closedList[this.closedList.length-2]
            }}))

            if(this.framerate){
                await sleep(1/this.framerate*1000)
            }
        }
    }
}
